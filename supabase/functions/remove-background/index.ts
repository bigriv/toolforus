import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("REMOVE_BG_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "REMOVE_BG_API_KEY is not configured" }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  let imageBase64: string;
  try {
    const body = await req.json();
    imageBase64 = body.image_base64;
    if (!imageBase64) throw new Error("image_base64 is required");
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const removeBgRes = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": apiKey,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image_base64: imageBase64, size: "auto" }),
  });

  const removeBgData = await removeBgRes.json();

  if (!removeBgRes.ok) {
    return new Response(JSON.stringify(removeBgData), {
      status: removeBgRes.status,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(removeBgData), {
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
});
