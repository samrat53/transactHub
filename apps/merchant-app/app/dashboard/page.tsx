"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { p2pTransfer } from "../lib/actions/p2ptransfer";

export default function () {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  return (
    <div className="w-full">
      <div className="h-[90vh]">
        <Center>
          <Card title="Send">
            <div className="min-w-72 pt-2">
              <TextInput
                placeholder={"Phone Number"}
                label="Number"
                onChange={(value) => {
                  setNumber(value);
                }}
              />
              <TextInput
                placeholder={"Amount to be sent"}
                label="Amount"
                onChange={(value) => {
                  setAmount(value);
                }}
              />
              <div className="pt-4 flex justify-center">
                <Button
                  onClick={async () => {
                    await p2pTransfer(number, Number(amount) * 100);
                  }}
                >
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </Center>
      </div>
    </div>
  );
}
