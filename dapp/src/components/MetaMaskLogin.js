// src/components/MetaMaskLogin.js
"use client";

import { useContext } from 'react';
import Image from "next/image";
import { AppContext } from '@/context/AppContext';

const MetaMaskLogin = () => {
    const { account, connectMetaMask, logout } = useContext(AppContext);

    return (
        <div>
            {!account ? (
                <button onClick={connectMetaMask} className="btn btn-primary shadow-lg">
                <Image src="/metamask.svg" alt="MetaMask" width={25} height={25} />
                Conectar com Metamask
              </button>
            ) : (
                <div>
                    <p>Conectado como: {account}</p>
                    <button className="btn btn-primary shadow-lg" onClick={logout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default MetaMaskLogin;
