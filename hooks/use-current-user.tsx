// get the current session of the user

import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
    const session = useSession();

    return session.data?.user;

};