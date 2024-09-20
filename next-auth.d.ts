import { DefaultSession }  from "next-auth";


declare module "next-auth" {

    interface Session {
        user: {
            role: string | null;
            isTwoFactorEnabled: boolean;
            isOauth: boolean;
          }& DefaultSession["user"];
    }

    interface User {
        role: string 
        isTwoFactorEnabled: boolean;
        isOauth: boolean;
    }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt"{
    interface JWT {
        role?:string | null
        isTwoFactorEnabled: boolean;
        isOauth: boolean;
    }
}