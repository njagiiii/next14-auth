"use server";

import* as z from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async(values: z.infer<typeof  RegisterSchema>) => {
    // validate the fields

    const validatedFields = RegisterSchema.safeParse(values)

    // if validated fields are not success throw error

    if(!validatedFields.success) {
        return{ error: "Invalid fields"}
    }

    // extract the validated fields

    const {email, name, password} = validatedFields.data;

    // hash password
     const hashpassword = await bcrypt.hash(password, 10);

    //  confirm the email is not taken from the db
    const existingUser = await getUserByEmail(email)
   

    if(existingUser) {
        return {error: "Email already in use!"}
    }

    // create the user if email doesn't exist

    await db.user.create({
        data: {
            name,
            email,
            password: hashpassword,
        }
    })

    // SEND VERIFICATION TOKEN EMAIL
    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
    )

    return {success: "Confirmation email sent!"}

}