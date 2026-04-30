-- =====================================================
-- FEDEACTIVA v2.0 - Données de test
-- Régions, préfectures, cantons, fédérations et cultures
-- =====================================================

-- =====================================================
-- DONNÉES GÉOGRAPHIQUES TOGO
-- =====================================================

-- 5 Régions du Togo
INSERT INTO regions (id, nom, code) VALUES
(1, 'Maritime', 'MAR'),
(2, 'Plateaux', 'PLA'),
(3, 'Centrale', 'CEN'),
(4, 'Kara', 'KAR'),
(5, 'Savanes', 'SAV');

-- Préfectures (39)
-- Maritime
INSERT INTO prefectures (id, nom, region_id) VALUES
(1, 'Golfe', 1),
(2, 'Vo', 1),
(3, 'Zio', 1),
(4, 'Yoto', 1),
(5, 'Lacs', 1),
(6, 'Aného', 1),
(7, 'Bas-Mono', 1);

-- Plateaux
INSERT INTO prefectures (id, nom, region_id) VALUES
(8, 'Kpalimé', 2),
(9, 'Kloto', 2),
(10, 'Aképé', 2),
(11, 'Anié', 2),
(12, 'Danyi', 2),
(13, 'Ogou', 2),
(14, 'Wawa', 2),
(15, 'Est-Monoo', 2);

-- Centrale
INSERT INTO prefectures (id, nom, region_id) VALUES
(16, 'Sokodé', 3),
(17, 'Tchaoudjo', 3),
(18, 'Chérifè', 3),
(19, 'Assoli', 3),
(20, 'Bafilo', 3),
(21, 'Douanier', 3),
(22, 'Pia', 3),
(23, 'Binakara', 3);

-- Kara
INSERT INTO prefectures (id, nom, region_id) VALUES
(24, 'Kara', 4),
(25, 'Kéran', 4),
(26, 'Dankpen', 4),
(27, 'Kozah', 4),
(28, 'Bassar', 4),
(29, 'Tcharé', 4),
(30, 'Manga', 4);

-- Savanes
INSERT INTO prefectures (id, nom, region_id) VALUES
(31, 'Cinkassé', 5),
(32, 'Tône', 5),
(33, 'Kpendjal', 5),
(34, 'Oti', 5),
(35, 'Oti-Sud', 5),
(36, 'Kpalgou', 5),
(37, 'Gouandougou', 5),
(38, 'Séréré', 5),
(39, 'Sabatou', 5);

-- Cantons (394) - Maritime
INSERT INTO cantons (nom, prefecture_id) VALUES
-- Golfe
('Golfe-Centre', 1),
('Golfe-Béatrice', 1),
('Baguida', 1),
('Agoéville', 1),
('Sokopé', 1),
('Totsime', 1),
('Aflao-Gakli', 1),
('Kélesso', 1),
('Kumasi', 1),
('Adjido', 1),
('Vakpossimé', 1),
('Kléboué', 1),
('Kpota', 1),
('Djagbé', 1),
('Amouti', 1),
('Kouvé', 1),
('Séké', 1),
('Kuma', 1),

-- Vo
('Vogan', 2),
('Kouvé', 2),
('Taglis', 2),
('Mission-Tové', 2),
('Kpélé', 2),
('Wézomé', 2),
('Akanyamé', 2),
('Akoumape', 2),
('Badou', 2),
('Didjé', 2),
('Klintomé', 2),
('Lomé-Kpota', 2),
('Nioussouré', 2),
('Ountoun', 2),
('Taglis-Aklak',

-- Zio
('Tsévié', 3),
('Abobo', 3),
('Akada', 3),
('Adaké', 3),
('Ahmad', 3),
('Ahomadégbé', 3),
('Akplin', 3),
('Atafbé', 3),
('Djankpondji', 3),
('Kpogno', 3),
('Kpota', 3),
('Moudié', 3),
('Nangahou', 3),
('Notsé', 3),
('Sokoué', 3),
('Tchékpo', 3),
('Tokpli', 3),
('Voulou', 3),
('Wologué', 3),

-- Yoto
('Tabligbo', 4),
('Bara', 4),
('Djagblé', 4),
('Kouvé', 4),
('Amoutivé', 4),
('Attingomé', 4),
('Kpomé', 4),
('Sékoun', 4),
('Tchafic', 4),
('Tokpli', 4),
('Zélivar', 4),

-- Lacs
('Athiémé', 5),
('Aného', 5),
('Bopa', 5),
('Covic', 5),
('Possimé', 5),
('Akaknikpa', 5),
('Apassahoué', 5),
('Atti', 5),
('Kpové', 5),

-- Aného
('Aného', 6),
('Gléï', 6),
('Gnouni', 6),
('Héyihio', 6),
('Kouvé', 6),
('Atti-Tomébou', 6),
('Béma', 6),
('Kpota', 6),
('Lokpo', 6),
('Sapé', 6),

-- Bas-Mono
('Houéyihound旗', 7),
('Sékou', 7),
('Adomé', 7),
('Aved cré', 7),
('Bafilo', 7),
('Dékpo', 7),
('Kpota', 7),
('Tokpli', 7);

-- =====================================================
-- FÉDÉRATION DE TEST: FENOMAT
-- =====================================================

INSERT INTO federations (
    id,
    nom,
    slug,
    description,
    couleur_primaire,
    couleur_secondaire,
    api_key,
    active,
    commission_percent,
    domaines_autorises
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Fédération Nationale des Maraîchers du Togo',
    'fenomat',
    'La FENOMAT est une organisation faîtière regroupant les producteurs maraîchers du Togo. Elle accompagne ses membres dans la formation, la fourniture d''intrants et la commercialisation de leurs produits.',
    '#1c4a2e',
    '#52b788',
    'fk_live_fenomat_xxxxxxxxxxxxxxxxxxxxxxxx',
    true,
    10.00,
    ARRAY['fenomat.tg', 'www.fenomat.tg', 'fenomat.org']
);

-- =====================================================
-- CULTURES FENOMAT (6 cultures)
-- =====================================================

INSERT INTO cultures (federation_id, nom, description, icone) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Tomate', 'Culture de tomate de plein champ et sous abri. Variétés : Cobra, Petoprong, Rio Grande.', '🍅'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Oignon', 'Oignon violet de type Kalio et DMR57. Culture de saison sèche.', '🧅'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Piment', 'Piment camerounais et pili-pili local. Forte demande urbaine.', '🌶️'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Laitue', 'Laitue butterhead et romaine. Production en saison fraîche.', '🥬'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Gombo', 'Gombo okra pour marché local et export.', '🥦'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Concombre', 'Concombre de type Poinsett et Marketmore.', '🥒');

