"use server";

import * as z from "zod";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user?.id) {
    return { error: "Unauthorized!" };
  }

  // confirm they actually exist on db and not a left over session
  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized!" };
  }

  // this are velued handled by their providers
  if(user.isOauth) {
    values.email = undefined;
    values.password= undefined
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  // send a new verification token if user updates their email

  if(values.email && values.email !== user.email) {
    // send a verification token to the user by email
    const existinUser = await getUserByEmail(values.email);
    // check if there is an existing user and they don't match the id
    if(existinUser && existinUser.id !== user.id) {
      return {error: "Email already in use!"}
    }

    // create a new token for them to verify

    const verificationToken = await generateVerificationToken(values.email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return {success: "Verification email sent!"}
  }

  if(values.password && values.newPassword && dbUser.password){
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );

    if(!passwordMatch) {
      return{error:"Incorrect password!"}
    }

    const hashedPassword = await bcrypt.hash(
      values.newPassword,
      10,
    );

    values.password = hashedPassword;
    values.newPassword = undefined;

  }

  await db.user.update({
    where:{id: dbUser.id},
    data: {
        ...values,
    }
  })

  return{success:"Settings Updated!"}
};
