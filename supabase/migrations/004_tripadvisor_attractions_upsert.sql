-- =============================================
-- TripAdvisor Attractions Upsert (Benin)
-- =============================================

INSERT INTO destinations (
  id, name_en, name_fr, subtitle_en, subtitle_fr,
  description_en, description_fr, rating, reviews_count,
  image, category, type
) VALUES
('babs-dock', 'Bab''s Dock', 'Bab''s Dock', 'Ganvie', 'Ganvié',
 'A scenic lagoon-side stop where the setting and wildlife make for a memorable visit.',
 'Sur place le cadre est magique, la lagune, les animaux (ânes, tortues, alligators, singes) raviront les enfants.',
 4.3, 94, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/a1/c4/b1/tramonto-a-bob-s-dock.jpg?h=-1&s=1&w=500', 'Relaxation', 'featured'),

('marche-dantokpa', 'Marché Dantokpa', 'Marché Dantokpa', 'Cotonou', 'Cotonou',
 'A sprawling market where you can find nearly anything and get lost in lively alleys.',
 'Quelque soit le produit recherché, il se trouve à Dantokpa. Quel plaisir de se perdre dans les allées de ce marché.',
 4.0, 63, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/73/38/2b/marche-dantokpa.jpg?h=400&s=1&w=500', 'Culture', 'featured'),

('porte-du-non-retour', 'Door of No Return', 'La Porte du Non Retour', 'Ouidah', 'Ouidah',
 'A poignant memorial site often visited with guides for historical context.',
 'Visite plus qu''émouvante pour qui bénéficiera de la présence et des explications d''un guide.',
 4.1, 67, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/21/62/d2/47/ouidah-s-non-retour-gate.jpg?h=-1&s=1&w=500', 'Heritage', 'featured'),

('lac-nokoue', 'Lake Nokoué', 'Lac Nokoué', 'Near Ganvie', 'Près de Ganvié',
 'A lake best known for excursions to the stilt city of Ganvié.',
 'Le lac de Nokoue est surtout intéressant pour la visite de la cité lacustre de Ganvié, avec ses maisons sur pilotis.',
 4.4, 32, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/16/35/2d/lac-nokoue.jpg?h=400&s=1&w=500', 'Nature', 'featured'),

('temple-des-pythons', 'Python Temple', 'Temple des Pythons', 'Ouidah', 'Ouidah',
 'A Vodoun worship site where pythons are revered and protected.',
 'Lieu de culte Vodoun où le serpent python est toujours adoré et protégé.',
 3.6, 27, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/9b/a0/f8/img-20190220-123547013.jpg?h=-1&s=1&w=500', 'Culture', 'featured'),

('fidjrosse-beach', 'Fidjrosse Beach', 'Plage de Fidjrossè', 'Cotonou', 'Cotonou',
 'A coastal stretch popular for walks along the seaside road toward Ouidah.',
 'Belle promenade sur la nouvelle route et sur la côte en direction d''Ouidah.',
 3.6, 25, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/57/1b/12/amoureux-de-la-nature.jpg?h=400&s=1&w=500', 'Relaxation', 'featured'),

('artisanal-center', 'Artisanal Center', 'Artisanal Center', 'Cotonou', 'Cotonou',
 'A crafts hub with bronze work and artisanal pieces, including older items.',
 'Il y a de très belles pièces, parfois anciennes, y compris en bronze.',
 3.8, 25, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/93/b5/ce/artisanal-center.jpg?h=400&s=1&w=500', 'Culture', 'featured'),

('grande-mosquee-porto-novo', 'Great Mosque of Porto-Novo', 'La grande mosquée de Porto-Novo', 'Porto-Novo', 'Porto-Novo',
 'A landmark religious site in Benin’s administrative capital.',
 'Porto-Novo est la capitale administrative du Bénin; sa grande mosquée est un site religieux majeur.',
 4.0, 22, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/aa/54/89/mosque.jpg?h=-1&s=1&w=500', 'Heritage', 'featured'),

('palais-rois-abomey', 'Royal Palaces of Abomey', 'Palais des rois d''Abomey', 'Abomey', 'Abomey',
 'Historic royal palaces that trace the legacy of the Kingdom of Dahomey.',
 'Les palais royaux d''Abomey retracent l''histoire du Royaume du Dahomey.',
 3.7, 12, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/73/28/7d/royal-palaces-of-abomey.jpg?h=400&s=1&w=500', 'Heritage', 'featured'),

('musee-zinsou', 'Zinsou Foundation Museum', 'Musée de la Fondation Zinsou', 'Ouidah', 'Ouidah',
 'A museum showcasing remarkable art exhibitions in Ouidah.',
 'Le musée de la Fondation Zinsou à Ouidah offre des expositions d''art remarquables.',
 4.5, 9, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/20/01/48/3c/le-batiment-du-musee.jpg?h=-1&s=1&w=500', 'Culture', 'featured')
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
