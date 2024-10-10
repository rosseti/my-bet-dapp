"use client";

import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '@/context/AppContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation'

const Header = () => {
    const { account, logout } = useContext(AppContext);
    const pathname = usePathname();

    const isActive = (name) => pathname === name;

    return (
        <header className="navbar bg-base-100 shadow-md">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </label>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                    >
                        <li>
                            <Link className={isActive('/') || isActive('') ? 'active' : ''} href="/">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link className={isActive('/bet') ? 'active' : ''} href="/bet">
                                Apostar
                            </Link>
                        </li>
                        <li>
                            <Link href="https://metamask.io/" target="_blank">
                                Obter a Metamask
                            </Link>
                        </li>
                    </ul>
                </div>
                <a className="btn btn-ghost normal-case text-xl">
                    BetCandidate
                    <span className="badge bg-purple-100 text-purple-800 text-xs font-medium">beta</span>
                </a>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <Link className={isActive('/') || isActive('') ? 'active' : ''} href="/">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link className={isActive('/bet') ? 'active' : ''} href="/bet">
                            Apostar
                        </Link>
                    </li>
                    <li>
                        <Link href="https://metamask.io/" target="_blank">
                            Obter a Metamask
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="navbar-end">
                {account ? (
                    <button className="btn btn-primary btn-neutral shadow-lg" onClick={() => logout()}>Sair</button>
                ) : ''}
            </div>
        </header>
    );
};

export default Header;
