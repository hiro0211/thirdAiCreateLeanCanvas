import Stripe from "stripe";
import { NextRequest } from "next/server";
import {
  STRIPE_CURRENCY,
  DONATION_PRODUCT,
  buildRedirectUrls,
} from "@/lib/config/stripe-config";

// Why: Stripe クライアント生成を関数に分離し、将来の拡張（別キー/リージョンなど）に対応
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (secretKey.startsWith("pk_")) {
    // 明示的にわかりやすいエラーを出す（公開鍵が設定されている）
    throw new Error(
      "STRIPE_SECRET_KEY is a publishable key. Please set sk_... secret key"
    );
  }
  return new Stripe(secretKey, {
    apiVersion: "2024-06-20",
  });
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const amount = Number(body?.amount);

    // Guard: 金額の基本バリデーション（詳細はフロントでも実施）
    if (!Number.isFinite(amount) || amount <= 0) {
      return new Response(JSON.stringify({ error: "Invalid amount" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stripe = getStripe();

    const origin = req.headers.get("origin") || req.nextUrl.origin;
    const redirect = buildRedirectUrls(origin);

    // Why: Checkout を使うことでカード情報は Stripe 側で安全に入力され、当アプリは PCI DSS 範囲外に保つ
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      submit_type: "donate",
      allow_promotion_codes: false,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: STRIPE_CURRENCY,
            unit_amount: amount, // jpy はゼロ小数通貨なので 1000 = 1000円
            product_data: {
              name: DONATION_PRODUCT.name,
              description: DONATION_PRODUCT.description,
            },
          },
        },
      ],
      success_url: redirect.success,
      cancel_url: redirect.cancel,
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    // Why: API からは詳細を漏らさず、クライアントには一般化したメッセージを返す
    console.error("Stripe session creation failed:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create checkout session" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
