import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { useFederation } from '../../contexts/FederationContext';
import api from '../../services/api';
import type { FederationStats, Order } from '../../types';
import './Dashboard.css';

export default function FederationAdminDashboard() {
  const { user } = useAuth();
  const { federation, setFederation } = useFederation();
  const [stats, setStats] = useState<FederationStats | null>(null);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['federationStats', user?.federation_id],
    queryFn: () => api.getFederationStats(user!.federation_id!),
    enabled: !!user?.federation_id,
  });

  useEffect(() => {
    if (data) {
      setStats(data);
      if (data.federation) {
        setFederation(data.federation);
      }
    }
  }, [data, setFederation]);

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-large"></div>
        <p>Chargement des statistiques...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <p>Erreur lors du chargement des données</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'status-pending',
      processing: 'status-processing',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
      refunded: 'status-refunded',
    };
    return colors[status] || '';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      processing: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé',
      refunded: 'Remboursé',
    };
    return labels[status] || status;
  };

  return (
    <div className="dashboard federation-dashboard">
      <div className="dashboard-header">
        <div className="federation-info">
          {federation?.logo_url && (
            <img src={federation.logo_url} alt={federation.nom} className="federation-logo" />
          )}
          <div>
            <h1>{federation?.nom || stats?.federation?.nom || 'Ma Fédération'}</h1>
            <p>Tableau de bord de gestion</p>
          </div>
        </div>
        <div className="header-actions">
          <Link to="/federation-admin/packs/new" className="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nouveau pack
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon packs-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
              <path fillRule="evenodd" d="M3 8h18v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats?.totalPacks || 0}</span>
            <span className="stat-label">Packs créés</span>
          </div>
          <div className="stat-badge active">
            {stats?.activePacks || 0} actifs
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats?.totalOrders || 0}</span>
            <span className="stat-label">Commandes totales</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">{formatCurrency(stats?.totalRevenue || 0)}</span>
            <span className="stat-label">Revenus totaux</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon monthly-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">{formatCurrency(stats?.revenueThisMonth || 0)}</span>
            <span className="stat-label">Revenus ce mois</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Actions rapides</h3>
        <div className="actions-grid">
          <Link to="/federation-admin/packs" className="action-card">
            <div className="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path fillRule="evenodd" d="M3 8h18v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <span>Gérer les packs</span>
          </Link>
          <Link to="/federation-admin/orders" className="action-card">
            <div className="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
            <span>Voir les commandes</span>
          </Link>
          <Link to="/federation-admin/documents" className="action-card">
            <div className="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            </div>
            <span>Documents générés</span>
          </Link>
          <Link to="/federation-admin/settings" className="action-card">
            <div className="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </div>
            <span>Paramètres</span>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders">
        <div className="section-header">
          <h3>Dernières commandes</h3>
          <Link to="/federation-admin/orders" className="view-all-link">
            Voir toutes les commandes
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>N° Commande</th>
                <th>Culture</th>
                <th>Canton</th>
                <th>Client</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.map((order: Order) => (
                <tr key={order.id}>
                  <td className="order-number">{order.numero}</td>
                  <td>{order.culture?.nom || '-'}</td>
                  <td>{order.canton?.nom || '-'}</td>
                  <td>
                    <div className="client-info">
                      <span className="client-name">{order.nom_client}</span>
                      <span className="client-email">{order.email_client}</span>
                    </div>
                  </td>
                  <td className="amount">{formatCurrency(order.montant_ttc)}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(order.statut)}`}>
                      {getStatusLabel(order.statut)}
                    </span>
                  </td>
                  <td className="date">{formatDate(order.created_at)}</td>
                </tr>
              ))}
              {!stats?.recentOrders?.length && (
                <tr>
                  <td colSpan={7} className="no-data-row">
                    Aucune commande récente
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
