require('dotenv').config();
const express = require('express')
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
      subscriptions: { subscriptions }
    }
  )
})

app.get(`/prices`, async (req, res) => {
  const price = await stripe.prices.retrieve(
    req.query.id
  );
  res.send(
    {
      price: { price }
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
        price: prices.data[0].id,
        // For metered billing, do not pass quantity
        quantity: 1,

      },
    ],
    mode: 'subscription',
    success_url: `${YOUR_DOMAIN}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}`,
  });

  return res
    .status(200)
    .json({
      success: true,
      message: 'Success',
      data: {
        url: session.url
      }
    })
});

app.post('/create-portal-session', async (req, res) => {
  // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
  // Typically this is stored alongside the authenticated user in your database.
  const sessionId = req.body.session_id
  console.log(sessionId)
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

  console.log(checkoutSession)

  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = YOUR_DOMAIN;

  console.log(checkoutSession.customer)
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  });

  return res
    .status(200)
    .json({
      success: true,
      message: 'Success',
      data: {
        url: portalSession.url
      }
    })
});

app.listen(5000, () => console.log('Server is running on port 5000'));