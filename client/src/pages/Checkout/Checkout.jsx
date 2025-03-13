import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../../components/Checkout/CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function Checkout() {
  const location = useLocation();
  const totalAmount = location.state?.totalPrice;
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClientSecret() {
      try {
        const res = await fetch('http://localhost:3000/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalAmount, currency: 'usd' }),
        });

        const data = await res.json();
        if (data.client_secret) {
          setClientSecret(data.client_secret);
        } else {
          console.error('Error: Client secret not returned');
        }
      } catch (error) {
        console.error('Error fetching client secret:', error);
      } finally {
        setLoading(false);
      }
    }

    if (totalAmount) {
      fetchClientSecret();
    }
  }, [totalAmount]);

  if (loading) return <p>Loading payment details...</p>;
  if (!clientSecret) return <p>Error: Unable to fetch payment details.</p>;

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px'}}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Secure Checkout</h1>
      {clientSecret && stripePromise ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', color: '#777' }}>Loading payment form...</div>
      )}
    </div>
  );
}

export default Checkout;
