export interface SendcloudMethod {
  id: number;
  name: string;
  carrier: string;
  price: number;
  service_point_input: string;
  min_weight: number;
  max_weight: number;
}

export function isRelayMethod(method: SendcloudMethod): boolean {
  return method.service_point_input === 'required';
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
