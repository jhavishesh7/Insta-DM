import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: 400, message: "Stripe is disabled" });
}
