-- =============================================
-- North Benin Destinations Upsert
-- =============================================

INSERT INTO destinations (
  id, name_en, name_fr, subtitle_en, subtitle_fr,
  description_en, description_fr, rating, reviews_count,
  image, category, type, price, hours, duration, images
) VALUES
('w-national-park', 'W National Park', 'Parc national du W', 'Alibori', 'Alibori',
 'A protected area in northern Benin, part of the transboundary W-Arly-Pendjari complex.',
 'Aire protégée du nord du Bénin, faisant partie du complexe transfrontalier W-Arly-Pendjari.',
 0, 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Mekrou_river_in_W-National_Park_MS_6380.JPG/330px-Mekrou_river_in_W-National_Park_MS_6380.JPG', 'Nature', 'heritage',
 NULL, NULL, NULL, '[]'),

('koutammakou', 'Koutammakou (Batammariba)', 'Koutammakou (Batammariba)', 'Atacora', 'Atacora',
 'A living cultural landscape known for Batammariba earthen tower-houses (takienta), listed as UNESCO World Heritage.',
 'Paysage culturel vivant des Batammariba, connu pour les maisons-tours en terre (takienta), classé au patrimoine mondial de l''UNESCO.',
 0, 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Togo_Taberma_house_02.jpg/330px-Togo_Taberma_house_02.jpg', 'Heritage', 'heritage',
 NULL, NULL, NULL, '[]'),

('tanougou-falls', 'Tanougou Falls', 'Chutes de Tanougou', 'Atacora (Tanguiéta)', 'Atacora (Tanguiéta)',
 'Waterfalls near the village of Tanougou in the Atacora, a popular nature stop near Pendjari.',
 'Chutes d''eau situées près du village de Tanougou, dans l''Atacora, une halte nature appréciée proche de la Pendjari.',
 0, 0, 'https://upload.wikimedia.org/wikipedia/commons/3/32/Chutes_de_Tanougou_%283%29.jpg', 'Nature', 'heritage',
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
