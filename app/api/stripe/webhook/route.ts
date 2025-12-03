import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(key);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // Handle checkout completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Check if this is a one-time payment (micro-transaction) or subscription
    if (session.mode === "payment") {
      // Check if it's a micro-transaction
      const productType = session.metadata?.productType;
      if (productType) {
        await handleOneTimePurchase(session);
      }
      // Other one-time payments (legacy) are handled elsewhere
    } else if (session.mode === "subscription") {
      await handleSubscriptionCreated(session);
    }
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    await handleSubscriptionUpdated(subscription);
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    await handleSubscriptionDeleted(subscription);
  }

  return NextResponse.json({ received: true });
}

/**
 * Handle one-time micro-transaction purchases
 */
async function handleOneTimePurchase(session: Stripe.Checkout.Session) {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase not configured");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const userId = session.metadata?.userId || session.client_reference_id;
  const productType = session.metadata?.productType;
  const sessionId = session.metadata?.sessionId;

  if (!userId || !productType) {
    console.error("Missing userId or productType in session metadata");
    return;
  }

  // Get user's internal ID
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!user) {
    console.error("User not found:", userId);
    return;
  }

  // Record the purchase
  const { error } = await supabase.from("purchases").insert({
    user_id: user.id,
    session_id: sessionId || null,
    product_type: productType,
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id: session.payment_intent as string,
    amount_paid: (session.amount_total || 0) / 100,
    status: "completed",
  });

  if (error) {
    console.error("Error recording purchase:", error);
  } else {
    console.log(`Purchase recorded: ${productType} for user ${userId}`);
  }
}

async function handleSubscriptionCreated(session: Stripe.Checkout.Session) {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase not configured");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const userId = session.metadata?.userId || session.client_reference_id;
  const plan = session.metadata?.plan || "premium";

  if (!userId) {
    console.error("No userId in session metadata");
    return;
  }

  // Get subscription details
  const subscriptionId = session.subscription as string;
  const stripe = getStripe();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;

  // Get user's internal ID
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!user) {
    console.error("User not found:", userId);
    return;
  }

  // Create or update subscription
  await supabase.from("subscriptions").upsert({
    user_id: user.id,
    stripe_subscription_id: subscriptionId,
    plan: plan,
    status: subscription.status === "active" ? "active" : "trialing",
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end || false,
  });
}

async function handleSubscriptionUpdated(subscriptionData: Stripe.Subscription) {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase not configured");
    return;
  }

  const subscription = subscriptionData as any;
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  await supabase
    .from("subscriptions")
    .update({
      status: subscription.status === "active" ? "active" : "canceled",
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end || false,
    })
    .eq("stripe_subscription_id", subscription.id);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase not configured");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
    })
    .eq("stripe_subscription_id", subscription.id);
}

