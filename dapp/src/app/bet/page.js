"use client";

import React, { useState, useEffect, useContext } from 'react';

import VoteProgressBar from '@/components/VoteProgressBar';

import { AppContext } from '@/context/AppContext';

import { claimPrize, getDispute, placeBet, isOwner, finishDispute } from "@/services/Web3Service";

import { toUtf8 } from '@/utils/StringUtils';

import Web3 from "web3";

import { useRouter } from 'next/navigation'

export default function PageBet() {
    const { account } = useContext(AppContext);

    const { push } = useRouter();

    const [candidates, setCandidates] = useState([]);

    const [message, setMessage] = useState();
    const [winner, setWinner] = useState(0);
    const [isAdmin, setAdmin] = useState(false);
    const [totalVotes, setTotalVotes] = useState(0);

    const fetchCandidates = () => {
        setMessage("Obtendo dados da disputa");
        getDispute()
            .then((dispute) => {
                const { candidate1, candidate2, image1, image2, total1, total2, winner, votes1, votes2 } = dispute;

                setWinner(winner);
                setTotalVotes(votes1 + votes2);

                setCandidates([
                    { id: 1, name: toUtf8(candidate1), image: toUtf8(image1), amount: total1, totalVotes: votes1 },
                    { id: 2, name: toUtf8(candidate2), image: toUtf8(image2), amount: total2, totalVotes: votes2 },
                ]);
                setMessage("");
            })
            .catch((error) => {
                const message = error.data && error.data.message ? error.data.message : error.message;
                setMessage(message);
                console.error(error);
            });
    };

    useEffect(() => {
        fetchCandidates();

        if (!account) {
            push('/');
        }

        isOwner().then((isAdmin) => {
            setAdmin(isAdmin);
        });
    }, []);

    const processBetHandler = (candidate) => {
        setMessage("Conectando na carteira...");

        const amount = prompt("Quantia que deseja apostar?", "1");

        candidate.loading = true;

        placeBet(candidate.id, amount)
            .then(() => {
                alert("Aposta recebida com sucesso.");
                fetchCandidates();
                setMessage("");
            })
            .catch((error) => {
                const message = error.data && error.data.message ? error.data.message : error.message;
                setMessage(message);
                console.error(error);
            })
            .finally(() => {
                candidate.loading = false;
            });
    };

    const claimClickHandler = (candidate) => {
        setMessage("Conectando na carteira...");

        candidate.loading = true;

        claimPrize()
            .then(() => {
                alert("Prêmio coletado com sucesso. Pode demorar 1 minuto para aparecer no sistema");
                setMessage("");
            })
            .catch((error) => {
                const message = error.data && error.data.message ? error.data.message : error.message;
                setMessage(message);
                console.error(error);
            })
            .finally(() => {
                candidate.loading = false;
            });
    };

    const finishDisputeHandler = () => {
        setMessage("Conectando na carteira...");

        const winner = prompt("Quem é o ganhador? 1 ou 2", "1");

        finishDispute(winner)
            .then(() => {
                alert("Disputa encerrada. Veja o vencedor abaixo e solicite seu prémio.");
                fetchCandidates();
                setMessage("");
            })
            .catch((error) => {
                const message = error.data && error.data.message ? error.data.message : error.message;
                setMessage(message);
                console.error(error);
            })
    };

    return (
        <>
            <div className="container mx-auto pt-10 px-4 w-1/2">

                <h1 className="text-4xl font-bold pb-4">
                    Apostas on-chain
                    <span className="text-sm font-normal"> nas eleições americanas</span>
                </h1>

                {
                    winner == 0 ? (
                        <p>Você tem até o dia da eleição para deixar sua aposta</p>
                    ) : (
                        <p>Disputa encerrada. Veja o vencedor abaixo e solicite seu prêmio.</p>
                    )
                }

                {
                    message && (
                        <p className="text-red-500">{message}</p>
                    )
                }

                { /* Winner Block */}
                {
                    winner == 0 && isAdmin && (
                        <>
                            <button onClick={() => finishDisputeHandler()} className="btn btn-neutral">
                                Finalizar disputa
                            </button>
                        </>
                    )
                }

                {candidates.length > 0
                    && totalVotes > 0
                    && (<VoteProgressBar candidates={candidates} totalVotes={totalVotes} />)
                }

                <div className="grid grid-cols-2 gap-4 items-center justify-center">
                    {candidates.filter(candidate => winner == 0 || winner == candidate.id).map((candidate, index) => (

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

                                        {
                                            winner == 0 ? (
                                                <button onClick={() => processBetHandler(candidate)} className="btn btn-primary btn-block">
                                                    {candidate.loading ? <span className="loading loading-spinner loading-xs"></span> : ''}
                                                    Apostar
                                                </button>
                                            ) :
                                                <button onClick={() => claimClickHandler(candidate)} className="btn btn-primary btn-block">
                                                    {candidate.loading ? <span className="loading loading-spinner loading-xs"></span> : ''}
                                                    Resgatar prêmio
                                                </button>
                                        }


                                        <div className="ml-4 w-100 badge font-normal badge-ghost">{Web3.utils.fromWei(candidate.amount, "ether") || '0'} {process.env.NEXT_PUBLIC_TOKEN} apostado</div>
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
