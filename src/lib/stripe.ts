import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe('pk_live_51STHhnREq6ZFjXVXCHlIWoqNkdEfILxmuyN22g8alvqLuJB02rOefwMdwUTBkg5nRs76NzclHiuHiMfJqLFllRBn00aVLN5FOO');
  }
  return stripePromise;
};
