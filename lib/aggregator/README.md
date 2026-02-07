# Aggregator Integration (stub)

This folder is a placeholder for a future channel‑manager integration.

Recommended approach:
- Implement a `ProviderAdapter` in this folder (Guesty/Hostaway/Lodgify/Beds24).
- Set `isEnabled = true` in `providerRegistry` once credentials are configured.
- Replace the local offer simulator in `lib/booking.ts` with a real provider call.
