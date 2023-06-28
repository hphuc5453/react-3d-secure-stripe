require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.post("/create-payment-intent", async (req, res) => {
  // let { amount } = req.body
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 15 * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.get("/products", async (req, res) => {
  const subscriptions = await stripe.products.list();
  res.send(
    {
      subscriptions: {subscriptions}
    }
  )
})

app.get(`/prices`, async (req, res) => {
  const price = await stripe.prices.retrieve(
    req.query.id
  );
  res.send(
    {
      price: {price}
    }
  )
})

const YOUR_DOMAIN = 'http://localhost:3000'

app.post('/create-checkout-session', async (req, res) => {
  const prices = await stripe.prices.list({
    lookup_keys: [req.body.lookup_key],
    expand: ['data.product'],
  });
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    line_items: [
      {
        price: req.body.lookup_key,
        // For metered billing, do not pass quantity
        quantity: 1,

      },
    ],
    mode: 'subscription',
    success_url: `${YOUR_DOMAIN}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}`,
  });

  res.redirect(303, session.url);
});


// app.post('/pay', async (req, res) => {
//   try {
//     const amount = 200;
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: 'usd',
//       payment_method_types: ['card'],
//       metadata: {
//         name: 'value'
//       }
//     });
//     const clientSecret = paymentIntent.client_secret;
//     res.json({ clientSecret, message: 'Payment initated sucessfully' })
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: 'Internal server error' })
//   }
// })

// app.post('/stripe', (req, res) => {
//   if (req.body.type === "payment_intent.created") {
//     console.log(`${req.body.data.object.metadata.name} initated payment!`);
//   }
//   if (req.body.type === "payment_intent.succeeded") {
//     console.log(`${req.body.data.object.metadata.name} succeeded payment!`);
//   }
// })

app.listen(5000, () => console.log('Server is running on port 5000'));