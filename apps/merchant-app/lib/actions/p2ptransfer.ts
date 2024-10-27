"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
  const session = await getServerSession(authOptions);
  const from = session.user.id;
  if (!from) {
    return { message: "You are not logged in" };
  }

  const toUser = await prisma.user.findFirst({
    where: {
      number: to,
    },
  });
  if (!toUser) {
    return { message: `No such number exists` };
  }

  await prisma.$transaction(async (tx) => {
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

    const it=tx.p2pTransfer.create({
      data: {
        fromUserId: Number(from),
        toUserId: toUser.id,
        amount,
        timeStamp: new Date(),
      },
    });
    console.log(it);
  });
}
