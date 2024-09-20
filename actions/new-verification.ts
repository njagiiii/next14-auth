"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationbyToken } from "@/data/verification";

export const newVerification = async(token : string) => {
    // get the existing token

    const existingToken = await getVerificationbyToken(token)

    // check if there is no existing tokem
    if(!existingToken) {
        return {error: "Token does not exist!"}
    }

    // check if token has expired

    const hasExpired = new Date(existingToken.expires) < new Date();

    if(hasExpired){
        return {error: "Token has expired"}
    }

    // get the user we have to validate by the tokens
    const existingUser = await getUserByEmail(existingToken.email);

    // if there is no existing user by that token maybe they have changed the email
    if(!existingUser){
        return {error: "Email does not exist!"}
    }

    // if all the test have passed update the emailverified and the email uding tokens

    await db.user.update({
        where: {id: existingUser.id},
        data: {
            emailVerified: new Date(),
            email: existingToken.email // when user modifys or changes their email.
        }
    });

    //  delete verification token
    await db.verification.delete({
        where: {id: existingToken.id}
    });

    return {success: "Email Verified!"};

}