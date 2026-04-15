import { loadStripe, Stripe } from '@stripe/stripe-js';

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_live_51STHhnREq6ZFjXVXCHlIWoqNkdEfILxmuyN22g8alvqLuJB02rOefwMdwUTBkg5nRs76NzclHiuHiMfJqLFllRBn00aVLN5FOO';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_KEY);
  }
  return stripePromise;
};
