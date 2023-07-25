import App from "./App"
import './App.css'
import { Route, Routes } from 'react-router-dom';
import BasicCard from './BasicCard'
import { useState, useEffect } from "react";
import Success from './Success'

export default function Start() {

    const [selectedSubscriptionIndex, setSelectedSubscriptionIndex] = useState(0);

    let [subscriptions, setSubscriptions] = useState([])

    useEffect(() => {
        fetch('http://localhost:5000/products', {
            method: 'GET',
        
        })
            .then((res) => res.json())
            .then((data) => {
                const fetchPromises = data.subscriptions.subscriptions.data.map(async (element) => {
                    const requestOptions = {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    };
                    const response = await fetch(`http://localhost:5000/prices?id=${element.default_price}`, requestOptions);
                    const data = await response.json();
                    return ({
                        name: element.name,
                        priceId: data.price.price.id,
                        amount: data.price.price.unit_amount,
                        currency: data.price.price.currency,
                    });
                });

                Promise.all(fetchPromises)
                    .then((newList) => {
                        setSubscriptions(newList);
                    })
                    .catch((error) => {
                        console.log('Error:', error);
                    });
            });
    }, []);


    let [success, setSuccess] = useState(false);
    let [sessionId, setSessionId] = useState('');
    let [priceSelectedId, setPriceSelectedId] = useState('')

    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);

        if (query.get('success')) {
            setSuccess(true);
            setSessionId(query.get('session_id'));
        }

        if (query.get('canceled')) {
            setSuccess(false);
        }
    }, [sessionId]);

    function changeSelectedSubscription(index) {
        setSelectedSubscriptionIndex(index)
    }

    const SuccessDisplay = ({ sessionId }) => {
        return (
            <section>
                <div className="product Box-root">
                    <div className="description Box-root" style={{alignItems:"center"}}>
                        <h3>Subscription to starter plan successful!</h3>
                    </div>
                </div>
                <button id="checkout-and-portal-button" onClick={() => {onRedirectToManagerBilling(sessionId)}}>
                    Manage your billing information
                    </button>
            </section>
        );
    };

    async function onRedirectToManagerBilling(sessionId) {
        await fetch('http://localhost:5000/create-portal-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( {
                session_id: sessionId
            })
        })
        .then((res) => res.json())
        .then((res) => {
            const {data} = res;
            window.location.href = data.url;
        })
    }

    // Form data
    const onSubmitForm = async () => {
        await fetch('http://localhost:5000/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( {
                lookup_key: priceSelectedId
            })
        })
        .then((res) => res.json())
        .then((res) => {
            const {data} = res;
            window.location.href = data.url;
        })
    }


    if (!success) {
        return <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
            <div style={{ flexDirection: 'column', display: 'flex', alignItems: 'center' }}>
                <div style={{ flexDirection: 'row', display: 'flex' }}>
                    {
                        subscriptions.map((element, index) => {
                            return <BasicCard
                                title={element.name}
                                amount={element.amount / 100}
                                onCardClick={() => {
                                    setPriceSelectedId(element.priceId)
                                    changeSelectedSubscription(index)
                                }}
                                isSelected={index === selectedSubscriptionIndex} />
                        })
                    }
                </div>
              
                <button style={{width: 300, margin: 100}} id="checkout-and-portal-button" onClick={onSubmitForm}>
                        Checkout
                    </button>
            </div>
            <Routes>
                <Route exact path="/payment" element={<App />} />
                <Route exact path="/success" element={<Success />} />
            </Routes>
        </div>;
    } else if (success && sessionId !== '') {
        return <SuccessDisplay sessionId={sessionId} />;
    }
}