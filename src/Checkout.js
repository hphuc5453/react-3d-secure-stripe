import React from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import './Checkout.css'

const CURRENCY = 'eur';

const toCent = amount => amount * 100;

// const stripe = Stripe('pk_test_51NLHSCL49NODvQxtltxRFdsICWKj9Vr7cuA4TVznWbtgDn1n9yX7K8uK4czr4rQsS9fGGz6xARouz1VJQYPsfz7C002TwM1u5W');

function Checkout() {

    // const response = await fetch('http://localhost:5000/create-payment-intent', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })

    const stripe = useStripe();
    const elements = useElements();
    const pay = async () => {
        try {
            const response = await fetch('http://localhost:5000/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json();
            const cardElement = elements.getElement(CardElement);
            const confirmPayment = await stripe.confirmCardPayment(
                data.clientSecret,
                { payment_method: { card: cardElement } }
            )
            const { paymentIntent } = confirmPayment;
            if (paymentIntent.status == 'succeeded') alert('Payment sucessful'); else alert('Payment failed');
        } catch (error) {
            console.log(error);
            alert('Payment failed!')
        }
    }

    return (
        <div className="checkout">
            <CardElement />
            <button onClick={pay}>Pay</button>
        </div>
    );
}

export default Checkout;