import React, { useState, useEffect } from 'react';
import { ethers, BrowserProvider, Contract } from "ethers";
import './index.css'; // Certifique-se de importar seu CSS
import { contractABI } from './contractABI.js';
import WalletInfo from './components/WalletInfo.js';
import { GiFoxHead } from 'react-icons/gi'; // Ícone do MetaMask

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [candidates, setCandidates] = useState([]);

  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';  // Endereço do contrato inteligente

  // Função para conectar com a MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Solicita ao MetaMask a conexão com a carteira
        // BrowserProvider
        const provider = new BrowserProvider(window.ethereum);

        const accounts = await provider.send("eth_requestAccounts", []); // Solicita ao usuário para conectar a carteira
        console.log(accounts);

        setCurrentAccount(accounts[0]);
        console.log('Conectado à conta:', accounts[0]);
      } catch (error) {
        console.error("Erro ao conectar com MetaMask:", error);
      }
    } else {
      alert('MetaMask não está instalada!');
    }
  };

  // Função para interagir com o contrato e buscar os candidatos
  const getCandidates = async () => {
    if (window.ethereum && currentAccount) {
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

        setCandidates([{name: candidate1, image: image1, amount: total1}, {name: candidate2, image: image2, amount: total2}]);
      } catch (error) {
        console.error('Erro ao interagir com o contrato:', error);
      }
    }
  };

  // Monitora mudanças na conta conectada no MetaMask
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setCurrentAccount(accounts[0]);
        console.log('Conta mudou para:', accounts[0]);
      });
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="container mx-auto mt-4 mb-4">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold">
              Bet Dapp
            </h1>
            <div>
            <p>Projeto de estudos para apostas utilizando smart contracts.</p>
            </div>
          </div>
        </div>
        {currentAccount ? (
          <div>
            <WalletInfo address={currentAccount} balance={0} />
            <button className="btn btn-primary" onClick={getCandidates}>Listar Candidatos</button>
            
            <div className="container mx-auto">
              <div className="flex justify-center space-x-4">
              {candidates.map((candidate, index) => (
                <div className="card w-80 bg-base-100 shadow-xl">
                <figure>
                  <img
                    src={candidate.image}
                    alt={candidate.name}
                    className="w-full"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{ candidate.name }</h2>
                  <p>{ candidate.amount || '0' } ETH</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Apostar</button>
                  </div>
                </div>
              </div>
              ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <button className="btn btn-primary text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg hover:from-purple-600 hover:to-indigo-500" onClick={connectWallet}>
              <GiFoxHead className="text-2xl" />
              Conectar com MetaMask
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
