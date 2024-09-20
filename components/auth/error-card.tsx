import React from 'react'
import { Header } from '@/components/auth/Header'
import { BackButton } from '@/components/auth/BackButton'
import {Card, CardFooter, CardHeader} from "@/components/ui/card"

export const ErrorCard = () => {
    return(
        <Card className='w-[600px] shadow-md'>
        <CardHeader>
            <Header label="Oops! Something went wrong!" />
        </CardHeader>
        <CardFooter>
            <BackButton 
            label="Back to Login"
            href="/login"
            />
        </CardFooter>

    </Card>
    )
   
}

