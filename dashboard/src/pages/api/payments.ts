import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { agentId, price, subscription } = req.body;

      // Create a Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Nexus Vault Agent: ${agentId}`,
                description: subscription
                  ? "Monthly subscription"
                  : "One-time purchase",
              },
              unit_amount: Math.round(price * 100), // Convert to cents
              recurring: subscription
                ? {
                    interval: "month",
                  }
                : undefined,
            },
            quantity: 1,
          },
        ],
        mode: subscription ? "subscription" : "payment",
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
      });

      return res.status(200).json({
        success: true,
        data: {
          sessionId: session.id,
        },
      });
    } catch (error) {
      console.error("Payment error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to create payment session",
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: "Method not allowed",
  });
}
