import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!
const FROM_EMAIL = "hello@yourdomain.com"  

serve(async (req) => {
    const { record } = await req.json()

    const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!
    )

    const { error } = await supabase
        .from("waitlist")
        .update({ welcome_sent: true })
        .eq("id", record.id)


    await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: `Craft <${FROM_EMAIL}>`,
            to: record.email,
            subject: `${record.name ? record.name.split(" ")[0] : "Friend"
                }, welcome to the future of craft`,
            html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0F0A05; color: #FAF9F6;">
          <h1 style="font-size: 42px; text-align: center; background: linear-gradient(135deg, #C1A170, #D4C19E); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            ${record.name ? `Welcome, ${record.name.split(" ")[0]}` : "Welcome"}
          </h1>
          <p style="font-size: 20px; line-height: 1.6; color: #D4C19E; text-align: center;">
            You've secured your spot on the Craft waitlist.
          </p>
          <div style="text-align: center; margin: 40px 0;">
            <div style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #C1A170, #D4C19E); border-radius: 50px; font-weight: bold; font-size: 18px;">
              Position #${record.position || "Early"}
            </div>
          </div>
          <p style="font-size: 16px; color: #A67C52;">
            You're in. Early access, founder pricing, and exclusive drops are coming your way.
          </p>
          <hr style="border: 1px solid #2D1B0F; margin: 40px 0;" />
          <p style="font-size: 14px; color: #8B6F47; text-align: center;">
            Handcrafted with care • <a href="https://yourdomain.com" style="color: #C1A170;">yourdomain.com</a>
          </p>
        </div>
      `,
        }),
    })

    return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
    })
})