// src/context/AppContext.js

"use client";

import { createContext, useState, useEffect } from 'react';
import { doLogin } from '@/services/Web3Service';
import { useRouter } from 'next/navigation'

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const { push } = useRouter();

    useEffect(() => {
        // Checar o localStorage para persistência
        const savedAccount = localStorage.getItem('wallet');
        if (savedAccount) {
            setAccount(savedAccount);
        }

    }, []);

    const connectMetaMask = async () => {
        return await doLogin().then((account) => {
            setAccount(account);
            push('/bet');
        });
    };

    const logout = () => {
        localStorage.removeItem('wallet');
        setAccount(null);
        push('/');
    };

    return (
        <AppContext.Provider value={{ account, connectMetaMask, logout }}>
            {children}
        </AppContext.Provider>
    );
};
