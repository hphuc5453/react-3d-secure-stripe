import React, { useEffect, useState } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import './Checkout.css'

export default function Checkout() {

    const stripe = useStripe();
    const elements = useElements();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    alert('Payment succeeded!')
                    break;
                case "processing":
                    alert("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    alert("Your payment was not successful, please try again.");
                    break;
                default:
                    alert("Something went wrong.");
                    break;
            }
        });

    }, [stripe])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: "http://localhost:3000/success",
            },
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
            alert(error.message);
        } else {
            alert("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs"
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <button disabled={isLoading || !stripe || !elements} id="submit">
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
                </span>
            </button>
        </form>
    );

    // const pay = async () => {
    //     try {
    //         const response = await fetch('http://localhost:5000/pay', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         })
    //         const data = await response.json();
    //         const cardElement = elements.getElement(CardElement);
    //         const confirmPayment = await stripe.confirmCardPayment(
    //             data.clientSecret,
    //             { payment_method: { card: cardElement } }
    //         )
    //         const { paymentIntent } = confirmPayment;
    //         if (paymentIntent.status == 'succeeded') alert('Payment sucessful'); else alert('Payment failed');
    //     } catch (error) {
    //         console.log(error);
    //         alert('Payment failed!')
    //     }
    // }

    // return (
    //     <div className="checkout">
    //         <CardElement />
    //         <button onClick={pay}>Pay</button>
    //     </div>
    // );
}