"use client";

import React from 'react'
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { LoginForm } from './LoginForm ';

interface LoginButtonProps {
    children: React.ReactNode;
    mode?:"modal" | "redirect"
    asChild?:boolean
}

const LoginButton = ({children, mode="redirect", asChild}: LoginButtonProps) => {
    const router = useRouter();

    const onClick =() => {
        router.push("/login");
    }

    if(mode === "modal") {
        return (
           <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className='p-0 w-auto bg-transparent border-none'>
                <LoginForm />
            </DialogContent>
           </Dialog>
        )
    }
  return (
    <span onClick={onClick} className="cursor-pointer">{children}</span>
  )
}

export default LoginButton