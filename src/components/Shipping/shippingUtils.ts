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
  const n = method.name?.toLowerCase() ?? '';
  return (
    method.service_point_input === 'required' ||
    n.includes('relay') ||
    n.includes('relais') ||
    n.includes('shop2shop') ||
    n.includes('locker') ||
    n.includes('service point') ||
    n.includes('point retrait') ||
    method.carrier?.toLowerCase().includes('mondial')
  );
}
