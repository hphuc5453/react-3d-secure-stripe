import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './App.css';
import Checkout from './Checkout';
import React, { useState, useEffect } from 'react';

const stripePromise = loadStripe('pk_test_51NLHSCL49NODvQxtltxRFdsICWKj9Vr7cuA4TVznWbtgDn1n9yX7K8uK4czr4rQsS9fGGz6xARouz1VJQYPsfz7C002TwM1u5W');

export default function App({amountSubsciption}) {

  const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
      // Create PaymentIntent as soon as the page loads
      // let formData = new FormData();    //formdata object

      // formData.append('amount', amountSubsciption);   //append the values with key, value pair
      
      fetch("http://localhost:5000/create-payment-intent", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <Checkout />
        </Elements>
      )}
    </div>
  )
}
