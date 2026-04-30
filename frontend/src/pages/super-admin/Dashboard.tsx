import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import type { DashboardStats, Order } from '../../types';
import './Dashboard.css';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['superAdminStats'],
    queryFn: () => api.getSuperAdminStats(),
  });

  useEffect(() => {
    if (data) {
      setStats(data);
    }
  }, [data]);

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
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Tableau de bord</h1>
          <p>Vue d'ensemble de la plateforme FedeActiva</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orders-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
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
              <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0116 3v1.5m0 9V18a.75.75 0 01.75.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V18h-6v-1.5a.75.75 0 00-1.5 0v1.5H5.5a.75.75 0 01-.75-.75v-2.25A.75.75 0 015 15h9V9H7.5a.75.75 0 000 1.5h9V9h-9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats?.ordersThisMonth || 0}</span>
            <span className="stat-label">Commandes ce mois</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue-month-icon">
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

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-card">
          <h3>Répartition des commandes par statut</h3>
          <div className="status-chart">
            {stats?.ordersByStatus && Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div key={status} className="status-bar">
                <div className="status-info">
                  <span className={`status-dot ${getStatusColor(status)}`}></span>
                  <span className="status-name">{getStatusLabel(status)}</span>
                </div>
                <div className="bar-container">
                  <div
                    className={`bar ${getStatusColor(status)}`}
                    style={{
                      width: `${stats.totalOrders > 0 ? (count / stats.totalOrders) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                <span className="status-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>Top cultures</h3>
          <div className="cultures-list">
            {stats?.topCultures?.slice(0, 5).map((item, index) => (
              <div key={item.culture} className="culture-item">
                <span className="culture-rank">{index + 1}</span>
                <span className="culture-name">{item.culture}</span>
                <span className="culture-count">{item.count} commandes</span>
              </div>
            ))}
            {!stats?.topCultures?.length && (
              <p className="no-data">Aucune donnée disponible</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders">
        <div className="section-header">
          <h3>Dernières commandes</h3>
          <Link to="/super-admin/orders" className="view-all-link">
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
                <th>Fédération</th>
                <th>Culture</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.map((order: Order) => (
                <tr key={order.id}>
                  <td className="order-number">{order.numero}</td>
                  <td>{order.federation?.nom || '-'}</td>
                  <td>{order.culture?.nom || '-'}</td>
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
                  <td colSpan={6} className="no-data-row">
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
