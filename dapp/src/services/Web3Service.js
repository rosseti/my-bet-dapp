import Web3 from 'web3';
import ABI from '@/abi/ABI.json';

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

    return new web3.eth.Contract(ABI, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, { from });
}

export const getDispute = async () => {
    const contract = getContract();
    return await contract.methods.dispute().call();
}

export const getGasPrice = async () => {
    const web3 = new Web3(window.ethereum);
    return await web3.eth.getGasPrice();
}

export const placeBet = async (candidateId, amountInEther) => {
    const contract = getContract();
    const value = Web3.utils.toWei(amountInEther, 'ether');

    const gas = await contract.methods
        .bet(candidateId)
        .estimateGas({ value });

    const gasPrice = await getGasPrice();

    return await contract.methods
        .bet(candidateId)
        .send({ value, gas, gasPrice });
}

export const finishDispute = async (winner) => {
    const contract = getContract();
    const gas = await contract.methods.finish(winner).estimateGas();
    const gasPrice = await getGasPrice();

    return await contract.methods.finish(winner).send({
        gas,
        gasPrice,
    });
}

export const claimPrize = async () => {
    const contract = getContract();
    const gasPrice = await getGasPrice();
    const gas = await contract.methods.claim().estimateGas();

    return await contract.methods.claim().send({
        gas,
        gasPrice
    });
}

export const isOwner = async () => {
    const contract = getContract();
    return await contract.methods.isOwner().call();
}
