import { products } from '../stripe-config';
import { supabase } from './supabase';

export async function createCheckoutSession(priceId: string, mode: 'payment' | 'subscription') {
  const { data: { session_id } } = await supabase.auth.getSession();

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session_id}`,
    },
    body: JSON.stringify({
      price_id: priceId,
      success_url: `${window.location.origin}/success`,
      cancel_url: `${window.location.origin}/cancel`,
      mode,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  const { url } = await response.json();

  if (!url) {
    throw new Error('No checkout URL received');
  }

  window.location.href = url;
}