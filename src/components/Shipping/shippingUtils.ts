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
  return (
    method.service_point_input === 'required' ||
    method.name?.toLowerCase().includes('relay') ||
    method.name?.toLowerCase().includes('point relais') ||
    method.carrier?.toLowerCase().includes('mondial')
  );
}
