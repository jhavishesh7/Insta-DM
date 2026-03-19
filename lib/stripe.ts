import Stripe from "stripe";

export const stripe = process.env.USE_STRIPE === "true" 
  ? new Stripe(process.env.STRIPE_CLIENT_SECRET || "", {
      apiVersion: "2024-12-18.acacia",
    })
  : null;
