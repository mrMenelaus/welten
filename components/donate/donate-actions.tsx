"use server";
import { donates } from "@/app/donate/page";
import { YooCheckout, ICreatePayment } from "@a2seven/yoo-checkout";
import { redirect } from "next/navigation";

const checkout = new YooCheckout({
  shopId: process.env.SHOP_ID!,
  secretKey: process.env.SHOP_SECRET!,
});

export async function donate(data: FormData) {
  const idempotenceKey = Date.now().toString();

  const id = data.get("id");
  const variant = donates.find((e) => e.id === id);

  if (!variant) return;

  const createPayload: ICreatePayment = {
    amount: {
      value: variant.cost,
      currency: "RUB",
    },
    payment_method_data: {
      type: "bank_card",
    },
    confirmation: {
      type: "redirect",
      return_url: "test",
    },
    capture: true,
    description: "Покупка доната",
    receipt: {
      customer: {
        email: "menelaus365@gmail.com",
      },
      items: [
        {
          amount: { currency: "RUB", value: variant.cost },
          description: variant.name,
          quantity: "1",
          vat_code: 1,
        },
      ],
    },
  };

  const payment = await checkout.createPayment(createPayload, idempotenceKey);
  redirect(payment.confirmation.confirmation_url!);
}
