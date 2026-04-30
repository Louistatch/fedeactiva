-- =====================================================
-- FEDEACTIVA v2.0 - Script d'initialisation SQL
-- Base de données multi-tenant pour packs documentaires
-- =====================================================

-- Extensions PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =====================================================
-- TABLES PRINCIPALES
-- =====================================================

-- Fédérations (tenants)
CREATE TABLE IF NOT EXISTS federations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    couleur_primaire VARCHAR(7) DEFAULT '#1c4a2e',
    couleur_secondaire VARCHAR(7) DEFAULT '#52b788',
    api_key VARCHAR(256) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT false,
    commission_percent DECIMAL(5,2) DEFAULT 10.00,
    domaines_autorises TEXT[] DEFAULT '{}',
    telephone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Utilisateurs Super-Admin
CREATE TABLE IF NOT EXISTS super_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    nom VARCHAR(150),
    prenom VARCHAR(150),
    deux_facteurs_active BOOLEAN DEFAULT false,
    deux_facteurs_secret VARCHAR(255),
    actif BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Admins Fédération
CREATE TABLE IF NOT EXISTS admin_federations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    federation_id UUID REFERENCES federations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    nom VARCHAR(150),
    prenom VARCHAR(150),
    telephone VARCHAR(20),
    actif BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Régions (données géographiques référentielles)
CREATE TABLE IF NOT EXISTS regions (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    code VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Préfectures
CREATE TABLE IF NOT EXISTS prefectures (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    code VARCHAR(10),
    region_id INT REFERENCES regions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Cantons
CREATE TABLE IF NOT EXISTS cantons (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    code VARCHAR(20),
    prefecture_id INT REFERENCES prefectures(id) ON DELETE CASCADE,
    geom GEOMETRY(Point, 4326),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Cultures (par fédération)
CREATE TABLE IF NOT EXISTS cultures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    federation_id UUID REFERENCES federations(id) ON DELETE CASCADE,
    nom VARCHAR(150) NOT NULL,
    description TEXT,
    icone VARCHAR(10) DEFAULT '🌱',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(federation_id, nom)
);

-- Modèles de documents
CREATE TABLE IF NOT EXISTS modeles_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    federation_id UUID REFERENCES federations(id) ON DELETE CASCADE,
    culture_id UUID REFERENCES cultures(id) ON DELETE CASCADE,
    canton_id INT REFERENCES cantons(id) ON DELETE CASCADE,
    type_document VARCHAR(10) NOT NULL CHECK (type_document IN ('excel', 'word')),
    fichier_nom VARCHAR(255) NOT NULL,
    fichier_path VARCHAR(500) NOT NULL,
    fichier_size INTEGER,
    version INTEGER DEFAULT 1,
    actif BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(federation_id, culture_id, canton_id, type_document)
);

-- Packs (combinaison culture + canton)
CREATE TABLE IF NOT EXISTS packs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    federation_id UUID REFERENCES federations(id) ON DELETE CASCADE,
    culture_id UUID REFERENCES cultures(id) ON DELETE CASCADE,
    canton_id INT REFERENCES cantons(id) ON DELETE CASCADE,
    prix_unitaire DECIMAL(10,2) DEFAULT 500.00,
    stock_total INT NOT NULL DEFAULT 999999,
    stock_disponible INT NOT NULL DEFAULT 999999,
    date_debut_validite DATE,
    date_fin_validite DATE,
    campagne VARCHAR(100),
    rendement_estime DECIMAL(10,2),
    statut VARCHAR(20) DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'publie', 'epuise', 'archive')),
    modele_excel_id UUID REFERENCES modeles_documents(id),
    modele_word_id UUID REFERENCES modeles_documents(id),
    nombre_ventes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(federation_id, culture_id, canton_id)
);

-- Producteurs (utilisateurs finaux)
CREATE TABLE IF NOT EXISTS producteurs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    federation_id UUID REFERENCES federations(id) ON DELETE CASCADE,
    nom VARCHAR(150) NOT NULL,
    prenom VARCHAR(150) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    actif BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(federation_id, telephone)
);

-- Commandes
CREATE TABLE IF NOT EXISTS commandes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utilisateur_id UUID REFERENCES producteurs(id) ON DELETE CASCADE,
    federation_id UUID REFERENCES federations(id) ON DELETE CASCADE,
    reference VARCHAR(50) NOT NULL,
    date_commande TIMESTAMPTZ DEFAULT now(),
    statut VARCHAR(30) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'confirmee', 'echec', 'remboursee')),
    montant_total DECIMAL(10,2) NOT NULL,
    methode_paiement VARCHAR(50),
    reference_paiement VARCHAR(255),
    date_paiement TIMESTAMPTZ,
    transaction_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Lignes de commande
