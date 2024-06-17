import express from "express";
import db from "@repo/db/client";

const app = express();
app.post("/hdfsWebHook", async (req, res) => {
  const paymentInformation = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };

  // updating the user balance in the app
  try {
    await db.$transaction([
      db.balance.updateMany({
        where: {
          userId: Number(paymentInformation.userId),
        },
        data: {
          amount: {
            increment: Number(paymentInformation.amount),
          },
        },
      }),
      db.onRampTransaction.updateMany({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);

    res.status(200).json({
      message: "captured",
    });
  } catch (error) {
    console.log(error);
    res.status(411).json({
      message: "Error whike processing webhook",
    });
  }
});

app.listen(3000);