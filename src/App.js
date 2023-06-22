import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './App.css';
import Checkout from './Checkout';
import BasicCard from './BasicCard';

const stripePromise = loadStripe('pk_test_51NLHSCL49NODvQxtltxRFdsICWKj9Vr7cuA4TVznWbtgDn1n9yX7K8uK4czr4rQsS9fGGz6xARouz1VJQYPsfz7C002TwM1u5W');

function App() {
  return (
    <div className="App">
      <BasicCard />
      <Elements stripe={stripePromise}>
        <Checkout />
      </Elements>
    </div>
  );
}

export default App;