CREATE TABLE IF NOT EXISTS commandes_lignes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commande_id UUID REFERENCES commandes(id) ON DELETE CASCADE,
    pack_id UUID REFERENCES packs(id) ON DELETE RESTRICT,
    quantite INT NOT NULL DEFAULT 1,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    fichier_excel_genere_path VARCHAR(500),
    fichier_excel_genere_nom VARCHAR(255),
    fichier_word_genere_path VARCHAR(500),
    fichier_word_genere_nom VARCHAR(255),
    fichier_excel_size INTEGER,
    fichier_word_size INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tokens de téléchargement
CREATE TABLE IF NOT EXISTS download_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ligne_commande_id UUID REFERENCES commandes_lignes(id) ON DELETE CASCADE,
    token VARCHAR(256) UNIQUE NOT NULL,
    type_fichier VARCHAR(10) NOT NULL CHECK (type_fichier IN ('excel', 'word')),
    expire_at TIMESTAMPTZ NOT NULL,
    telechargements_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Logs Webhooks IPN
CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    federation_id UUID REFERENCES federations(id) ON DELETE SET NULL,
    provider VARCHAR(50) NOT NULL,
    event_type VARCHAR(100),
    payload JSONB NOT NULL,
    signature VARCHAR(500),
    ip_adresse VARCHAR(45),
    statut VARCHAR(20) DEFAULT 'recus' CHECK (statut IN ('recus', 'traites', 'echecs')),
    message_erreur TEXT,
    traite_le TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications SMS/Email
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utilisateur_id UUID REFERENCES producteurs(id) ON DELETE CASCADE,
    federation_id UUID REFERENCES federations(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('sms', 'email', 'both')),
    destinataire VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'envoye', 'echoue')),
    fournisseur VARCHAR(50),
    reference_externe VARCHAR(255),
    erreur TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    envoye_le TIMESTAMPTZ
);

-- Logs d'audit (anonymisés)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    federation_id UUID REFERENCES federations(id) ON DELETE SET NULL,
    utilisateur_type VARCHAR(20) CHECK (utilisateur_type IN ('super_admin', 'admin_fed', 'producteur')),
    action VARCHAR(100) NOT NULL,
    ressource_type VARCHAR(50),
    ressource_id UUID,
    metadata JSONB DEFAULT '{}',
    adresse_ip VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- INDEX
-- =====================================================

CREATE INDEX idx_federations_active ON federations(active);
CREATE INDEX idx_federations_slug ON federations(slug);

CREATE INDEX idx_cultures_federation ON cultures(federation_id);
CREATE INDEX idx_cultures_active ON cultures(active);

CREATE INDEX idx_packs_federation ON packs(federation_id);
CREATE INDEX idx_packs_culture ON packs(culture_id);
CREATE INDEX idx_packs_canton ON packs(canton_id);
CREATE INDEX idx_packs_statut ON packs(statut);
CREATE INDEX idx_packs_publie ON packs(federation_id, statut) WHERE statut = 'publie';

CREATE INDEX idx_commandes_utilisateur ON commandes(utilisateur_id);
CREATE INDEX idx_commandes_federation ON commandes(federation_id);
CREATE INDEX idx_commandes_date ON commandes(date_commande DESC);
CREATE INDEX idx_commandes_reference ON commandes(reference);
CREATE INDEX idx_commandes_statut ON commandes(statut);

CREATE INDEX idx_producteurs_federation ON producteurs(federation_id);
CREATE INDEX idx_producteurs_telephone ON producteurs(telephone);

CREATE INDEX idx_download_tokens_expire ON download_tokens(expire_at);
CREATE INDEX idx_download_tokens_token ON download_tokens(token);

CREATE INDEX idx_webhook_logs_federation ON webhook_logs(federation_id);
CREATE INDEX idx_webhook_logs_created ON webhook_logs(created_at DESC);
CREATE INDEX idx_webhook_logs_provider ON webhook_logs(provider);

