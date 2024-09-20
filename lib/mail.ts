import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;


export const sendVerificationEmail = async(email:string, token:string) => {
    // generate the confirmation link
    const confirmationLink = `${domain}/new-verification?token=${token}`;

    // send the email

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to:email,
        subject:"Confirm your email",
        html: `<p>Click <a href="${confirmationLink}"> here </a> to confirm email.</p>`
    })

}

export const sendPasswordResetEmail = async(email:string, token:string) => {
    // generate the confirmation link
    const resetLink = `${domain}/new-password?token=${token}`;

    // send the email

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject:"Reset your password",
        html: `<p>Click <a href="${resetLink}"> here </a> to reset password.</p>`
    })

}

export const sendTwoFactorTokenByEmail= async(email: string, token:string) => {
    // send a six digit code
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject:"2FA Code",
        html: `<p>Your 2FA code: ${token}</p>`
    })

}