require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.post("/create-payment-intent", async (req, res) => {
    const { items } = req.body;
  
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1400,
      currency: "aud",
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  });
  

app.post('/pay', async (req, res) => {
    try {
        const amount = 200;
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: ['card'],
            metadata: {
                name: 'value'
            }
        });
        const clientSecret = paymentIntent.client_secret;
        res.json({ clientSecret, message: 'Payment initated sucessfully' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' })
    }
})

app.post('/stripe', (req, res) => {
    if (req.body.type === "payment_intent.created") {
    console.log(`${req.body.data.object.metadata.name} initated payment!`);
  }
  if (req.body.type === "payment_intent.succeeded") {
    console.log(`${req.body.data.object.metadata.name} succeeded payment!`);
  }
})

app.listen(5000, () => console.log('Server is running on port 5000'));