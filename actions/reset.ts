"use server"

import * as z from "zod";

import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";

export const reset = async(values: z.infer<typeof ResetSchema>) => {

// validate fields
    const validatefields = ResetSchema.safeParse(values);

    if (!validatefields.success) {
        return {error: "Invalid email!"}
    }

    const {email} = validatefields.data;

    // get existing user
    const existingUser = await getUserByEmail(email);

    if(!existingUser) {
        return{error:"Email Not Found!"}
    }

    // TODO:Generate token and send email

    const newPasswordResetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(
        newPasswordResetToken.email,
        newPasswordResetToken.token,
    )

    return{success: "Reset Email Sent!"}

    
}
