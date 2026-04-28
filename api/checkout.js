import Stripe from 'stripe';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoda nije dozvoljena' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const { priceId, successUrl, cancelUrl } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: successUrl || 'https://flowmagia.webflow.io/success',
      cancel_url: cancelUrl || 'https://flowmagia.webflow.io/cancel',
    });

    return res.status(200).json({ url: session.url });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