CREATE INDEX idx_audit_logs_federation ON audit_logs(federation_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

CREATE INDEX idx_regions ON regions(nom);
CREATE INDEX idx_prefectures_region ON prefectures(region_id);
CREATE INDEX idx_prefectures_nom ON prefectures(nom);
CREATE INDEX idx_cantons_prefecture ON cantons(prefecture_id);
CREATE INDEX idx_cantons_nom ON cantons(nom);

-- =====================================================
-- FONCTIONS ET TRIGGERS
-- =====================================================

-- Mise à jour automatique updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour updated_at sur les tables principales
CREATE TRIGGER update_federations_updated_at BEFORE UPDATE ON federations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_super_admins_updated_at BEFORE UPDATE ON super_admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_federations_updated_at BEFORE UPDATE ON admin_federations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cultures_updated_at BEFORE UPDATE ON cultures
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modeles_documents_updated_at BEFORE UPDATE ON modeles_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_packs_updated_at BEFORE UPDATE ON packs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_producteurs_updated_at BEFORE UPDATE ON producteurs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commandes_updated_at BEFORE UPDATE ON commandes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Génération automatique référence commande
CREATE OR REPLACE FUNCTION generate_commande_reference()
RETURNS TRIGGER AS $$
DECLARE
    fed_slug VARCHAR(10);
    year_code VARCHAR(4);
    sequence_num INT;
BEGIN
    -- Extraire le slug de la federation (3 premières lettres, majuscules)
    SELECT UPPER(SUBSTRING(f.slug FROM 1 FOR 4))
    INTO fed_slug
    FROM federations f
    WHERE f.id = NEW.federation_id;

    -- Année actuelle
    year_code := TO_CHAR(NOW(), 'YYYY');

    -- Compteur pour l'année
    SELECT COUNT(*) + 1
    INTO sequence_num
    FROM commandes c
    JOIN federations f ON c.federation_id = f.id
    WHERE f.id = NEW.federation_id
    AND EXTRACT(YEAR FROM c.date_commande) = EXTRACT(YEAR FROM NOW());

    NEW.reference := fed_slug || '-' || year_code || '-' || LPAD(sequence_num::TEXT, 5, '0');

    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_commande_reference_trigger BEFORE INSERT ON commandes
    FOR EACH ROW EXECUTE FUNCTION generate_commande_reference();

-- Mise à jour stock après commande
CREATE OR REPLACE FUNCTION update_stock_after_order()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM commandes WHERE id = NEW.commande_id AND statut = 'confirmee'
    ) THEN
        UPDATE packs
        SET stock_disponible = stock_disponible - NEW.quantite,
            nombre_ventes = nombre_ventes + NEW.quantite
        WHERE id = NEW.pack_id;

        UPDATE packs
        SET statut = 'epuise'
        WHERE id = NEW.pack_id AND stock_disponible <= 0;
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stock_trigger AFTER INSERT ON commandes_lignes
    FOR EACH ROW EXECUTE FUNCTION update_stock_after_order();

-- Nettoyage automatique tokens expirés (à exécuter périodiquement)
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM download_tokens WHERE expire_at < NOW();
END;
$$ language 'plpgsql';

-- =====================================================
-- VUES
-- =====================================================

-- Vue statistiques fédérations
CREATE OR REPLACE VIEW vue_stats_federations AS
SELECT 
    f.id,
    f.nom,
    f.slug,
    COUNT(DISTINCT p.id) as total_packs,
    COUNT(DISTINCT CASE WHEN p.statut = 'publie' THEN p.id END) as packs_publies,
    COALESCE(SUM(CASE WHEN c.statut = 'confirmee' THEN 1 ELSE 0 END), 0) as total_ventes,
    COALESCE(SUM(CASE WHEN c.statut = 'confirmee' THEN c.montant_total ELSE 0 END), 0) as revenus_total,
    COALESCE(SUM(CASE WHEN c.statut = 'confirmee' THEN c.montant_total * f.commission_percent / 100 ELSE 0 END), 0) as commissions
FROM federations f
LEFT JOIN packs p ON f.id = p.federation_id
LEFT JOIN commandes c ON f.id = c.federation_id
GROUP BY f.id, f.nom, f.slug;

-- Vue statistiques globales (super-admin)
CREATE OR REPLACE VIEW vue_stats_globales AS
SELECT 
    COUNT(DISTINCT f.id) as total_federations,
    COUNT(DISTINCT CASE WHEN f.active = true THEN f.id END) as federations_actives,
    COUNT(DISTINCT p.id) as total_packs,
    COUNT(DISTINCT CASE WHEN p.statut = 'publie' THEN p.id END) as packs_publies,
    COALESCE(SUM(CASE WHEN c.statut = 'confirmee' THEN 1 ELSE 0 END), 0) as total_ventes,
    COALESCE(SUM(CASE WHEN c.statut = 'confirmee' THEN c.montant_total ELSE 0 END), 0) as revenus_total,
    COALESCE(SUM(CASE WHEN c.statut = 'confirmee' AND wl.statut = 'traites' THEN 1 ELSE 0 END), 0) as webhooks_traites,
    COALESCE(SUM(CASE WHEN c.statut = 'confirmee' AND wl.statut = 'echecs' THEN 1 ELSE 0 END), 0) as webhooks_echecs
FROM federations f
LEFT JOIN packs p ON f.id = p.federation_id
LEFT JOIN commandes c ON f.id = c.federation_id
LEFT JOIN webhook_logs wl ON f.id = wl.federation_id;

-- =====================================================
-- PERMISSIONS (RLS - Row Level Security)
-- =====================================================

-- Activation RLS
ALTER TABLE federations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultures ENABLE ROW LEVEL SECURITY;
ALTER TABLE packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE producteurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE commandes_lignes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE federations IS 'Fédérations (tenants) - Multi-tenant par federation_id';
COMMENT ON TABLE cultures IS 'Cultures agricoles par fédération';
COMMENT ON TABLE packs IS 'Packs documentaires (culture + canton + fichiers)';
COMMENT ON TABLE producteurs IS 'Producteurs (utilisateurs finaux, acheteurs)';
COMMENT ON TABLE commandes IS 'Commandes de packs';
COMMENT ON TABLE webhook_logs IS 'Logs des webhooks IPN (paiements)';
