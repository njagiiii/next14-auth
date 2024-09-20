"use client";

import { logout } from "@/actions/logout";

interface LogoutProps { 
    children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutProps) => {
   

    const onClick = () => {
        logout(); // Call your logout function
    };

    return (
        <span onClick={onClick} style={{ cursor: 'pointer' }}>
            {children}
        </span>
    );
};
