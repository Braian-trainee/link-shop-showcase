
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    // Parse the request body for the user data
    const { email, userId } = await req.json();

    // Validate request data
    if (!email) {
      throw new Error("Email is required");
    }

    console.log("Checking subscription for email:", email);
    
    // Special case for braianzavadil1@gmail.com - always grant premium
    if (email === "braianzavadil1@gmail.com") {
      // Ensure this user has premium status in the subscribers table
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      
      await supabaseClient.from("subscribers").upsert({
        email: email,
        user_id: userId || null,
        subscribed: true,
        subscription_end: oneYearFromNow.toISOString(),
        subscription_tier: "premium",
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
      
      return new Response(JSON.stringify({
        subscribed: true,
        subscription_end: oneYearFromNow.toISOString()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Regular process for other users
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    const customers = await stripe.customers.list({ email: email, limit: 1 });
    if (customers.data.length === 0) {
      await supabaseClient.from("subscribers").upsert({
        email: email,
        user_id: userId || null,
        subscribed: false,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
      
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionEnd = null;
    
    if (hasActiveSub) {
      subscriptionEnd = new Date(subscriptions.data[0].current_period_end * 1000).toISOString();
    }

    await supabaseClient.from("subscribers").upsert({
      email: email,
      user_id: userId || null,
      stripe_customer_id: customerId,
      subscribed: hasActiveSub,
      subscription_end: subscriptionEnd,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_end: subscriptionEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
