export interface SendcloudMethod {
  id: number;
  name: string;
  carrier: string;
  price: number;
  service_point_input: string;
  min_weight: number;
  max_weight: number;
}

export const SIGNATURE_SURCHARGE = 2.50;

export function isRelayMethod(method: SendcloudMethod): boolean {
  return method.service_point_input === 'required';
}

// Transforms all home/express methods into "avec signature" variants (+2.50€).
// Relay methods are left unchanged (they are already secure by nature).
export function applySignatureSurcharge(methods: SendcloudMethod[]): SendcloudMethod[] {
  return methods.map(m => {
    if (isRelayMethod(m)) return m;

    const n = m.name ?? '';
    const carrier = (m.carrier ?? '').toLowerCase();
    const nameLower = n.toLowerCase();

    let newName: string;
    if (carrier.includes('colissimo') || nameLower.includes('colissimo')) {
      newName = 'Colissimo Domicile avec signature';
    } else if (carrier.includes('chronopost') || nameLower.includes('chronopost')) {
      newName = 'Chronopost Domicile avec signature';
    } else {
      newName = n.replace(/\s*\(contre signature\)/i, '').trim() + ' avec signature';
    }

    return {
      ...m,
      price: (m.price ?? 0) + SIGNATURE_SURCHARGE,
      name: newName,
    };
  });
}

// Returns the carrier slug to pass to the Sendcloud service point widget
export function getCarrierSlug(method: SendcloudMethod): string {
  const carrier = method.carrier?.toLowerCase() ?? '';
  const name = method.name?.toLowerCase() ?? '';
  if (carrier.includes('mondial') || name.includes('mondial') || name.includes('shop2shop')) return 'mondial_relay';
  if (carrier.includes('chronopost') || name.includes('chrono')) return 'chronopost';
  if (carrier.includes('colissimo') || name.includes('colissimo')) return 'colissimo';
  if (carrier.includes('ups') || name.includes('ups')) return 'ups';
  if (carrier.includes('dhl') || name.includes('dhl')) return 'dhl';
  if (carrier.includes('gls') || name.includes('gls')) return 'gls';
  return carrier || name;
}
