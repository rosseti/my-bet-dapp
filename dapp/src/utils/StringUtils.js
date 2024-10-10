import Web3 from 'web3';

export const toUtf8 = (str) => {
    return Web3.utils.toUtf8(str).replace(/\0/g, '');
};
