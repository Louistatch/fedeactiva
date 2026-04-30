import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FederationProvider, useFederation } from '../../contexts/FederationContext';
import api from '../../services/api';
import type { Pack, Order } from '../../types';
import './EmbedPage.css';

function EmbedPageContent() {
  const { federationSlug } = useParams<{ federationSlug: string }>();
  const [searchParams] = useSearchParams();
  const packId = searchParams.get('pack');
  const cultureSlug = searchParams.get('culture');
  const cantonCode = searchParams.get('canton');

  const { federation, setFederation, isLoading: fedLoading } = useFederation();
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [orderStep, setOrderStep] = useState<'details' | 'payment' | 'success'>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    nom: '',
    prenom: '',
    telephone: '',
    entreprise: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load federation
  const { data: fedData } = useQuery({
    queryKey: ['federation', federationSlug],
    queryFn: () => api.getFederationBySlug(federationSlug!),
    enabled: !!federationSlug,
  });

  useEffect(() => {
    if (fedData) {
      setFederation(fedData);
    }
  }, [fedData, setFederation]);

  // Load cultures and cantons
  const { data: culturesData } = useQuery({
    queryKey: ['cultures'],
    queryFn: () => api.getCultures({ limit: 100 }),
  });

  const { data: cantonsData } = useQuery({
    queryKey: ['cantons'],
    queryFn: () => api.getCantons({ limit: 100 }),
  });

  // Load pack by ID or filters
  const { data: packById } = useQuery({
    queryKey: ['pack', packId],
    queryFn: () => api.getPack(packId!),
    enabled: !!packId,
  });

  const { data: packByFilters } = useQuery({
    queryKey: ['packFilters', federationSlug, cultureSlug, cantonCode],
    queryFn: () =>
      api.getPackByFilters(federationSlug!, cultureSlug!, cantonCode!),
    enabled: !!federationSlug && !!cultureSlug && !!cantonCode && !packId,
  });

  useEffect(() => {
    if (packId && packById) {
      setSelectedPack(packById);
    } else if (packByFilters) {
      setSelectedPack(packByFilters);
    }
  }, [packId, packById, packByFilters]);

  // Listen for messages from parent window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'ready') {
        // Send config back to parent
        window.parent.postMessage(
          {
            type: 'config',
            payload: {
              federation: federation?.slug,
              culture: cultureSlug,
              canton: cantonCode,
            },
          },
          '*'
        );
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [federation, cultureSlug, cantonCode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.nom) {
      newErrors.nom = 'Le nom est requis';
    }

    if (!formData.prenom) {
      newErrors.prenom = 'Le prénom est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !selectedPack) return;

    setIsProcessing(true);

    try {
      const newOrder = await api.createOrder({
        pack_id: selectedPack.id,
        email: formData.email,
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone || undefined,
        entreprise: formData.entreprise || undefined,
      });

      setOrder(newOrder);
      setOrderStep('payment');

      // Notify parent
      window.parent.postMessage(
        {
          type: 'order_created',
          payload: { order_id: newOrder.id, order_number: newOrder.numero },
        },
        '*'
      );
    } catch (error: any) {
      console.error('Order creation failed:', error);
      window.parent.postMessage(
        {
          type: 'error',
          payload: { message: error.response?.data?.message || 'Erreur lors de la création de la commande' },
        },
        '*'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async (provider: 'fedapay' | 'cinetpay', method: string) => {
    if (!order) return;

    setIsProcessing(true);

    try {
      const payment = await api.initiatePayment(order.id, provider, method);
      
      // Open payment URL in new window/tab
      window.open(payment.payment_url, '_blank');

      // For demo, simulate success after 3 seconds
      setTimeout(async () => {
        try {
          const verified = await api.verifyPayment(payment.payment_intent_id);
          if (verified.status === 'paid') {
            setOrder(verified.order);
            setOrderStep('success');

            // Notify parent
            window.parent.postMessage(
              {
                type: 'purchase_success',
                payload: { order_id: order.id, order_number: order.numero },
              },
              '*'
            );
          }
        } catch (error) {
          console.error('Payment verification failed:', error);
        }
        setIsProcessing(false);
      }, 3000);
    } catch (error: any) {
      console.error('Payment initiation failed:', error);
      window.parent.postMessage(
        {
          type: 'purchase_error',
          payload: { message: error.response?.data?.message || 'Erreur lors du paiement' },
        },
        '*'
      );
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!order) return;

    try {
      const blob = await api.downloadDocuments(order.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fedeactiva-${order.numero}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      window.parent.postMessage(
        {
          type: 'document_ready',
          payload: { order_id: order.id },
        },
        '*'
      );
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (fedLoading || !federation) {
    return (
      <div className="embed-loading">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (orderStep === 'success') {
    return (
      <div className="embed-page success-page">
        <div className="success-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <path d="M22 4L12 14.01l-3-3" />
          </svg>
        </div>
        <h2>Paiement réussi !</h2>
        <p>Votre commande <strong>{order?.numero}</strong> a été confirmée.</p>
        <p className="success-info">
          Vos documents personnalisés sont prêts. Cliquez sur le bouton ci-dessous pour les télécharger.
        </p>
        <button onClick={handleDownload} className="btn btn-primary btn-lg">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Télécharger mes documents
        </button>
        <p className="email-info">
          Un email de confirmation a été envoyé à <strong>{formData.email}</strong>
        </p>
      </div>
    );
  }

  if (orderStep === 'payment' && order) {
    return (
      <div className="embed-page payment-page">
        <div className="order-summary">
          <h2>Récapitulatif</h2>
          <div className="summary-row">
            <span>{selectedPack?.culture?.nom} - {selectedPack?.canton?.nom}</span>
            <span className="summary-price">{formatCurrency(order.montant_ttc)}</span>
          </div>
          <div className="summary-total">
            <span>Total TTC</span>
            <span>{formatCurrency(order.montant_ttc)}</span>
          </div>
        </div>

        <div className="payment-methods">
          <h3>Choisissez votre méthode de paiement</h3>
          
          <div className="payment-section">
            <h4>Paiements mobiles</h4>
            <div className="payment-buttons">
              <button
                className="payment-btn orange"
                onClick={() => handlePayment('cinetpay', 'orange_money')}
                disabled={isProcessing}
              >
                <span className="payment-icon">OM</span>
                Orange Money
              </button>
              <button
                className="payment-btn tmoney"
                onClick={() => handlePayment('cinetpay', 'tmoney')}
                disabled={isProcessing}
              >
                <span className="payment-icon">TM</span>
                TMoney
              </button>
            </div>
          </div>

          <div className="payment-section">
            <h4>Autres méthodes</h4>
            <div className="payment-buttons">
              <button
                className="payment-btn card"
                onClick={() => handlePayment('fedapay', 'card')}
                disabled={isProcessing}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                </svg>
                Carte bancaire
              </button>
            </div>
          </div>

          {isProcessing && (
            <div className="processing-indicator">
              <div className="spinner"></div>
              <p>Traitement en cours... Veuillez patienter.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="embed-page">
      <div className="embed-header">
        {federation.logo_url && (
          <img src={federation.logo_url} alt={federation.nom} className="fed-logo" />
        )}
        <h1>{selectedPack ? 'Commander ce pack' : 'Sélectionnez un pack'}</h1>
      </div>

      {selectedPack ? (
        <div className="pack-details">
          <div className="pack-info">
            <span className="culture-tag">{selectedPack.culture?.nom}</span>
            <h2>{selectedPack.titre}</h2>
            <p>{selectedPack.description}</p>
            <div className="pack-location">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {selectedPack.canton?.nom}, {selectedPack.canton?.region}
            </div>
          </div>

          <div className="pack-contents">
            <h3>Contenu du pack</h3>
            <ul>
              <li>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                Prévisions financières Excel personnalisé
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                Guide technique Word détaillé
              </li>
            </ul>
          </div>

          <div className="price-display">
            <span className="price-label">Prix</span>
            <span className="price-amount">{formatCurrency(selectedPack.prixTTC)}</span>
            <span className="price-tax">TTC</span>
          </div>
        </div>
      ) : (
        <div className="no-pack-selected">
          <p>Veuillez sélectionner un pack pour continuer.</p>
        </div>
      )}

      {selectedPack && (
        <form onSubmit={handleSubmitOrder} className="order-form">
          <h3>Vos informations</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="votre@email.com"
                className={errors.email ? 'error' : ''}
                disabled={isProcessing}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row two-cols">
            <div className="form-group">
              <label htmlFor="nom">Nom *</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                placeholder="Votre nom"
                className={errors.nom ? 'error' : ''}
                disabled={isProcessing}
              />
              {errors.nom && <span className="error-text">{errors.nom}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="prenom">Prénom *</label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                placeholder="Votre prénom"
                className={errors.prenom ? 'error' : ''}
                disabled={isProcessing}
              />
              {errors.prenom && <span className="error-text">{errors.prenom}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telephone">Téléphone</label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                placeholder="+228 XX XX XX XX"
                disabled={isProcessing}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="entreprise">Entreprise / Organisation</label>
              <input
                type="text"
                id="entreprise"
                name="entreprise"
                value={formData.entreprise}
                onChange={handleInputChange}
                placeholder="Nom de votre entreprise"
                disabled={isProcessing}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <span className="spinner"></span>
                Traitement...
              </>
            ) : (
              <>
                Continuer vers le paiement
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
        </form>
      )}

      <div className="secure-badge">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        Paiement sécurisé
      </div>
    </div>
  );
}

export default function EmbedPage() {
  return (
    <FederationProvider>
      <EmbedPageContent />
    </FederationProvider>
  );
}
