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

// Plan configurations
const planConfig: Record<string, {
  priceEnvKey: string;
  mode: "payment" | "subscription";
  planType: string;
  productType?: string; // For micro-transactions
}> = {
  // === MICRO-TRANSACTION PRODUCTS (NEW) ===
  compatibility: {
    priceEnvKey: "STRIPE_COMPATIBILITY_REPORT_PRICE_ID",
    mode: "payment",
    planType: "micro",
    productType: "compatibility",
  },
  career: {
    priceEnvKey: "STRIPE_CAREER_DEEP_DIVE_PRICE_ID",
    mode: "payment",
    planType: "micro",
    productType: "career",
  },
  frameworks: {
    priceEnvKey: "STRIPE_FRAMEWORK_BUNDLE_PRICE_ID",
    mode: "payment",
    planType: "micro",
    productType: "frameworks",
  },
  growth_plan: {
    priceEnvKey: "STRIPE_GROWTH_PLAN_PRICE_ID",
    mode: "payment",
    planType: "micro",
    productType: "growth_plan",
  },
  full_unlock: {
    priceEnvKey: "STRIPE_FULL_UNLOCK_PRICE_ID",
    mode: "payment",
    planType: "micro",
    productType: "full_unlock",
  },
  
  // === LEGACY ONE-TIME PURCHASES ===
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
  
  // === SUBSCRIPTIONS ===
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
  
  // === B2B CODE PACKS ===
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
  
  // === TEAM ===
  team_dashboard: {
    priceEnvKey: "STRIPE_TEAM_DASHBOARD_PRICE_ID",
    mode: "subscription",
    planType: "team_dashboard",
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
          lifetime_spent: supabase.rpc ? priceInDollars : 0,
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

      // Create premium unlock for relevant plan types
      if (["micro", "premium_report", "deep_dive", "premium", "unlimited"].includes(config.planType)) {
        await supabase.from("premium_unlocks").insert({
          user_id: internalUserId,
          unlock_method: "paid",
          unlock_source: `credits_${plan}`,
          expires_at: null, // Permanent
        });
      }

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
      allow_promotion_codes: true, // Allow testers to use promo codes like 107TYPES
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
