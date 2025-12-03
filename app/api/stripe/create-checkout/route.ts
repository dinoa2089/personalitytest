import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAppUrl } from "@/lib/app-url";
import { supabase } from "@/lib/supabase";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(key);
}

// Simplified plan configurations
// Consumer: Just "full_unlock" for $4.99
// Employer: Per-assessment pricing and credit packs
const planConfig: Record<string, {
  priceEnvKey: string;
  mode: "payment" | "subscription";
  planType: string;
  productType?: string;
}> = {
  // === CONSUMER PRODUCT (SIMPLIFIED) ===
  full_unlock: {
    priceEnvKey: "STRIPE_FULL_UNLOCK_PRICE_ID", // $4.99 one-time
    mode: "payment",
    planType: "micro",
    productType: "full_unlock",
  },
  
  // === LEGACY MICRO-PRODUCTS (backwards compat - all map to full_unlock) ===
  compatibility: {
    priceEnvKey: "STRIPE_FULL_UNLOCK_PRICE_ID",
    mode: "payment",
    planType: "micro",
    productType: "full_unlock", // Maps to full unlock
  },
  career: {
    priceEnvKey: "STRIPE_FULL_UNLOCK_PRICE_ID",
    mode: "payment",
    planType: "micro",
    productType: "full_unlock",
  },
  frameworks: {
    priceEnvKey: "STRIPE_FULL_UNLOCK_PRICE_ID",
    mode: "payment",
    planType: "micro",
    productType: "full_unlock",
  },
  growth_plan: {
    priceEnvKey: "STRIPE_FULL_UNLOCK_PRICE_ID",
    mode: "payment",
    planType: "micro",
    productType: "full_unlock",
  },
  
  // === B2B: EMPLOYER SINGLE ASSESSMENTS ===
  employer_assessment: {
    priceEnvKey: "STRIPE_EMPLOYER_ASSESSMENT_PRICE_ID", // $15 per assessment
    mode: "payment",
    planType: "employer",
    productType: "employer_assessment",
  },
  
  // === B2B: CREDIT PACKS ===
  codes_10: {
    priceEnvKey: "STRIPE_CODES_10_PRICE_ID", // 10 assessments @ $12 each = $120
    mode: "payment",
    planType: "codes",
    productType: "codes_10",
  },
  codes_25: {
    priceEnvKey: "STRIPE_CODES_25_PRICE_ID", // 25 assessments @ $10 each = $250
    mode: "payment",
    planType: "codes",
    productType: "codes_25",
  },
  codes_50: {
    priceEnvKey: "STRIPE_CODES_50_PRICE_ID", // 50 assessments @ $10 each = $500
    mode: "payment",
    planType: "codes",
    productType: "codes_50",
  },
  codes_100: {
    priceEnvKey: "STRIPE_CODES_100_PRICE_ID", // 100 assessments @ $10 each = $1000
    mode: "payment",
    planType: "codes",
    productType: "codes_100",
  },
  
  // === B2B: TEAM SUBSCRIPTION ===
  team_monthly: {
    priceEnvKey: "STRIPE_TEAM_MONTHLY_PRICE_ID",
    mode: "subscription",
    planType: "team",
    productType: "team",
  },
  
  // === LEGACY (backwards compatibility) ===
  premium_report: {
    priceEnvKey: "STRIPE_FULL_UNLOCK_PRICE_ID",
    mode: "payment",
    planType: "micro",
    productType: "full_unlock",
  },
  deep_dive: {
    priceEnvKey: "STRIPE_FULL_UNLOCK_PRICE_ID",
    mode: "payment",
    planType: "micro",
    productType: "full_unlock",
  },
};

export async function POST(request: NextRequest) {
  try {
    const { plan, userId, sessionId, applyCredits, clerkId } = await request.json();

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

    // Handle credits if user wants to apply them
    let creditsToApply = 0;
    let internalUserId: string | null = null;

    if (applyCredits && clerkId) {
      // Get user's internal ID and credit balance
      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", clerkId)
        .single();

      if (user) {
        internalUserId = user.id;
        const { data: credits } = await supabase
          .from("user_credits")
          .select("balance")
          .eq("user_id", user.id)
          .single();

        if (credits && Number(credits.balance) > 0) {
          creditsToApply = Number(credits.balance);
        }
      }
    }

    // Get price from Stripe to calculate if credits cover full amount
    const price = await stripe.prices.retrieve(priceId);
    const unitAmount = price.unit_amount || 0; // in cents
    const priceInDollars = unitAmount / 100;

    // Check if credits cover the full price
    if (creditsToApply >= priceInDollars && internalUserId) {
      // Credits cover the full price - process without Stripe
      const { error: deductError } = await supabase
        .from("user_credits")
        .update({
          balance: creditsToApply - priceInDollars,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", internalUserId);

      if (deductError) {
        console.error("Error deducting credits:", deductError);
        return NextResponse.json(
          { error: "Failed to apply credits" },
          { status: 500 }
        );
      }

      // Log the credit transaction
      await supabase.from("credit_transactions").insert({
        user_id: internalUserId,
        amount: -priceInDollars,
        type: "purchase_applied",
        description: `Purchased ${plan} with credits`,
        reference_id: sessionId || null,
      });

      // Create a purchase record
      await supabase.from("purchases").insert({
        user_id: internalUserId,
        session_id: sessionId || null,
        product_type: config.productType || config.planType,
        amount_paid: 0,
        credits_applied: priceInDollars,
        status: "completed",
      });

      // Create premium unlock
      await supabase.from("premium_unlocks").insert({
        user_id: internalUserId,
        unlock_method: "paid",
        unlock_source: `credits_${plan}`,
        expires_at: null, // Permanent
      });

      return NextResponse.json({
        success: true,
        paidWithCredits: true,
        creditsApplied: priceInDollars,
        newBalance: creditsToApply - priceInDollars,
        redirectUrl: `${appUrl}/dashboard?success=true&plan=${plan}&credits=true`,
      });
    }

    // Build success URL with relevant params
    const successUrl = new URL(`${appUrl}/dashboard`);
    successUrl.searchParams.set("success", "true");
    successUrl.searchParams.set("plan", plan);
    if (sessionId) {
      successUrl.searchParams.set("session", sessionId);
    }

    // Create checkout session config
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
      allow_promotion_codes: true,
      metadata: {
        userId,
        plan,
        planType: config.planType,
        productType: config.productType || "",
        sessionId: sessionId || "",
        creditsApplied: creditsToApply.toString(),
        internalUserId: internalUserId || "",
      },
    };

    // If user has partial credits, apply them as a discount
    if (creditsToApply > 0 && creditsToApply < priceInDollars && internalUserId) {
      // Create a coupon for the credit amount
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(creditsToApply * 100), // Convert to cents
        currency: "usd",
        duration: "once",
        name: `Credit Balance ($${creditsToApply.toFixed(2)})`,
      });

      checkoutConfig.discounts = [{ coupon: coupon.id }];
      checkoutConfig.metadata!.creditsApplied = creditsToApply.toString();
      checkoutConfig.metadata!.couponId = coupon.id;

      // Deduct credits now (will be confirmed by webhook)
      await supabase
        .from("user_credits")
        .update({
          balance: 0,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", internalUserId);

      // Log the credit transaction
      await supabase.from("credit_transactions").insert({
        user_id: internalUserId,
        amount: -creditsToApply,
        type: "purchase_applied",
        description: `Applied to ${plan} purchase`,
        reference_id: sessionId || null,
      });
    }

    const session = await stripe.checkout.sessions.create(checkoutConfig);

    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url,
      creditsApplied: creditsToApply,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
