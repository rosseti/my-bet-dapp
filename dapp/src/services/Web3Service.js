import Web3 from 'web3';
import ABI from '@/abi/ABI.json';

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const doLogin = async () => {
    if (!window.ethereum) throw new Error(`Metamask não está instalada`);

    const web3 = new Web3(window.ethereum);

    const accounts = await web3.eth.requestAccounts();

    if (!accounts || !accounts.length) throw new Error(`Metamask não foi autorizada`);

    const account = accounts[0];

    localStorage.setItem('wallet', account);

    return account;
}
export const getContract = () => {
    if (!window.ethereum) throw new Error(`Metamask não está instalada`);

    const from = localStorage.getItem('wallet');

    const web3 = new Web3(window.ethereum);

    return new web3.eth.Contract(ABI, CONTRACT_ADDRESS, { from });
}

export const getDispute = async () => {
    const contract = getContract();
    return contract.methods.dispute().call();
}

export const placeBet = async (candidate, amountInEth) => {
    const contract = getContract();
    return contract.methods.bet(candidate, amountInEth).send({
        value: Web3.utils.toWei(amountInEth, 'ether'),
        // gas: 116055,
        // gasPrice: "29100000015"
    });
}

export const finishDispute = async (winner) => {
    const contract = getContract();
    return contract.methods.finish(winner).send();
}

export const claimPrize = async () => {
    const contract = getContract();
    return contract.methods.claim().send();
}

export const isAdmin = async () => {
    const contract = getContract();
    return contract.methods.isOwner().call();
}
