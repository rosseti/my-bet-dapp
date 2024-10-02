// src/App.js
import React from 'react';

function WalletInfo({ address, balance }) {
  return (
    <div className="flex">
      <div className="card w-200 bg-base-100">
        <div className="card-body">
          <h2 className="card-title">Carteira Conectada</h2>

          <div className="flex items-center space-x-2">
            <span className="badge badge-primary">Endereço</span>
            <span className="truncatea">{address}</span>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <span className="badge badge-secondary">Saldo</span>
            <span>{balance} ETH</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletInfo;
