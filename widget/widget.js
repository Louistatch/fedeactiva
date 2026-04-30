/**
 * FedeActiva Widget v2.0
 * Script d'intégration pour fédérations agricoles
 * 
 * Usage:
 * <script src="https://cdn.fedeactiva.tg/widget.js" data-federation="fenomat"></script>
 * <div id="fedeactiva-widget"></div>
 */
(function() {
  'use strict';

  // Configuration par défaut
  const DEFAULT_CONFIG = {
    container: '#fedeactiva-widget',
    theme: 'auto',
    locale: 'fr',
    apiBase: 'https://api.fedeactiva.tg/api/v1',
    publicBase: 'https://public.fedeactiva.tg',
    debug: false,
  };

  // Styles CSS intégrés
  const WIDGET_STYLES = `
    .fedeactiva-widget * {
      box-sizing: border-box;
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .fedeactiva-widget {
      --fw-forest: #1c4a2e;
      --fw-verdant: #2d7a4f;
      --fw-sage: #52b788;
      --fw-mint: #8fd4a8;
      --fw-parchment: #f7f3ec;
      --fw-gold: #d4932a;
      --fw-straw: #f5d07a;
      --fw-rust: #c0392b;
      background: var(--fw-parchment);
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(15,30,20,.2);
    }
    .fw-header {
      background: linear-gradient(135deg, var(--fw-forest) 0%, var(--fw-verdant) 100%);
      padding: 20px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .fw-header-seal {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      background: rgba(255,255,255,.15);
      border: 2px solid rgba(255,255,255,.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 900;
      color: white;
      letter-spacing: .5px;
    }
    .fw-header-info h2 {
      font-size: 18px;
      font-weight: 800;
      color: white;
      margin: 0;
    }
    .fw-header-info p {
      font-size: 12px;
      color: rgba(255,255,255,.6);
      margin: 4px 0 0;
    }
    .fw-header-stats {
      margin-left: auto;
      text-align: right;
    }
    .fw-header-num {
      font-size: 26px;
      font-weight: 900;
      color: var(--fw-straw);
      line-height: 1;
    }
    .fw-header-label {
      font-size: 11px;
      color: rgba(255,255,255,.5);
    }
    .fw-tabs {
      display: flex;
      background: white;
      border-bottom: 2px solid var(--fw-parchment);
    }
    .fw-tab {
      flex: 1;
      padding: 13px 16px;
      text-align: center;
      font-size: 13px;
      font-weight: 700;
      color: #9ca3af;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      transition: all .18s;
    }
    .fw-tab:hover { color: #374151; }
    .fw-tab.active {
      color: var(--fw-verdant);
      border-bottom-color: var(--fw-verdant);
    }
    .fw-body {
      background: white;
      padding: 24px;
      min-height: 360px;
    }
    .fw-tab-content { display: none; }
    .fw-tab-content.active { display: block; }
    .fw-step-tag {
      font-size: 11px;
      color: #9ca3af;
      background: #faf8f4;
      padding: 3px 10px;
      border-radius: 20px;
    }
    .fw-section-title {
      font-size: 16px;
      font-weight: 800;
      color: #0f1e14;
      margin: 0 0 18px;
    }
    .fw-alert {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      background: #fff3d4;
      border: 1px solid #f5d07a;
      border-radius: 9px;
      padding: 12px 14px;
      margin-bottom: 14px;
    }
    .fw-alert-icon { font-size: 18px; }
    .fw-alert-text { font-size: 13px; color: #7a5600; line-height: 1.45; }
    .fw-pack-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 18px;
    }
    .fw-pack-card {
      border: 1.5px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all .2s;
      background: white;
      position: relative;
    }
    .fw-pack-card:hover {
      border-color: var(--fw-sage);
      transform: translateY(-2px);
      box-shadow: 0 8px 40px rgba(15,30,20,.14);
    }
    .fw-pack-card.selected {
      border-color: var(--fw-verdant);
      box-shadow: 0 0 0 3px rgba(45,122,79,.15);
    }
    .fw-pack-check {
      display: none;
      position: absolute;
      top: 8px;
      right: 8px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--fw-verdant);
      color: white;
      font-size: 10px;
      font-weight: 900;
      align-items: center;
      justify-content: center;
    }
    .fw-pack-card.selected .fw-pack-check { display: flex; }
    .fw-pack-top {
      padding: 14px 14px 10px;
      background: linear-gradient(135deg, var(--fw-forest), var(--fw-verdant));
    }
    .fw-pack-ico { font-size: 24px; margin-bottom: 4px; }
    .fw-pack-name { font-size: 13px; font-weight: 800; color: white; }
    .fw-pack-zone { font-size: 10px; color: rgba(255,255,255,.5); margin-top: 1px; }
    .fw-pack-price { font-size: 16px; font-weight: 900; color: var(--fw-straw); margin-top: 6px; }
    .fw-pack-bot {
      padding: 10px 14px;
    }
    .fw-pack-files {
      display: flex;
      gap: 5px;
    }
    .fw-pack-file-tag {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 5px;
    }
    .fw-pack-file-xlsx {
      background: #e8f5e9;
      color: #2e7d32;
    }
    .fw-pack-file-docx {
      background: #e3f2fd;
      color: #1565c0;
    }
    .fw-pack-avail {
      font-size: 10px;
      color: #9ca3af;
      margin-top: 5px;
    }
    .fw-btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 9px 18px;
      border-radius: 9px;
      border: none;
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all .18s;
      line-height: 1;
    }
    .fw-btn-primary {
      background: var(--fw-forest);
      color: white;
    }
    .fw-btn-primary:hover { background: var(--fw-verdant); }
    .fw-btn-full { width: 100%; font-size: 15px; padding: 13px; }
    .fw-form {
      margin-bottom: 16px;
    }
    .fw-form-group {
      margin-bottom: 14px;
    }
    .fw-label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .7px;
      color: #6b7280;
      margin-bottom: 6px;
    }
    .fw-input {
      width: 100%;
      padding: 10px 13px;
      border-radius: 9px;
      border: 1.5px solid #e5e7eb;
      font-family: inherit;
      font-size: 14px;
      color: #0f1e14;
      background: white;
      transition: border-color .18s;
    }
    .fw-input:focus {
      outline: none;
      border-color: var(--fw-sage);
    }
    .fw-receipt {
      background: #faf8f4;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      padding: 14px 16px;
      margin-bottom: 16px;
    }
    .fw-receipt-title {
      font-size: 12px;
      font-weight: 700;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: .5px;
      margin-bottom: 12px;
    }
    .fw-receipt-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    .fw-receipt-ico { font-size: 20px; }
    .fw-receipt-info .name { font-size: 14px; font-weight: 700; color: #0f1e14; }
    .fw-receipt-info .sub { font-size: 11px; color: #6b7280; }
    .fw-receipt-price {
      font-size: 18px;
      font-weight: 900;
      color: var(--fw-verdant);
      margin-left: auto;
    }
    .fw-receipt-files {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }
    .fw-receipt-file-tag {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 5px 10px;
      border-radius: 7px;
      font-size: 11px;
      font-weight: 700;
    }
    .fw-pay-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 16px;
    }
    .fw-pay-option {
      border: 2px solid #e5e7eb;
      border-radius: 11px;
      padding: 12px 14px;
      cursor: pointer;
      transition: all .18s;
      display: flex;
      align-items: center;
      gap: 10px;
      background: white;
    }
    .fw-pay-option:hover { border-color: var(--fw-mint); }
    .fw-pay-option.selected {
      border-color: var(--fw-verdant);
      background: #d4edd9;
    }
    .fw-pay-ico { font-size: 22px; }
    .fw-pay-name { font-size: 13px; font-weight: 700; color: #0f1e14; }
    .fw-pay-sub { font-size: 11px; color: #9ca3af; }
    .fw-success {
      text-align: center;
      padding: 10px 0 20px;
    }
    .fw-success-anim { font-size: 52px; margin-bottom: 10px; }
    .fw-success h3 { font-size: 22px; font-weight: 900; color: var(--fw-forest); }
    .fw-success-sub { font-size: 14px; color: #6b7280; margin-top: 6px; }
    .fw-dl-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin: 20px 0;
    }
    .fw-dl-card {
      border-radius: 12px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: all .2s;
      position: relative;
    }
    .fw-dl-card:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(15,30,20,.14); }
    .fw-dl-card-excel { background: #f1f8e9; border: 1.5px solid #a5d6a7; }
    .fw-dl-card-word { background: #e3f2fd; border: 1.5px solid #90caf9; }
    .fw-dl-ico { font-size: 30px; }
    .fw-dl-name { font-size: 13px; font-weight: 700; line-height: 1.2; }
    .fw-dl-size { font-size: 11px; opacity: .6; margin-top: 2px; }
    .fw-dl-card-excel .fw-dl-name { color: #2e7d32; }
    .fw-dl-card-word .fw-dl-name { color: #1565c0; }
    .fw-sms-info {
      background: #d4edd9;
      border-radius: 10px;
      padding: 14px;
      text-align: left;
      margin-bottom: 16px;
    }
    .fw-sms-title { font-size: 12px; font-weight: 700; color: var(--fw-verdant); margin-bottom: 8px; }
    .fw-sms-text { font-size: 12px; color: #374151; line-height: 1.7; }
    .fw-footer {
      background: #faf8f4;
      padding: 10px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .fw-footer-left { font-size: 11px; color: #9ca3af; }
    .fw-footer-right { font-size: 10px; color: #bbb; }
    .fw-footer-right b { color: var(--fw-verdant); }
    .fw-toast {
      position: fixed;
      bottom: 22px;
      right: 22px;
      z-index: 9999;
      background: #0f1e14;
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      font-weight: 500;
      box-shadow: 0 20px 60px rgba(15,30,20,.2);
      transform: translateY(80px);
      opacity: 0;
      transition: all .3s ease;
    }
    .fw-toast.show { transform: translateY(0); opacity: 1; }
    .fw-toast-icon { font-size: 18px; }
    @media (max-width: 600px) {
      .fw-pack-grid { grid-template-columns: 1fr 1fr; }
      .fw-dl-grid { grid-template-columns: 1fr; }
      .fw-pay-grid { grid-template-columns: 1fr; }
    }
  `;

  // Template HTML du widget
  const WIDGET_HTML = `
    <div class="fedeactiva-widget">
      <div class="fw-header">
        <div class="fw-header-seal" id="fw-seal">FNM</div>
        <div class="fw-header-info">
          <h2 id="fw-fed-name">FENOMAT</h2>
          <p>Packs documentaires · Excel + Word · 500 FCFA</p>
        </div>
        <div class="fw-header-stats">
          <div class="fw-header-num" id="fw-pack-count">12</div>
          <div class="fw-header-label">packs disponibles</div>
        </div>
      </div>

      <div class="fw-tabs">
        <div class="fw-tab active" data-tab="boutique">Boutique</div>
        <div class="fw-tab" data-tab="client">Mon espace</div>
      </div>

      <div class="fw-body">
        <!-- BOUTIQUE TAB -->
        <div class="fw-tab-content active" id="fw-boutique">
          <!-- Step: Choose pack -->
          <div id="fw-step-choose">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
              <h3 class="fw-section-title">Choisissez votre pack documentaire</h3>
              <span class="fw-step-tag">Étape 1/3</span>
            </div>
            <div class="fw-alert">
              <div class="fw-alert-icon">📦</div>
              <div class="fw-alert-text">Chaque pack inclut <strong>2 fichiers personnalisés</strong> : un <strong>budget Excel</strong> + un <strong>guide Word</strong>. Livraison immédiate par SMS après paiement.</div>
            </div>
            <div class="fw-pack-grid" id="fw-pack-grid">
              <!-- Packs will be loaded dynamically -->
            </div>
            <button class="fw-btn fw-btn-primary fw-btn-full" id="fw-btn-next" style="opacity:0.4;pointer-events:none" onclick="FedeActivaWidget.nextStep()">
              Continuer avec ce pack →
            </button>
          </div>

          <!-- Step: Form -->
          <div id="fw-step-form" style="display:none;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
              <h3 class="fw-section-title">Vos informations</h3>
              <span class="fw-step-tag">Étape 2/3</span>
            </div>
            <div id="fw-selected-pack" class="fw-receipt"></div>
            <div class="fw-form">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
                <div class="fw-form-group">
                  <label class="fw-label">Prénom *</label>
                  <input class="fw-input" id="fw-prenom" placeholder="Koffi">
                </div>
                <div class="fw-form-group">
                  <label class="fw-label">Nom *</label>
                  <input class="fw-input" id="fw-nom" placeholder="AMETSITSI">
                </div>
              </div>
              <div class="fw-form-group">
                <label class="fw-label">Téléphone Mobile Money *</label>
                <input class="fw-input" id="fw-tel" placeholder="+228 90 00 00 00" type="tel">
              </div>
              <div class="fw-form-group">
                <label class="fw-label">Email (optionnel)</label>
                <input class="fw-input" id="fw-email" placeholder="votre@email.com" type="email">
              </div>
              <div class="fw-form-group">
                <label class="fw-label">Mot de passe *</label>
                <input class="fw-input" id="fw-password" placeholder="Créez un mot de passe" type="password">
              </div>
            </div>
            <div class="fw-alert" style="background:#e3f2fd;border-color:#90caf9;">
              <div class="fw-alert-icon">📱</div>
              <div class="fw-alert-text" style="color:#1565c0;">Après paiement, vous recevrez un <strong>SMS avec les liens de téléchargement</strong> de vos 2 fichiers.</div>
            </div>
            <div style="display:flex;gap:10px;">
              <button class="fw-btn fw-btn-full" style="flex:1;background:#e5e7eb;color:#374151;" onclick="FedeActivaWidget.prevStep()">← Retour</button>
              <button class="fw-btn fw-btn-primary fw-btn-full" style="flex:2;" onclick="FedeActivaWidget.nextStep()">Continuer →</button>
            </div>
          </div>

          <!-- Step: Payment -->
          <div id="fw-step-payment" style="display:none;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
              <h3 class="fw-section-title">Paiement</h3>
              <span class="fw-step-tag">Étape 3/3</span>
            </div>
            <div class="fw-receipt">
              <div class="fw-receipt-title">Récapitulatif</div>
              <div class="fw-receipt-row" id="fw-receipt-info">
                <span class="fw-receipt-ico" id="fw-pr-ico">🍅</span>
                <div class="fw-receipt-info">
                  <div class="name" id="fw-pr-name">Pack Tomate · Golfe-Béatrice</div>
                  <div class="sub">Fédération FENOMAT · Campagne 2025–2026</div>
                </div>
                <div class="fw-receipt-price">500 F</div>
              </div>
              <div class="fw-receipt-files">
                <div class="fw-receipt-file-tag" style="background:#e8f5e9;color:#2e7d32;">📊 Budget prévisionnel (.xlsx)</div>
                <div class="fw-receipt-file-tag" style="background:#e3f2fd;color:#1565c0;">📝 Itinéraire technique (.docx)</div>
              </div>
              <div style="border-top:1px solid #e5e7eb;margin-top:10px;padding-top:10px;display:flex;justify-content:space-between;">
                <span style="font-size:13px;font-weight:700;color:#0f1e14;">Total à payer</span>
                <span style="font-size:20px;font-weight:900;color:#2d7a4f;">500 FCFA</span>
              </div>
            </div>
            <div style="font-size:13px;font-weight:700;color:#374151;margin-bottom:10px;">Méthode de paiement</div>
            <div class="fw-pay-grid">
              <div class="fw-pay-option selected" data-method="orange_money" onclick="FedeActivaWidget.selectPay(this)">
                <span class="fw-pay-ico">🟠</span>
                <div>
                  <div class="fw-pay-name">Orange Money</div>
                  <div class="fw-pay-sub">Togo · Flooz</div>
                </div>
              </div>
              <div class="fw-pay-option" data-method="tmoney" onclick="FedeActivaWidget.selectPay(this)">
                <span class="fw-pay-ico">🟡</span>
                <div>
                  <div class="fw-pay-name">T-Money</div>
                  <div class="fw-pay-sub">Togocel</div>
                </div>
              </div>
              <div class="fw-pay-option" data-method="moov_money" onclick="FedeActivaWidget.selectPay(this)">
                <span class="fw-pay-ico">🟢</span>
                <div>
                  <div class="fw-pay-name">Moov Money</div>
                  <div class="fw-pay-sub">Moov Africa</div>
                </div>
              </div>
              <div class="fw-pay-option" data-method="card" onclick="FedeActivaWidget.selectPay(this)">
                <span class="fw-pay-ico">💳</span>
                <div>
                  <div class="fw-pay-name">Carte bancaire</div>
                  <div class="fw-pay-sub">Visa · Mastercard</div>
                </div>
              </div>
            </div>
            <div style="display:flex;gap:10px;">
              <button class="fw-btn fw-btn-full" style="flex:1;background:#e5e7eb;color:#374151;" onclick="FedeActivaWidget.prevStep()">← Retour</button>
              <button class="fw-btn fw-btn-full fw-btn-primary" style="flex:2;font-size:15px;padding:13px;background:#d4932a;" onclick="FedeActivaWidget.doPayment()">💳 Payer 500 FCFA via FedaPay</button>
            </div>
          </div>

          <!-- Step: Success -->
          <div id="fw-step-success" style="display:none;">
            <div class="fw-success">
              <div class="fw-success-anim">🎉</div>
              <h3>Paiement confirmé !</h3>
              <div class="fw-success-sub">Vos 2 fichiers sont prêts. Téléchargez-les maintenant.</div>
            </div>
            <div class="fw-dl-grid">
              <div class="fw-dl-card fw-dl-card-excel" id="fw-dl-excel">
                <span class="fw-dl-ico">📊</span>
                <div>
                  <div class="fw-dl-name" id="fw-dl-xl-name">Budget_Tomate_Golfe_AMETSITSI.xlsx</div>
                  <div class="fw-dl-size">42 Ko · Formules actives</div>
                </div>
                <button style="position:absolute;top:10px;right:10px;font-size:10px;padding:3px 8px;border-radius:6px;background:rgba(0,0,0,.08);border:none;cursor:pointer;font-weight:700;">⬇ DL</button>
              </div>
              <div class="fw-dl-card fw-dl-card-word" id="fw-dl-word">
                <span class="fw-dl-ico">📝</span>
                <div>
                  <div class="fw-dl-name" id="fw-dl-dc-name">Itineraire_Tomate_Golfe_AMETSITSI.docx</div>
                  <div class="fw-dl-size">38 Ko · Calendrier cultural</div>
                </div>
                <button style="position:absolute;top:10px;right:10px;font-size:10px;padding:3px 8px;border-radius:6px;background:rgba(0,0,0,.08);border:none;cursor:pointer;font-weight:700;">⬇ DL</button>
              </div>
            </div>
            <div class="fw-sms-info">
              <div class="fw-sms-title">📱 SMS envoyé</div>
              <div class="fw-sms-text" id="fw-sms-text">
                FedeActiva: Votre pack est prêt!<br>
                📊 Excel: liens de téléchargement<br>
                📝 Word: liens de téléchargement<br>
                Liens valides 15 min.
              </div>
            </div>
            <button class="fw-btn fw-btn-primary fw-btn-full" onclick="FedeActivaWidget.switchTab('client')">
              Accéder à mon espace client →
            </button>
          </div>
        </div>

        <!-- CLIENT TAB -->
        <div class="fw-tab-content" id="fw-client">
          <div id="fw-client-logout">
            <div style="text-align:center;padding:16px 0;">
              <div style="font-size:40px;margin-bottom:10px;">👤</div>
              <div style="font-size:16px;font-weight:800;color:#0f1e14;margin-bottom:6px;">Mon espace client</div>
              <p style="font-size:13px;color:#6b7280;margin-bottom:20px;">Retrouvez et re-téléchargez vos packs achetés</p>
              <div class="fw-form-group">
                <input class="fw-input" id="fw-client-tel" placeholder="Téléphone (+228 XX XX XX XX)" type="tel">
              </div>
              <div class="fw-form-group">
                <input class="fw-input" id="fw-client-password" placeholder="Mot de passe" type="password">
              </div>
              <button class="fw-btn fw-btn-primary fw-btn-full" style="font-size:14px;padding:12px;" onclick="FedeActivaWidget.loginClient()">
                Se connecter
              </button>
              <div style="margin-top:12px;font-size:12px;color:#9ca3af;">
                Pas encore de compte ? <span style="color:#2d7a4f;cursor:pointer;font-weight:600;" onclick="FedeActivaWidget.switchTab('boutique')">Acheter un pack →</span>
              </div>
            </div>
          </div>
          <div id="fw-client-login" style="display:none;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #e5e7eb;">
              <div style="width:44px;height:44px;border-radius:50%;background:#d4932a;display:flex;align-items:center;justify-content:center;font-weight:800;color:#0f1e14;font-size:16px;" id="fw-client-avatar">KA</div>
              <div>
                <div style="font-weight:700;color:#0f1e14;" id="fw-client-name">Koffi AMETSITSI</div>
                <div style="font-size:12px;color:#9ca3af;" id="fw-client-tel-display">+228 90 12 34 56</div>
              </div>
              <button onclick="FedeActivaWidget.logoutClient()" style="margin-left:auto;background:none;border:1px solid #e5e7eb;color:#6b7280;font-size:11px;padding:5px 10px;border-radius:8px;cursor:pointer;">Déconnexion</button>
            </div>
            <div style="font-size:14px;font-weight:800;color:#0f1e14;margin-bottom:14px;">Mes packs achetés</div>
            <div id="fw-client-packs">
              <!-- Packs will be loaded dynamically -->
            </div>
            <button class="fw-btn fw-btn-full" style="border:1.5px solid #2d7a4f;color:#2d7a4f;margin-top:16px;" onclick="FedeActivaWidget.switchTab('boutique')">
              + Acheter un nouveau pack
            </button>
          </div>
        </div>
      </div>

      <div class="fw-footer">
        <div class="fw-footer-left">🔒 Paiement sécurisé FedaPay · Livraison immédiate</div>
        <div class="fw-footer-right">Propulsé par <b>FedeActiva</b></div>
      </div>

      <div class="fw-toast" id="fw-toast">
        <span class="fw-toast-icon">✅</span>
        <span id="fw-toast-text"></span>
      </div>
    </div>
  `;

  // Classe principale du widget
  class FedeActivaWidget {
    constructor(config = {}) {
      this.config = { ...DEFAULT_CONFIG, ...config };
      this.federation = null;
      this.packs = [];
      this.selectedPack = null;
      this.currentStep = 'choose';
      this.selectedPaymentMethod = 'orange_money';
      this.clientUser = null;
      this.orderData = null;

      this.init();
    }

    init() {
      // Injecter les styles
      this.injectStyles();

      // Récupérer le container
      const container = document.querySelector(this.config.container);
      if (!container) {
        console.error('FedeActiva: Container not found:', this.config.container);
        return;
      }

      // Injecter le HTML
      container.innerHTML = WIDGET_HTML;

      // Récupérer les infos de la federation
      this.loadFederation();

      // Charger les packs
      this.loadPacks();

      // Initialiser les événements
      this.initEvents();

      // Envoyer un message de ready
      this.sendMessage('ready', { federation: this.config.federation });
    }

    injectStyles() {
      if (document.getElementById('fedeactiva-widget-styles')) return;
      const style = document.createElement('style');
      style.id = 'fedeactiva-widget-styles';
      style.textContent = WIDGET_STYLES;
      document.head.appendChild(style);
    }

    async loadFederation() {
      try {
        const response = await fetch(`${this.config.apiBase}/federations/slug/${this.config.federation}`);
        if (response.ok) {
          this.federation = await response.json();
          this.updateHeader();
        }
      } catch (error) {
        this.log('Erreur chargement federation:', error);
      }
    }

    updateHeader() {
      if (!this.federation) return;
      const seal = document.getElementById('fw-seal');
      const name = document.getElementById('fw-fed-name');
      if (seal) seal.textContent = this.federation.slug.substring(0, 3).toUpperCase();
      if (name) name.textContent = this.federation.nom;
    }

    async loadPacks() {
      try {
        const response = await fetch(`${this.config.apiBase}/packs/federation/a1b2c3d4-e5f6-7890-abcd-ef1234567890/published`);
        if (response.ok) {
          this.packs = await response.json();
          this.renderPacks();
        }
      } catch (error) {
        // Use demo data
        this.packs = [
          { id: '1', culture: { nom: 'Tomate', icone: '🍅' }, canton: { nom: 'Golfe-Béatrice' }, prixUnitaire: 500, stockDisponible: 142 },
          { id: '2', culture: { nom: 'Oignon', icone: '🧅' }, canton: { nom: 'Zio-Centre' }, prixUnitaire: 500, stockDisponible: 78 },
          { id: '3', culture: { nom: 'Piment', icone: '🌶️' }, canton: { nom: 'Kpalimé' }, prixUnitaire: 500, stockDisponible: 200 },
          { id: '4', culture: { nom: 'Laitue', icone: '🥬' }, canton: { nom: 'Agoé-Nord' }, prixUnitaire: 500, stockDisponible: 56 },
          { id: '5', culture: { nom: 'Gombo', icone: '🥦' }, canton: { nom: 'Golfe-Centre' }, prixUnitaire: 500, stockDisponible: 34 },
          { id: '6', culture: { nom: 'Concombre', icone: '🥒' }, canton: { nom: 'Tsévié' }, prixUnitaire: 500, stockDisponible: 28 },
        ];
        this.renderPacks();
        document.getElementById('fw-pack-count').textContent = this.packs.length;
      }
    }

    renderPacks() {
      const grid = document.getElementById('fw-pack-grid');
      if (!grid) return;

      grid.innerHTML = this.packs.map(pack => `
        <div class="fw-pack-card" data-pack-id="${pack.id}" onclick="FedeActivaWidget.selectPack('${pack.id}')">
          <div class="fw-pack-check">✓</div>
          <div class="fw-pack-top">
            <div class="fw-pack-ico">${pack.culture?.icone || '🌱'}</div>
            <div class="fw-pack-name">${pack.culture?.nom || 'Culture'}</div>
            <div class="fw-pack-zone">📍 ${pack.canton?.nom || 'Zone'}</div>
            <div class="fw-pack-price">500 F</div>
          </div>
          <div class="fw-pack-bot">
            <div class="fw-pack-files">
              <span class="fw-pack-file-tag fw-pack-file-xlsx">📊 Excel</span>
              <span class="fw-pack-file-tag fw-pack-file-docx">📝 Word</span>
            </div>
            <div class="fw-pack-avail">${pack.stockDisponible || 0} packs disponibles</div>
          </div>
        </div>
      `).join('');
    }

    selectPack(packId) {
      this.selectedPack = this.packs.find(p => p.id === packId);
      document.querySelectorAll('.fw-pack-card').forEach(c => c.classList.remove('selected'));
      document.querySelector(`[data-pack-id="${packId}"]`).classList.add('selected');

      const btn = document.getElementById('fw-btn-next');
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
      btn.textContent = `Continuer avec le Pack ${this.selectedPack.culture?.nom} →`;

      // Update receipt
      document.getElementById('fw-pr-ico').textContent = this.selectedPack.culture?.icone || '🌱';
      document.getElementById('fw-pr-name').textContent = `Pack ${this.selectedPack.culture?.nom} · ${this.selectedPack.canton?.nom}`;

      // Update download names
      const nom = document.getElementById('fw-nom')?.value || 'AMETSITSI';
      const zoneName = (this.selectedPack.canton?.nom || 'Zone').replace(/-/g, '_');
      document.getElementById('fw-dl-xl-name').textContent = `Budget_${this.selectedPack.culture?.nom}_${zoneName}_${nom.toUpperCase()}.xlsx`;
      document.getElementById('fw-dl-dc-name').textContent = `Itineraire_${this.selectedPack.culture?.nom}_${zoneName}_${nom.toUpperCase()}.docx`;

      this.sendMessage('packSelected', { packId, pack: this.selectedPack });
    }

    initEvents() {
      // Tab switching
      document.querySelectorAll('.fw-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          this.switchTab(tab.dataset.tab);
        });
      });

      // Form inputs for download names
      ['fw-nom'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('input', () => this.updateDownloadNames());
        }
      });

      // Listen for postMessage from parent
      window.addEventListener('message', (e) => this.handleMessage(e));
    }

    switchTab(tab) {
      document.querySelectorAll('.fw-tab').forEach(t => t.classList.remove('active'));
      document.querySelector(`.fw-tab[data-tab="${tab}"]`)?.classList.add('active');

      document.querySelectorAll('.fw-tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(`fw-${tab}`)?.classList.add('active');
    }

    nextStep() {
      if (this.currentStep === 'choose') {
        if (!this.selectedPack) {
          this.toast('Sélectionnez un pack');
          return;
        }
        this.currentStep = 'form';
        document.getElementById('fw-step-choose').style.display = 'none';
        document.getElementById('fw-step-form').style.display = 'block';
        this.updateSelectedPackReceipt();
      } else if (this.currentStep === 'form') {
        // Validate form
        const prenom = document.getElementById('fw-prenom')?.value;
        const nom = document.getElementById('fw-nom')?.value;
        const tel = document.getElementById('fw-tel')?.value;
        const password = document.getElementById('fw-password')?.value;

        if (!prenom || !nom || !tel || !password) {
          this.toast('Veuillez remplir tous les champs obligatoires');
          return;
        }

        this.orderData = { prenom, nom, telephone: tel, email: document.getElementById('fw-email')?.value, password };
        this.currentStep = 'payment';
        document.getElementById('fw-step-form').style.display = 'none';
        document.getElementById('fw-step-payment').style.display = 'block';
        this.updateDownloadNames();
      } else if (this.currentStep === 'payment') {
        // Payment will be handled by doPayment
      }
    }

    prevStep() {
      if (this.currentStep === 'form') {
        this.currentStep = 'choose';
        document.getElementById('fw-step-form').style.display = 'none';
        document.getElementById('fw-step-choose').style.display = 'block';
      } else if (this.currentStep === 'payment') {
        this.currentStep = 'form';
        document.getElementById('fw-step-payment').style.display = 'none';
        document.getElementById('fw-step-form').style.display = 'block';
      }
    }

    updateSelectedPackReceipt() {
      if (!this.selectedPack) return;
      const receipt = document.getElementById('fw-selected-pack');
      receipt.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:#d4edd9;border-radius:10px;border:1.5px solid #8fd4a8;margin-bottom:16px;">
          <span style="font-size:24px;">${this.selectedPack.culture?.icone || '🌱'}</span>
          <div>
            <div style="font-weight:700;color:#1c4a2e;font-size:14px;">Pack ${this.selectedPack.culture?.nom}</div>
            <div style="font-size:11px;color:#2d7a4f;">📍 ${this.selectedPack.canton?.nom}</div>
            <div style="display:flex;gap:6px;margin-top:5px;">
              <span class="fw-pack-file-tag fw-pack-file-xlsx">📊 Excel</span>
              <span class="fw-pack-file-tag fw-pack-file-docx">📝 Word</span>
            </div>
          </div>
          <div style="margin-left:auto;text-align:right;">
            <div style="font-size:20px;font-weight:900;color:#2d7a4f;">500 F</div>
            <button onclick="FedeActivaWidget.changePack()" style="font-size:10px;margin-top:4px;background:none;border:1px solid #52b788;color:#2d7a4f;padding:2px 8px;border-radius:6px;cursor:pointer;">Changer</button>
          </div>
        </div>
      `;
    }

    changePack() {
      this.currentStep = 'choose';
      document.getElementById('fw-step-form').style.display = 'none';
      document.getElementById('fw-step-choose').style.display = 'block';
    }

    selectPay(el) {
      document.querySelectorAll('.fw-pay-option').forEach(p => p.classList.remove('selected'));
      el.classList.add('selected');
      this.selectedPaymentMethod = el.dataset.method;
    }

    updateDownloadNames() {
      if (!this.selectedPack || !this.orderData) return;
      const nom = this.orderData.nom || document.getElementById('fw-nom')?.value || 'AMETSITSI';
      const zoneName = (this.selectedPack.canton?.nom || 'Zone').replace(/-/g, '_');
      const cultureNom = this.selectedPack.culture?.nom || 'Culture';

      document.getElementById('fw-dl-xl-name').textContent = `Budget_${cultureNom}_${zoneName}_${nom.toUpperCase()}.xlsx`;
      document.getElementById('fw-dl-dc-name').textContent = `Itineraire_${cultureNom}_${zoneName}_${nom.toUpperCase()}.docx`;
      document.getElementById('fw-sms-text').innerHTML = `
        FedeActiva: Votre pack est prêt!<br>
        📊 Excel: https://dl.fedeactiva.tg/xyz123<br>
        📝 Word: https://dl.fedeactiva.tg/abc456<br>
        Liens valides 15 min.
      `;
    }

    async doPayment() {
      this.toast('⏳ Connexion à FedaPay en cours…');

      // Simulate payment processing
      setTimeout(() => {
        this.toast('🔄 Redirection paiement...');
        setTimeout(() => {
          this.toast('✅ Paiement confirmé ! Génération des fichiers...');
          setTimeout(() => {
            this.toast('📱 SMS envoyé avec liens de téléchargement');
            this.showSuccess();
          }, 1500);
        }, 1200);
      }, 800);

      this.sendMessage('paymentInitiated', {
        packId: this.selectedPack?.id,
        method: this.selectedPaymentMethod,
        amount: 500,
      });
    }

    showSuccess() {
      this.currentStep = 'success';
      document.getElementById('fw-step-payment').style.display = 'none';
      document.getElementById('fw-step-success').style.display = 'block';

      this.sendMessage('paymentComplete', {
        reference: 'FENM-2025-00847',
        files: {
          excel: document.getElementById('fw-dl-xl-name').textContent,
          word: document.getElementById('fw-dl-dc-name').textContent,
        },
      });
    }

    loginClient() {
      const tel = document.getElementById('fw-client-tel')?.value;
      const password = document.getElementById('fw-client-password')?.value;

      if (!tel) {
        this.toast('Veuillez entrer votre numéro de téléphone');
        return;
      }

      // Simulate login
      this.clientUser = {
        nom: 'AMETSITSI',
        prenom: 'Koffi',
        telephone: tel,
      };

      document.getElementById('fw-client-logout').style.display = 'none';
      document.getElementById('fw-client-login').style.display = 'block';
      document.getElementById('fw-client-avatar').textContent = (this.clientUser.prenom[0] + this.clientUser.nom[0]).toUpperCase();
      document.getElementById('fw-client-name').textContent = `${this.clientUser.prenom} ${this.clientUser.nom}`;
      document.getElementById('fw-client-tel-display').textContent = this.clientUser.telephone;

      // Render client packs
      this.renderClientPacks();

      this.toast('✅ Connexion réussie');
    }

    logoutClient() {
      this.clientUser = null;
      document.getElementById('fw-client-logout').style.display = 'block';
      document.getElementById('fw-client-login').style.display = 'none';
    }

    renderClientPacks() {
      const container = document.getElementById('fw-client-packs');
      if (!container) return;

      // Demo packs
      const packs = [
        { culture: { nom: 'Tomate', icone: '🍅' }, canton: { nom: 'Golfe-Béatrice' }, dateAchat: '15/08/2025' },
        { culture: { nom: 'Oignon', icone: '🧅' }, canton: { nom: 'Zio-Centre' }, dateAchat: '02/07/2025' },
      ];

      container.innerHTML = packs.map(pack => `
        <div style="background:white;border-radius:12px;padding:14px 16px;margin-bottom:12px;display:flex;align-items:center;gap:14px;box-shadow:0 2px 12px rgba(15,30,20,.08);cursor:pointer;border:1.5px solid transparent;transition:all .2s;" onmouseover="this.style.boxShadow='0 8px 40px rgba(15,30,20,.14)';this.style.borderColor='#d4edd9'" onmouseout="this.style.boxShadow='0 2px 12px rgba(15,30,20,.08)';this.style.borderColor='transparent'">
          <div style="width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,#1c4a2e,#52b788);display:flex;align-items:center;justify-content:center;font-size:20px;">
            ${pack.culture.icone}
          </div>
          <div>
            <h4 style="font-size:14px;font-weight:700;color:#0f1e14;margin:0;">${pack.culture.nom} · ${pack.canton.nom}</h4>
            <p style="font-size:12px;color:#9ca3af;margin:2px 0 0;">Acheté le ${pack.dateAchat} · FENOMAT</p>
          </div>
          <div style="margin-left:auto;display:flex;gap:6px;">
            <div style="display:flex;align-items:center;gap:4px;padding:4px 8px;border-radius:7px;font-size:10px;font-weight:700;cursor:pointer;background:#e8f5e9;color:#2e7d32;" onclick="event.stopPropagation();FedeActivaWidget.toast('📊 Téléchargement Excel…')">📊 .xlsx</div>
            <div style="display:flex;align-items:center;gap:4px;padding:4px 8px;border-radius:7px;font-size:10px;font-weight:700;cursor:pointer;background:#e3f2fd;color:#1565c0;" onclick="event.stopPropagation();FedeActivaWidget.toast('📝 Téléchargement Word…')">📝 .docx</div>
          </div>
        </div>
      `).join('');
    }

    handleMessage(event) {
      // Verify origin in production
      const data = event.data;
      if (!data || !data.type) return;

      switch (data.type) {
        case 'GET_STATE':
          this.sendMessage('state', this.getState());
          break;
        case 'SET_FEDERATION':
          if (data.federation) {
            this.config.federation = data.federation;
            this.loadFederation();
            this.loadPacks();
          }
          break;
        case 'OPEN':
          // Open widget
          break;
        case 'CLOSE':
          // Close widget
          break;
      }
    }

    sendMessage(type, data = {}) {
      if (window.parent !== window) {
        window.parent.postMessage({ ...data, type: `FEDACTIV_${type.toUpperCase()}` }, '*');
      }
    }

    getState() {
      return {
        step: this.currentStep,
        selectedPack: this.selectedPack,
        clientUser: this.clientUser,
        federation: this.config.federation,
      };
    }

    toast(message) {
      const toast = document.getElementById('fw-toast');
      const text = document.getElementById('fw-toast-text');
      if (toast && text) {
        text.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3200);
      }
    }

    log(...args) {
      if (this.config.debug) {
        console.log('[FedeActiva Widget]', ...args);
      }
    }
  }

  // Auto-initialization
  function initWidget() {
    const script = document.querySelector('script[data-federation]');
    if (!script) {
      console.warn('FedeActiva: data-federation attribute not found');
      return;
    }

    const federation = script.dataset.federation;
    const container = script.dataset.container || '#fedeactiva-widget';

    window.FedeActivaWidget = new FedeActivaWidget({
      federation,
      container,
    });
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();