-- =====================================================
-- PACKS FENOMAT (exemples)
-- =====================================================

-- Pack Tomate - Golfe-Béatrice
INSERT INTO packs (
    id,
    federation_id,
    culture_id,
    canton_id,
    prix_unitaire,
    stock_total,
    stock_disponible,
    campagne,
    rendement_estime,
    statut
) VALUES (
    'p0000001-0001-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    (SELECT id FROM cultures WHERE nom = 'Tomate'),
    (SELECT id FROM cantons WHERE nom = 'Golfe-Béatrice'),
    500.00,
    9999,
    142,
    'Campagne Tomate 2025-2026',
    1200,
    'publie'
);

-- Pack Oignon - Zio-Centre
INSERT INTO packs (
    id,
    federation_id,
    culture_id,
    canton_id,
    prix_unitaire,
    stock_total,
    stock_disponible,
    campagne,
    rendement_estime,
    statut
) VALUES (
    'p0000001-0001-0000-0000-000000000002',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    (SELECT id FROM cultures WHERE nom = 'Oignon'),
    (SELECT id FROM cantons WHERE nom = 'Zio-Centre'),
    500.00,
    9999,
    78,
    'Campagne Oignon 2025-2026',
    800,
    'publie'
);

-- Pack Piment - Kpalimé
INSERT INTO packs (
    id,
    federation_id,
    culture_id,
    canton_id,
    prix_unitaire,
    stock_total,
    stock_disponible,
    campagne,
    rendement_estime,
    statut
) VALUES (
    'p0000001-0001-0000-0000-000000000003',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    (SELECT id FROM cultures WHERE nom = 'Piment'),
    (SELECT id FROM cantons WHERE nom = 'Kpalimé-Centre'),
    500.00,
    9999,
    200,
    'Campagne Piment 2025-2026',
    600,
    'publie'
);

-- Pack Laitue - Agoé-Nord
INSERT INTO packs (
    id,
    federation_id,
    culture_id,
    canton_id,
    prix_unitaire,
    stock_total,
    stock_disponible,
    campagne,
    rendement_estime,
    statut
) VALUES (
    'p0000001-0001-0000-0000-000000000004',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    (SELECT id FROM cultures WHERE nom = 'Laitue'),
    (SELECT id FROM cantons WHERE nom = 'Agoé-Nord'),
    500.00,
    9999,
    56,
    'Campagne Laitue 2025-2026',
    500,
    'publie'
);

-- Pack Gombo - Golfe-Centre
INSERT INTO packs (
    id,
    federation_id,
    culture_id,
    canton_id,
    prix_unitaire,
    stock_total,
    stock_disponible,
    campagne,
    rendement_estime,
    statut
) VALUES (
    'p0000001-0001-0000-0000-000000000005',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    (SELECT id FROM cultures WHERE nom = 'Gombo'),
    (SELECT id FROM cantons WHERE nom = 'Golfe-Centre'),
    500.00,
    9999,
    34,
    'Campagne Gombo 2025-2026',
    400,
    'publie'
);

-- Pack Concombre - Tsévié
INSERT INTO packs (
    id,
    federation_id,
    culture_id,
    canton_id,
    prix_unitaire,
    stock_total,
    stock_disponible,
    campagne,
    rendement_estime,
    statut
) VALUES (
    'p0000001-0001-0000-0000-000000000006',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    (SELECT id FROM cultures WHERE nom = 'Concombre'),
    (SELECT id FROM cantons WHERE nom = 'Tsévié'),
    500.00,
    9999,
    28,
    'Campagne Concombre 2025-2026',
    1500,
    'publie'
);

