-- =============================================
-- Incontournables Upsert (Benin Tourisme)
-- =============================================

-- Featured destinations (including updates)
INSERT INTO destinations (
  id, name_en, name_fr, subtitle_en, subtitle_fr,
  description_en, description_fr, rating, reviews_count,
  image, category, type
) VALUES
('ganvie', 'Ganvie', 'Ganvié', 'The Venice of Africa', 'La Venise de l''Afrique',
 'A wonderful lake city at the heart of Benin, a few kilometers from the economic capital, Cotonou. Discover Ganvie, a hidden treasure in West Africa.',
 'Merveilleuse ville lacustre située au cœur du Bénin, à quelques kilomètres de la capitale économique, Cotonou. Découvrez Ganvié, un trésor caché au cœur de l''Afrique occidentale.',
 4.6, 540, 'https://benintourisme.bj/upload/thumbnails/banners//728410799111001708442794.jpg', 'Culture', 'featured'),

('amazone', 'The Amazone', 'L’Amazone', 'Cotonou', 'Cotonou',
 'During a visit to Cotonou, the Amazone is a must-see. This emblematic statue embodies strength, dignity, and resilience, paying tribute to female heroism and Benin''s history.',
 'Lors d''une visite à Cotonou, l''Amazone est une étape incontournable. Cette statue emblématique incarne la force, la dignité et la résilience. Elle représente un hommage vibrant à l''héroïsme féminin et à la richesse de l''histoire béninoise.',
 4.6, 0, 'https://benintourisme.bj/upload/thumbnails/banners//518600580030001708442568.jpg', 'Culture', 'featured'),

('mur-graffe', 'The Graffiti Wall', 'Le mur graffé', 'Cotonou', 'Cotonou',
 'An artistic jewel in the heart of Benin''s capital. Along this colorful wall, creativity bursts with audacity. Here, art meets urban life for an unforgettable visual and cultural experience.',
 'Un joyau artistique s''épanouit au cœur de la capitale béninoise. Le long de ce mur coloré, une créativité débordante s''exprime avec audace. Ici, l''art rencontre l''urbanité pour offrir aux passants une expérience visuelle et culturelle inoubliable.',
 4.6, 0, 'https://benintourisme.bj/upload/thumbnails/banners//398760049759001708442607.jpg', 'Culture', 'featured'),

('route-des-peches', 'Route des Pêches', 'La route des pêches', 'Atlantic Coast', 'Littoral Atlantique',
 'Along the shimmering waters of the Gulf of Guinea stretches a panoramic road dotted with fishing villages and breathtaking coastal scenery.',
 'Au bord des eaux scintillantes du golfe de Guinée, s''étend une route panoramique parsemée de villages de pêcheurs pittoresques et de paysages côtiers à couper le souffle : bienvenue sur la Route des Pêches !',
 4.6, 0, 'https://benintourisme.bj/upload/thumbnails/banners//271490396816001703041423.jpg', 'Relaxation', 'featured'),

('plage-plm-el-dorado', 'PLM El Dorado Beach', 'Plage PLM El Dorado', 'Cotonou', 'Cotonou',
 'On Benin''s Atlantic coast, PLM El Dorado beach in Cotonou is more than a sandy shore: a haven for relaxation and entertainment.',
 'Située sur la côte atlantique du Bénin, la plage PLM El Dorado à Cotonou est bien plus qu''un simple littoral de sable : c''est un havre de paix et de divertissement où les visiteurs peuvent se détendre, se ressourcer et se divertir.',
 4.6, 0, 'https://benintourisme.bj/upload/thumbnails/banners//795340395530001708442687.jpg', 'Relaxation', 'featured')
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_fr = EXCLUDED.name_fr,
  subtitle_en = EXCLUDED.subtitle_en,
  subtitle_fr = EXCLUDED.subtitle_fr,
  description_en = EXCLUDED.description_en,
  description_fr = EXCLUDED.description_fr,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  image = EXCLUDED.image,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  updated_at = NOW();

-- Heritage destinations (including updates)
INSERT INTO destinations (
  id, name_en, name_fr, subtitle_en, subtitle_fr,
  description_en, description_fr, rating, reviews_count,
  image, category, type, price, hours, duration, images
) VALUES
('pendjari', 'Pendjari National Park', 'Parc de la Pendjari', 'Atacora', 'Atacora',
 'With spectacular landscapes, abundant wildlife, and endless adventure opportunities, this national park is a top destination for nature lovers and travelers.',
 'Avec ses paysages spectaculaires, sa faune sauvage abondante et ses opportunités d''aventure sans fin, ce parc national est une destination de choix pour les amoureux de la nature et les passionnés de voyage.',
 4.9, 89, 'https://benintourisme.bj/upload/thumbnails/banners//834760438538001728494098.jpg', 'Nature', 'heritage',
 NULL, NULL, NULL, '[]'),

('route-des-tata', 'Route des Tata', 'La route des Tata', 'Atacora', 'Atacora',
 'In the heart of Atacora, the Route des Tata and Koutammakou reveal themselves as unique treasures of Benin, listed as UNESCO World Heritage—places where history and culture meet a spectacular landscape.',
 'Au cœur de l''Atacora, la Route des Tata et le Koutammakou se dévoilent comme des trésors uniques du Bénin, inscrits au patrimoine mondial de l''UNESCO. Lieux où l''histoire et la culture se rencontrent dans un paysage spectaculaire.',
 4.6, 0, 'https://benintourisme.bj/upload/thumbnails/banners//524600414734001716379105.jpg', 'Heritage', 'heritage',
 NULL, NULL, NULL, '[]')
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_fr = EXCLUDED.name_fr,
  subtitle_en = EXCLUDED.subtitle_en,
  subtitle_fr = EXCLUDED.subtitle_fr,
  description_en = EXCLUDED.description_en,
  description_fr = EXCLUDED.description_fr,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  image = EXCLUDED.image,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  price = EXCLUDED.price,
  hours = EXCLUDED.hours,
  duration = EXCLUDED.duration,
  images = EXCLUDED.images,
  updated_at = NOW();
