
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Use service role key to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verificar se o token Stripe está configurado
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }

    // Parse the request body for the user data
    const requestData = await req.json();
    const { email, userId } = requestData;

    logStep("Request data parsed", { email, userId: userId || "not provided" });

    // Validate request data
    if (!email) {
      throw new Error("Email is required");
    }
    
    if (!userId) {
      throw new Error("User ID is required for security reasons");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    logStep("Creating checkout session for email", { email });

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Check if customer already exists in Stripe
    logStep("Checking if customer exists");
    const customers = await stripe.customers.list({ email: email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      logStep("No existing customer found");
    }

    // Create Stripe checkout session
    logStep("Creating checkout session");
    const origin = req.headers.get("origin") || "http://localhost:5173";
    // Verificar se a origem é válida
    const validOrigins = [
      "http://localhost:5173",
      "https://preview--link-shop-showcase.lovable.app",
      "https://link-shop-showcase.lovable.app",
      "https://b180e0c0-d2e2-4215-88aa-4b49c2ecd66e.lovableproject.com",
    ];
    
    if (!validOrigins.includes(origin)) {
      logStep("Invalid origin", { origin });
      throw new Error("Invalid request origin");
    }
    
    logStep("Request origin", { origin });
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: { 
              name: "Premium Subscription",
              description: "Acesso a todas as funcionalidades premium"
            },
            unit_amount: 1990,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/dashboard?canceled=true`,
      metadata: {
        userId: userId, // Armazenar o ID do usuário para referência futura
      },
    });
    
    logStep("Session created", { 
      sessionId: session.id,
      sessionUrl: session.url || "URL not available"
    });

    // If we have a user ID, update the subscribers table
    if (userId) {
      logStep("Updating subscribers table", { userId });
      await supabaseClient.from("subscribers").upsert({
        email: email,
        user_id: userId,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
    }

    if (!session.url) {
      throw new Error("Stripe session URL is undefined");
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error creating checkout:", errorMessage);
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
