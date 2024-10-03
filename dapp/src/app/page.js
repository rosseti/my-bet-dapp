"use client";

import Image from "next/image";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { BrowserProvider } from "ethers";

import { useAuth } from './context/AuthContext';

export default function Home() {
  const { push } = useRouter();
  const { login } = useAuth();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);

        login(accounts[0]);

        console.log('Conectado à conta:', accounts[0]);
        push('/bet');
      } catch (error) {
        console.error("Erro ao conectar com MetaMask:", error);
      }
    } else {
      alert('MetaMask não está instalada!');
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        login(accounts[0]);
        console.log('Conta mudou para:', accounts[0]);
      });
    }
  }, []);

  return (
    <>
      <div className="container mx-auto py-20 px-4 w-1/2">

        <div className="grid grid-cols-2 gap-4 items-center justify-center">
          <div className="py-4">
            <h1 className="text-4xl font-bold pb-4">
              BetCandidate <span className="badge bg-yellow-100 text-yellow-800 text-xs font-medium">beta</span>
            </h1>

            <p className="pb-4">Apostas on-chain nas eleições americanas</p>
            <p className="pb-4">Autentique-se na sua carteira e deixe sua aposta para a próxima disputa</p>

            <button onClick={connectWallet} className="btn btn-primary shadow-lg">
              <Image src="/metamask.svg" alt="MetaMask" width={25} height={25} />
              Conectar com Metamask
            </button>
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
