"use client";

import Image from "next/image";
import React, { useState, useEffect } from 'react';

import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import { useAuth } from '../context/AuthContext';
import { contractABI } from '../utils/contractABI';

export default function PageBet() {
  const { user } = useAuth();

  const [candidates, setCandidates] = useState([]);
  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';  // Endereço do contrato inteligente

  const loadCandidates = async () => {
    if (window.ethereum && user) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(contractAddress, contractABI, signer);

        if (!contract) {
          console.error('Erro ao criar o contrato');
          return;
        }

        const {
          candidate1, candidate2, image1, image2, total1, total2, winner
        } = await contract.dispute();

        if (!candidate1 || !candidate2) {
          console.error('Erro ao obter a lista de candidatos');
          return;
        }

        setCandidates([{ name: candidate1, image: image1, amount: total1 }, { name: candidate2, image: image2, amount: total2 }]);

      } catch (error) {
        console.error('Erro ao interagir com o contrato:', error);
      }
    }
  };

  const bet = async (candidate) => {

    if (window.ethereum && user) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(contractAddress, contractABI, signer);


        if (!contract) {
          console.error('Erro ao criar o contrato');
          return;
        }

        console.log(candidate);
        const betAmount = parseEther("0.01");
        console.log('Executando método do contrato');

        const tx = await contract.bet(candidate, { value: betAmount });
        await tx.wait(); // Espera a transação ser confirmada
        console.log("Transaction successful:", tx);
        loadCandidates();
      } catch (error) {
        console.error("Transaction failed:", error);
      }
    }
  };

  useEffect(() => {
    loadCandidates();
    // bet(1);
    console.log('executa aqui...');
  }, []);

  return (
    <>
      <div className="container mx-auto py-20 px-4 w-1/2">

        <h1 className="text-4xl font-bold pb-4">
              BetCandidate <span className="badge bg-yellow-100 text-yellow-800 text-xs font-medium">beta</span>
              <span className="ml-4 badge font-normal badge-primary">{user}</span>
        </h1>

        <p>Apostas on-chain nas eleições americanas</p>
        <p>Você tem até o dia da eleição para deixar sua aposta</p>

        <div className="grid grid-cols-2 gap-4 items-center justify-center">
          {candidates.map((candidate, index) => (
            <div className="py-4 flex items-center justify-center" key={
              index
            }>
              <div className="card w-64 bg-base-100 shadow-xl">
                <figure>
                  <img
                    src={candidate.image}
                    alt={candidate.name}
                    className="w-full"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{candidate.name}</h2>
                  <div className="card-actions justify-center">
                    <button onClick={() => bet(index + 1)} className="btn btn-primary btn-block">Apostar</button>
                    <div className="ml-4 w-100 badge font-normal badge-ghost">{formatEther(candidate.amount) || '0'} ETH apostado</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
