import crypto from "crypto"
import { getVerificationbyEmail } from "@/data/verification";
import {v4 as uuidv4} from "uuid";
import { db } from "./db";
import { getPasswordResetTokenByEmail } from "@/data/password-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

// keep alll the tokens that are going to be generated

export const generateTwoFactorTokens = async(email: string) => {
    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime()+ 5 * 60* 1000);

    //  check for existing token

    const existingToken = await getTwoFactorTokenByEmail(email);

    if(existingToken){
        await db.twoFactorToken.delete({
            where:{id: existingToken.id}
        })
    }
    // create a new one
    const twoFactorToken = await db.twoFactorToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return twoFactorToken;

}

export const generateVerificationToken = async(email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime()+ 3600 * 1000);

    // check if there is existing verification token sent to this email before generating a new one

    const existingToken = await getVerificationbyEmail(email);

    if(existingToken){
        // remove from databse
        await db.verification.delete({
            where: {
                id: existingToken.id,
            }
        })
    }

    // generate a new token

    const newVerificationToken = await db.verification.create({
        data: {
            email,
            token,
            expires,
        }
    });

    return newVerificationToken;

}

// generate passwordResetToken

export const generatePasswordResetToken = async (email : string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime()+ 3600 * 1000);


    // check if there is an existing password reset token to the users email
    const existingPasswordToken = await getPasswordResetTokenByEmail(email);

    if(existingPasswordToken) {
        // delete it if it exists
        await db.passwordResetToken.delete({
            where: { id: existingPasswordToken.id}
        });

    }

    // generate a new passwordresettoken if user doesn't have

    const newPasswordToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return newPasswordToken;
}