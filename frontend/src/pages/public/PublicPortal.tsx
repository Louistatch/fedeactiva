import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import type { Federation, Culture, Canton, Pack } from '../../types';
import './PublicPortal.css';

export default function PublicPortal() {
  const [selectedFederation, setSelectedFederation] = useState<string>('');
  const [selectedCulture, setSelectedCulture] = useState<string>('');
  const [selectedCanton, setSelectedCanton] = useState<string>('');

  const { data: federations, isLoading: loadingFederations } = useQuery({
    queryKey: ['federations'],
    queryFn: () => api.getFederations({ limit: 100 }),
  });

  const { data: cultures, isLoading: loadingCultures } = useQuery({
    queryKey: ['cultures'],
    queryFn: () => api.getCultures({ limit: 100 }),
  });

  const { data: cantons, isLoading: loadingCantons } = useQuery({
    queryKey: ['cantons'],
    queryFn: () => api.getCantons({ limit: 100 }),
  });

  const { data: packs, isLoading: loadingPacks, refetch: refetchPacks } = useQuery({
    queryKey: ['packs', selectedFederation, selectedCulture, selectedCanton],
    queryFn: () =>
      api.getPacks({
        federation_id: selectedFederation || undefined,
        culture_id: selectedCulture || undefined,
        canton_id: selectedCanton || undefined,
      }),
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetchPacks();
  };

  const getFederationName = (id: string) => {
    return federations?.data.find((f) => f.id === id)?.nom || '';
  };

  return (
    <div className="public-portal">
      {/* Header */}
      <header className="portal-header">
        <div className="header-container">
          <Link to="/" className="logo">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="currentColor" className="logo-bg" />
              <path d="M24 12L36 18V30L24 36L12 30V18L24 12Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              <path d="M24 24L12 18M24 24L36 18M24 24V36" stroke="white" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            <span>FedeActiva</span>
          </Link>
          <nav className="header-nav">
            <Link to="/login" className="nav-link">
              Connexion
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <h1>Documents packs agricoles</h1>
          <p>
            Prévisions financières et guides techniques personnalisés pour votre activité agricole.
            Sélectionnez votre fédération, culture et zone géographique.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="federation">Fédération</label>
                <select
                  id="federation"
                  value={selectedFederation}
                  onChange={(e) => setSelectedFederation(e.target.value)}
                  disabled={loadingFederations}
                >
                  <option value="">Toutes les fédérations</option>
                  {federations?.data.map((fed) => (
                    <option key={fed.id} value={fed.id}>
                      {fed.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="culture">Culture</label>
                <select
                  id="culture"
                  value={selectedCulture}
                  onChange={(e) => setSelectedCulture(e.target.value)}
                  disabled={loadingCultures}
                >
                  <option value="">Toutes les cultures</option>
                  {cultures?.data.map((culture) => (
                    <option key={culture.id} value={culture.id}>
                      {culture.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="canton">Canton</label>
                <select
                  id="canton"
                  value={selectedCanton}
                  onChange={(e) => setSelectedCanton(e.target.value)}
                  disabled={loadingCantons}
                >
                  <option value="">Tous les cantons</option>
                  {cantons?.data.map((canton) => (
                    <option key={canton.id} value={canton.id}>
                      {canton.nom} ({canton.region})
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary search-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                Rechercher
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Packs Grid */}
      <section className="packs-section">
        <div className="packs-container">
          <div className="section-header">
            <h2>Packs disponibles</h2>
            <span className="results-count">
              {packs?.total || 0} pack{packs?.total !== 1 ? 's' : ''} trouvé{packs?.total !== 1 ? 's' : ''}
            </span>
          </div>

          {loadingPacks ? (
            <div className="loading-state">
              <div className="spinner-large"></div>
              <p>Chargement des packs...</p>
            </div>
          ) : packs?.data.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3>Aucun pack trouvé</h3>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className="packs-grid">
              {packs?.data.map((pack) => (
                <article key={pack.id} className="pack-card">
                  <div className="pack-header">
                    <div className="pack-culture">
                      <span className="culture-badge">{pack.culture?.nom}</span>
                    </div>
                    <span className="pack-federation">{getFederationName(pack.federation_id)}</span>
                  </div>

                  <div className="pack-content">
                    <h3>{pack.titre}</h3>
                    <p>{pack.description}</p>

                    <div className="pack-details">
                      <div className="detail-item">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>{pack.canton?.nom}</span>
                      </div>
                      <div className="detail-item">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        <span>Fichier Excel + Word</span>
                      </div>
                    </div>
                  </div>

                  <div className="pack-footer">
                    <div className="pack-price">
                      <span className="price-label">À partir de</span>
                      <span className="price-value">{formatCurrency(pack.prixTTC)}</span>
                      <span className="price-tax">TTC</span>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        const fed = federations?.data.find((f) => f.id === pack.federation_id);
                        if (fed) {
                          window.location.href = `/embed/${fed.slug}?pack=${pack.id}`;
                        }
                      }}
                    >
                      Commander
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="portal-footer">
        <div className="footer-container">
          <div className="footer-info">
            <div className="footer-logo">
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="12" fill="currentColor" className="logo-bg" />
                <path d="M24 12L36 18V30L24 36L12 30V18L24 12Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                <path d="M24 24L12 18M24 24L36 18M24 24V36" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              <span>FedeActiva</span>
            </div>
            <p>Solution de gestion documentaire pour les fédérations agricoles.</p>
          </div>
          <div className="footer-links">
            <Link to="/login">Administration</Link>
            <span className="separator">|</span>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-copyright">
            © {new Date().getFullYear()} FedeActiva. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
