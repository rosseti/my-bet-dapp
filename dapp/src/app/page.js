"use client";

import Image from "next/image";
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '@/context/AppContext';
import MetaMaskLogin from '@/components/MetaMaskLogin';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    const { account } = useContext(AppContext);

    useEffect(() => {
        if (account) {
          router.push('/bet');
        }
      }, [account]);

    const [message, setMessage] = useState();

    return (
        <>
            <div className="container mx-auto py-20 px-4 w-1/2">

                <div className="grid grid-cols-2 gap-4 items-center justify-center">
                    <div className="py-4">
                        <h1 className="text-4xl font-bold pb-4">
                            BetCandidate
                        </h1>

                        <p className="pb-4">Apostas on-chain nas eleições americanas</p>
                        <p className="pb-4">Autentique-se na sua carteira e deixe sua aposta para a próxima disputa</p>

                        <MetaMaskLogin />

                        <p className="text-red-500">{message}</p>
                    </div>
                    <div className="p-4">
                        <div className="w-100 h-52 overflow-hidden rounded-lg">
                            <Image src="/b3012d87-7070-4e85-bb25-549d0ccce63b.png" alt="Eleições" width={500} height={500} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
