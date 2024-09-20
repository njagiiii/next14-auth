"use server";
import * as z from "zod";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password-token";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  // validate fields

  const validatedfields = NewPasswordSchema.safeParse(values);

  if (!validatedfields.success) {
    return { error: "Invalid Fields!" };
  }

  const { password } = validatedfields.data;

  // check for existing password token(get it)
  const existingPasswordToken = await getPasswordResetTokenByToken(token);

  // return an error message if it doesn't exist
  if (!existingPasswordToken) {
    return { error: "Invalid Token!" };
  }

  // check if the existingpasswordtoken  has expired
  const hasExpired = new Date(existingPasswordToken.expires) < new Date();

  // if expired retuen an error message it has expired

  if (hasExpired) {
    return { error: "Token expired!" };
  }

  // get the existing user we are trying to reset the password for(assigning the resetpasswordtoken to the email)
  const existingUser = await getUserByEmail(existingPasswordToken.email);
  if (!existingUser) {
    return { error: " Email does not exist!" };
  }

  // hash the new password and update the user

  const hashedNewPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedNewPassword },
  });

  // delete the existing token
  await db.passwordResetToken.delete({
    where: { id: existingPasswordToken.id },
  });

  return { success: "Password Updated!" };
};
