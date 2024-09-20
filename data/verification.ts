import { db } from "@/lib/db";

// get the token by email
export const getVerificationbyEmail = async(email: string) => {
    try{
        const verificationToken = await db.verification.findFirst({
            where: {email}
        });

        return verificationToken;

    }catch{
        return null;
    }

}

export const getVerificationbyToken = async(token: string) => {
    try{
        const verificationToken = await db.verification.findUnique({
            where: {token}
        });

        return verificationToken;

    }catch{
        return null;
    }

}