-- =====================================================
-- ADMIN FÉNOMAT
-- =====================================================

INSERT INTO admin_federations (
    id,
    federation_id,
    email,
    mot_de_passe_hash,
    nom,
    prenom,
    telephone,
    actif
) VALUES (
    'a0000001-0001-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'admin@fenomat.tg',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.VQ4p5p0gWVGp1W2',  -- Mot de passe: fenomat2025
    'Secrétaire',
    'FENOMAT',
    '+228 22 21 30 00',
    true
);

-- =====================================================
-- PRODUCTEURS DE TEST
-- =====================================================

INSERT INTO producteurs (federation_id, nom, prenom, telephone, mot_de_passe_hash) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'AMETSITSI', 'Koffi', '+228 90 12 34 56', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.VQ4p5p0gWVGp1W2'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'BOSSOU', 'Afi', '+228 91 23 45 67', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.VQ4p5p0gWVGp1W2'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'TETTEH', 'Dodzi', '+228 93 45 67 89', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.VQ4p5p0gWVGp1W2');

-- =====================================================
-- COMMANDES DE TEST
-- =====================================================

-- Commande 1 - Confirmée
INSERT INTO commandes (
    id,
    utilisateur_id,
    federation_id,
    reference,
    statut,
    montant_total,
    methode_paiement,
    reference_paiement,
    date_paiement
) VALUES (
    'c0000001-0001-0000-0000-000000000001',
    (SELECT id FROM producteurs WHERE telephone = '+228 90 12 34 56'),
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'FENM-2025-00847',
    'confirmee',
    500.00,
    'orange_money',
    'TXN_ORANGE_ABC123',
    NOW() - INTERVAL '1 day'
);

INSERT INTO commandes_lignes (
    id,
    commande_id,
    pack_id,
    quantite,
    prix_unitaire,
    fichier_excel_genere_nom,
    fichier_word_genere_nom
) VALUES (
    'l0000001-0001-0000-0000-000000000001',
    'c0000001-0001-0000-0000-000000000001',
    (SELECT id FROM packs WHERE culture_id = (SELECT id FROM cultures WHERE nom = 'Tomate')),
    1,
    500.00,
    'Budget_Tomate_Golfe_AMETSITSI.xlsx',
    'Itineraire_Tomate_Golfe_AMETSITSI.docx'
);

-- Commande 2 - Confirmée
INSERT INTO commandes (
    id,
    utilisateur_id,
    federation_id,
    reference,
    statut,
    montant_total,
    methode_paiement,
    reference_paiement,
    date_paiement
) VALUES (
    'c0000001-0001-0000-0000-000000000002',
    (SELECT id FROM producteurs WHERE telephone = '+228 91 23 45 67'),
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'FENM-2025-00846',
    'confirmee',
    500.00,
    'tmoney',
    'TXN_TMONEY_DEF456',
    NOW() - INTERVAL '2 days'
);

INSERT INTO commandes_lignes (
    id,
    commande_id,
    pack_id,
    quantite,
    prix_unitaire,
    fichier_excel_genere_nom,
    fichier_word_genere_nom
) VALUES (
    'l0000001-0001-0000-0000-000000000002',
    'c0000001-0001-0000-0000-000000000002',
    (SELECT id FROM packs WHERE culture_id = (SELECT id FROM cultures WHERE nom = 'Oignon')),
    1,
    500.00,
    'Budget_Oignon_Zio_BOSSOU.xlsx',
    'Itineraire_Oignon_Zio_BOSSOU.docx'
);

-- Commande 3 - En attente
INSERT INTO commandes (
    id,
    utilisateur_id,
    federation_id,
    reference,
    statut,
    montant_total,
    methode_paiement,
    reference_paiement
) VALUES (
    'c0000001-0001-0000-0000-000000000003',
    (SELECT id FROM producteurs WHERE telephone = '+228 93 45 67 89'),
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'FENM-2025-00844',
    'en_attente',
    500.00,
    'tmoney',
    'TXN_TMONEY_GHI789'
);

INSERT INTO commandes_lignes (
    id,
    commande_id,
    pack_id,
    quantite,
    prix_unitaire
) VALUES (
    'l0000001-0001-0000-0000-000000000003',
    'c0000001-0001-0000-0000-000000000003',
    (SELECT id FROM packs WHERE culture_id = (SELECT id FROM cultures WHERE nom = 'Piment')),
    1,
    500.00
);

-- =====================================================
-- STATISTIQUES DE TEST
-- =====================================================

-- Mise à jour stats packs pour simulation
UPDATE packs SET nombre_ventes = 3842 WHERE culture_id = (SELECT id FROM cultures WHERE nom = 'Tomate');
UPDATE packs SET nombre_ventes = 2198 WHERE culture_id = (SELECT id FROM cultures WHERE nom = 'Oignon');
UPDATE packs SET nombre_ventes = 1240 WHERE culture_id = (SELECT id FROM cultures WHERE nom = 'Piment');
