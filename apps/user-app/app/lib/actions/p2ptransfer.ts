"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import db from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
  const session = await getServerSession(authOptions);
  const from = session.user.id;
  if (!from) {
    return { message: "You are not logged in" };
  }

  const toUser = await db.user.findFirst({
    where: {
      number: to,
    },
  });
  if (!toUser) {
    return { message: `No such number exists` };
  }

  await db.$transaction(async (tx) => {
    // locking the particular rows
    await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId"=${Number(from)} FOR UPDATE`;
    
    const fromBalance = await tx.balance.findUnique({
      where: { userId: Number(from) },
    });
    if (!fromBalance || fromBalance.amount < amount) {
      throw new Error("Garib sala");
    }

    await tx.balance.update({
      where: {
        userId: Number(from),
      },
      data: {
        amount: {
          decrement: amount,
        },
      },
    });

    await tx.balance.update({
      where: {
        userId: toUser.id,
      },
      data: {
        amount: {
          increment: amount,
        },
      },
    });
  });
}
