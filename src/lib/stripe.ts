import { loadStripe, Stripe } from '@stripe/stripe-js';

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_KEY);
  }
  return stripePromise;
};
