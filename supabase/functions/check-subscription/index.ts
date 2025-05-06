
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { email, userId } = await req.json();
    
    logStep("Checking subscription for email", { email });

    // Input validation
    if (!email) {
      throw new Error("Email is required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Check if the user is subscribed
    const { data, error } = await supabaseClient
      .from("subscribers")
      .select("subscribed, subscription_end")
      .eq("email", email)
      .single();

    if (error) {
      logStep("Error checking subscription", { error });
      
      // If record not found, return false (not subscribed)
      if (error.code === "PGRST116") {
        return new Response(
          JSON.stringify({ subscribed: false, message: "User not found in subscribers" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw error;
    }

    // Check if subscription is active and not expired
    let isSubscribed = data?.subscribed || false;
    
    // Check if subscription has an end date and if it's in the future
    if (isSubscribed && data?.subscription_end) {
      const endDate = new Date(data.subscription_end);
      const now = new Date();
      
      if (endDate < now) {
        // Subscription has expired
        isSubscribed = false;
        
        // Update the database to reflect this
        try {
          await supabaseClient
            .from("subscribers")
            .update({ 
              subscribed: false,
              updated_at: now.toISOString()
            })
            .eq("email", email);
            
          logStep("Updated expired subscription", { email });
        } catch (updateError) {
          // Log but don't fail on update error
          logStep("Error updating expired subscription", { updateError });
        }
      }
    }

    logStep("Subscription check complete", { 
      email,
      subscribed: isSubscribed
    });

    return new Response(
      JSON.stringify({ 
        subscribed: isSubscribed,
        subscription_end: data?.subscription_end || null
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    logStep("Error checking subscription", { error: err });
    
    const errorMessage = err instanceof Error ? err.message : String(err);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
