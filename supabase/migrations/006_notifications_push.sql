-- =============================================
-- Notifications & Push Tokens
-- =============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('booking', 'promo', 'price', 'reminder', 'system')),
  data JSONB DEFAULT '{}'::jsonb,
  channel TEXT DEFAULT 'push' CHECK (channel IN ('push', 'in_app', 'email')),
  delivery_status TEXT DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('expo', 'fcm', 'apns')),
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  device_id TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (token)
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_push_tokens_user ON push_tokens(user_id);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications"
  ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Push tokens policies
CREATE POLICY "Users can view their own push tokens"
  ON push_tokens FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own push tokens"
  ON push_tokens FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Updated_at trigger for push_tokens
CREATE TRIGGER update_push_tokens_updated_at
  BEFORE UPDATE ON push_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Notification trigger on bookings
CREATE OR REPLACE FUNCTION public.notify_booking_created()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.notifications (user_id, title, message, type, data, channel)
  VALUES (
    NEW.user_id,
    'Booking confirmed',
    'Your booking is confirmed. We will keep you posted.',
    'booking',
    jsonb_build_object(
      'booking_id', NEW.id,
      'status', NEW.status,
      'destination_id', NEW.destination_id,
      'tour_id', NEW.tour_id
    ),
    'in_app'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_booking_created_notify ON bookings;
CREATE TRIGGER on_booking_created_notify
  AFTER INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION public.notify_booking_created();

CREATE OR REPLACE FUNCTION public.notify_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.notifications (user_id, title, message, type, data, channel)
    VALUES (
      NEW.user_id,
      'Booking update',
      'Your booking status has changed.',
      'booking',
      jsonb_build_object(
        'booking_id', NEW.id,
        'status', NEW.status,
        'destination_id', NEW.destination_id,
        'tour_id', NEW.tour_id
      ),
      'in_app'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_booking_status_notify ON bookings;
CREATE TRIGGER on_booking_status_notify
  AFTER UPDATE OF status ON bookings
  FOR EACH ROW EXECUTE FUNCTION public.notify_booking_status_change();
