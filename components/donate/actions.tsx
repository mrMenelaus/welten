"use server";

import z from "zod";
import { donateSchema } from "./types";
import { ICreatePayment, YooCheckout } from "@a2seven/yoo-checkout";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const checkout = new YooCheckout({
  shopId: process.env.SHOP_ID!,
  secretKey: process.env.SHOP_SECRET!,
});

export async function donate(
  donateId: string,
  data: z.infer<typeof donateSchema>,
) {
  const parsed = donateSchema.safeParse(data);
  if (parsed.error) {
    return { success: false };
  }

  const donate = await prisma.donate.findUnique({ where: { id: donateId } });
  if (!donate) {
    return { success: false };
  }

  const createPayload: ICreatePayment = {
    amount: {
      value: donate.cost,
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
      email: "aboba@gmail.com",
      items: [
        {
          amount: { currency: "RUB", value: donate.cost },
          description: donate.name,
          quantity: "1",
          vat_code: 1,
        },
      ],
    },
  };

  const payment = await checkout.createPayment(
    createPayload,
    Date.now().toString(),
  );

  redirect(payment.confirmation.confirmation_url!);
}
