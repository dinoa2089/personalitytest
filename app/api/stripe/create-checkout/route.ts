import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const { plan, userId } = await request.json();

    if (!plan || !userId) {
      return NextResponse.json(
        { error: "Plan and userId are required" },
        { status: 400 }
      );
    }

    // Stripe price IDs - these need to be created in Stripe Dashboard
    const priceIds: Record<string, string> = {
      premium_monthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || "",
      premium_yearly: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID || "",
      professional_monthly: process.env.STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID || "",
      professional_yearly: process.env.STRIPE_PROFESSIONAL_YEARLY_PRICE_ID || "",
    };

    const priceId = priceIds[plan];
    if (!priceId) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing?canceled=true`,
      client_reference_id: userId,
      metadata: {
        userId,
        plan: plan.includes("premium") ? "premium" : "professional",
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

