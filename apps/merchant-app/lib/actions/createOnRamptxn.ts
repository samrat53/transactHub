"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export const createOnRampTransaction=async(amount:number,provider:string)=>{
    const session=await getServerSession(authOptions);
    const token=Math.random().toString();
    // const token=await axios.get("https://api.hdfc.com/user/genToken",{
    //     amount:amount,
    // })
    const userId=session.user.id;
    if(!userId){
        return {
            message: "You are not logged in"
        }
    }
    await prisma.onRampTransaction.create({
        data:{
            userId: Number(userId),
            amount: amount,
            status: "Processing",
            startTime: new Date(),
            provider: provider,
            token: token
        }
    })
}