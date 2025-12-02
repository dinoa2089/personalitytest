import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAppUrl } from "@/lib/app-url";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(key);
}

// Plan configurations
const planConfig: Record<string, {
  priceEnvKey: string;
  mode: "payment" | "subscription";
  planType: string;
}> = {
  // One-time purchases
  premium_report: {
    priceEnvKey: "STRIPE_PREMIUM_REPORT_PRICE_ID",
    mode: "payment",
    planType: "premium_report",
  },
  deep_dive: {
    priceEnvKey: "STRIPE_DEEP_DIVE_PRICE_ID",
    mode: "payment",
    planType: "deep_dive",
  },
  // Subscriptions
  unlimited_monthly: {
    priceEnvKey: "STRIPE_UNLIMITED_MONTHLY_PRICE_ID",
    mode: "subscription",
    planType: "unlimited",
  },
  unlimited_yearly: {
    priceEnvKey: "STRIPE_UNLIMITED_YEARLY_PRICE_ID",
    mode: "subscription",
    planType: "unlimited",
  },
  // Legacy plans (for backwards compatibility)
  premium_monthly: {
    priceEnvKey: "STRIPE_PREMIUM_MONTHLY_PRICE_ID",
    mode: "subscription",
    planType: "premium",
  },
  premium_yearly: {
    priceEnvKey: "STRIPE_PREMIUM_YEARLY_PRICE_ID",
    mode: "subscription",
    planType: "premium",
  },
  professional_monthly: {
    priceEnvKey: "STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID",
    mode: "subscription",
    planType: "professional",
  },
  professional_yearly: {
    priceEnvKey: "STRIPE_PROFESSIONAL_YEARLY_PRICE_ID",
    mode: "subscription",
    planType: "professional",
  },
  // B2B Code Packs
  codes_10: {
    priceEnvKey: "STRIPE_CODES_10_PRICE_ID",
    mode: "payment",
    planType: "codes",
  },
  codes_25: {
    priceEnvKey: "STRIPE_CODES_25_PRICE_ID",
    mode: "payment",
    planType: "codes",
  },
  codes_50: {
    priceEnvKey: "STRIPE_CODES_50_PRICE_ID",
    mode: "payment",
    planType: "codes",
  },
  codes_100: {
    priceEnvKey: "STRIPE_CODES_100_PRICE_ID",
    mode: "payment",
    planType: "codes",
  },
  // Team Dashboard
  team_dashboard: {
    priceEnvKey: "STRIPE_TEAM_DASHBOARD_PRICE_ID",
    mode: "subscription",
    planType: "team_dashboard",
  },
};

export async function POST(request: NextRequest) {
  try {
    const { plan, userId, sessionId } = await request.json();

    if (!plan || !userId) {
      return NextResponse.json(
        { error: "Plan and userId are required" },
        { status: 400 }
      );
    }

    const config = planConfig[plan];
    if (!config) {
      return NextResponse.json(
        { error: `Invalid plan: ${plan}` },
        { status: 400 }
      );
    }

    const priceId = process.env[config.priceEnvKey];
    if (!priceId) {
      // For development, return a friendly error
      console.warn(`Missing Stripe price ID for ${plan}: ${config.priceEnvKey}`);
      return NextResponse.json(
        { error: `Stripe not configured for ${plan}. Please set ${config.priceEnvKey} in environment variables.` },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const appUrl = getAppUrl();

    // Build success URL with relevant params
    const successUrl = new URL(`${appUrl}/dashboard`);
    successUrl.searchParams.set("success", "true");
    successUrl.searchParams.set("plan", plan);
    if (sessionId) {
      successUrl.searchParams.set("session", sessionId);
    }

    // Create checkout session
    const checkoutConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: config.mode,
      success_url: successUrl.toString(),
      cancel_url: `${appUrl}/pricing?canceled=true`,
      client_reference_id: userId,
      metadata: {
        userId,
        plan,
        planType: config.planType,
        sessionId: sessionId || "",
      },
    };

    // Add customer email if available
    // This helps with Stripe's fraud detection and customer lookup

    const session = await stripe.checkout.sessions.create(checkoutConfig);

    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url 
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
