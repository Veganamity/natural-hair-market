import { Database } from './database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type Listing = Database['public']['Tables']['listings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export interface InvoiceData {
  transaction: Transaction;
  listing: Listing | null;
  buyer: Profile;
  seller: Profile;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatCurrency(amount: number): string {
  return `${Number(amount).toFixed(2)} EUR`;
}

function formatInvoiceNumber(transactionId: string, date: string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const shortId = transactionId.slice(0, 8).toUpperCase();
  return `FAC-${year}${month}-${shortId}`;
}

function getShippingLabel(method: string | null): string {
  if (!method) return 'Non renseigné';
  const labels: Record<string, string> = {
    chronopost: 'Chronopost',
    colissimo: 'Colissimo',
    mondial_relay: 'Mondial Relay',
    hand_delivery: 'Remise en main propre',
  };
  return labels[method] || method;
}

export function downloadInvoicePDF(data: InvoiceData): void {
  const { transaction, listing, buyer, seller } = data;
  const invoiceNumber = formatInvoiceNumber(transaction.id, transaction.created_at);
  const invoiceDate = formatDate(transaction.created_at);

  const itemPrice = Number(transaction.amount) - Number(transaction.shipping_cost || 0);
  const shippingCost = Number(transaction.shipping_cost || 0);
  const commission = Number(transaction.platform_fee || 0);

  const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #1a1a1a; background: white; padding: 48px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; border-bottom: 2px solid #059669; padding-bottom: 24px; }
  .brand { display: flex; flex-direction: column; gap: 4px; }
  .brand-name { font-size: 24px; font-weight: 800; color: #059669; letter-spacing: -0.5px; }
  .brand-sub { font-size: 11px; color: #6b7280; }
  .invoice-meta { text-align: right; }
  .invoice-title { font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 8px; }
  .invoice-number { font-size: 13px; font-weight: 600; color: #059669; margin-bottom: 4px; }
  .invoice-date { font-size: 11px; color: #6b7280; }
  .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; }
  .party-block { padding: 20px; border-radius: 8px; }
  .party-block.buyer { background: #f0fdf4; border: 1px solid #bbf7d0; }
  .party-block.seller { background: #f8fafc; border: 1px solid #e2e8f0; }
  .party-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #6b7280; margin-bottom: 8px; }
  .party-name { font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 4px; }
  .party-email { font-size: 11px; color: #6b7280; }
  .items-table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
  .items-table th { background: #f3f4f6; padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
  .items-table th:last-child { text-align: right; }
  .items-table td { padding: 14px 16px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
  .items-table td:last-child { text-align: right; font-weight: 600; }
  .item-title { font-weight: 600; color: #111827; margin-bottom: 3px; }
  .item-sub { font-size: 10px; color: #9ca3af; }
  .totals { display: flex; justify-content: flex-end; margin-bottom: 40px; }
  .totals-box { width: 280px; }
  .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 12px; color: #374151; border-bottom: 1px solid #f3f4f6; }
  .totals-row.total { border-bottom: none; padding-top: 12px; margin-top: 4px; border-top: 2px solid #059669; }
  .totals-row.total span { font-size: 15px; font-weight: 800; color: #059669; }
  .totals-row.commission span { color: #ef4444; font-weight: 600; }
  .shipping-block { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 32px; }
  .shipping-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; margin-bottom: 10px; }
  .shipping-row { display: flex; gap: 8px; font-size: 11px; color: #374151; margin-bottom: 4px; }
  .shipping-row strong { font-weight: 600; min-width: 100px; color: #111827; }
  .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  .status-completed { background: #dcfce7; color: #166534; }
  .status-pending { background: #fef9c3; color: #854d0e; }
  .status-refunded { background: #f3f4f6; color: #374151; }
  .ref-block { margin-bottom: 32px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .ref-label { font-size: 10px; color: #9ca3af; }
  .ref-value { font-size: 11px; font-weight: 600; color: #374151; font-family: monospace; }
  .footer { text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb; }
  .footer-text { font-size: 10px; color: #9ca3af; line-height: 1.6; }
  .footer-brand { font-weight: 700; color: #059669; }
</style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <div class="brand-name">HairMarket</div>
      <div class="brand-sub">Marketplace de cheveux naturels</div>
    </div>
    <div class="invoice-meta">
      <div class="invoice-title">FACTURE</div>
      <div class="invoice-number">${invoiceNumber}</div>
      <div class="invoice-date">Date: ${invoiceDate}</div>
    </div>
  </div>

  <div class="parties">
    <div class="party-block buyer">
      <div class="party-label">Acheteur (Facturé à)</div>
      <div class="party-name">${buyer.full_name || 'Client'}</div>
      ${buyer.email ? `<div class="party-email">${buyer.email}</div>` : ''}
    </div>
    <div class="party-block seller">
      <div class="party-label">Vendeur</div>
      <div class="party-name">${seller.full_name || 'Vendeur'}</div>
      ${seller.email ? `<div class="party-email">${seller.email}</div>` : ''}
    </div>
  </div>

  <div class="ref-block">
    <span class="ref-label">Référence transaction:</span>
    <span class="ref-value">${transaction.id}</span>
    ${transaction.stripe_payment_intent_id ? `<span class="ref-label">Référence Stripe:</span><span class="ref-value">${transaction.stripe_payment_intent_id}</span>` : ''}
    <span class="status-badge ${transaction.status === 'completed' ? 'status-completed' : transaction.status === 'refunded' ? 'status-refunded' : 'status-pending'}">
      ${transaction.status === 'completed' ? 'Payé' : transaction.status === 'refunded' ? 'Remboursé' : 'En attente'}
    </span>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align:right">Montant</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div class="item-title">${listing?.title || 'Article'}</div>
          ${listing?.hair_type ? `<div class="item-sub">Type: ${listing.hair_type}${listing.hair_length ? ` · ${listing.hair_length} cm` : ''}</div>` : ''}
        </td>
        <td>${formatCurrency(itemPrice)}</td>
      </tr>
      ${shippingCost > 0 ? `
      <tr>
        <td>
          <div class="item-title">Frais de livraison</div>
          <div class="item-sub">${getShippingLabel(transaction.shipping_method)}</div>
        </td>
        <td>${formatCurrency(shippingCost)}</td>
      </tr>
      ` : ''}
      ${shippingCost === 0 && transaction.shipping_method ? `
      <tr>
        <td>
          <div class="item-title">Livraison</div>
          <div class="item-sub">${getShippingLabel(transaction.shipping_method)}</div>
        </td>
        <td>Offert</td>
      </tr>
      ` : ''}
      <tr>
        <td>
          <div class="item-title">Commission marketplace</div>
          <div class="item-sub">Service HairMarket (${(Number(transaction.marketplace_commission_rate) * 100).toFixed(0)}%)</div>
        </td>
        <td style="color:#ef4444">-${formatCurrency(commission)}</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-box">
      ${shippingCost > 0 ? `
      <div class="totals-row">
        <span>Sous-total article</span>
        <span>${formatCurrency(itemPrice)}</span>
      </div>
      <div class="totals-row">
        <span>Livraison</span>
        <span>${formatCurrency(shippingCost)}</span>
      </div>
      ` : ''}
      <div class="totals-row commission">
        <span>Commission HairMarket</span>
        <span>-${formatCurrency(commission)}</span>
      </div>
      <div class="totals-row total">
        <span>Total payé</span>
        <span>${formatCurrency(Number(transaction.amount))}</span>
      </div>
    </div>
  </div>

  ${transaction.shipping_method ? `
  <div class="shipping-block">
    <div class="shipping-title">Informations de livraison</div>
    <div class="shipping-row">
      <strong>Mode:</strong>
      <span>${getShippingLabel(transaction.shipping_method)}</span>
    </div>
    ${transaction.tracking_number ? `
    <div class="shipping-row">
      <strong>N° de suivi:</strong>
      <span>${transaction.tracking_number}</span>
    </div>
    ` : ''}
    ${transaction.shipped_at ? `
    <div class="shipping-row">
      <strong>Expédié le:</strong>
      <span>${formatDate(transaction.shipped_at)}</span>
    </div>
    ` : ''}
    ${transaction.delivered_at ? `
    <div class="shipping-row">
      <strong>Livré le:</strong>
      <span>${formatDate(transaction.delivered_at)}</span>
    </div>
    ` : ''}
    ${transaction.relay_point_name ? `
    <div class="shipping-row">
      <strong>Point relais:</strong>
      <span>${transaction.relay_point_name}${transaction.relay_point_address ? ` — ${transaction.relay_point_address}` : ''}</span>
    </div>
    ` : ''}
  </div>
  ` : ''}

  <div class="footer">
    <div class="footer-text">
      <span class="footer-brand">HairMarket</span> — Marketplace de cheveux naturels<br>
      Ce document tient lieu de facture. Conservez-le pour vos archives.<br>
      Pour toute question, contactez notre support.
    </div>
  </div>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Veuillez autoriser les popups pour télécharger la facture.');
    return;
  }

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}
