require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
        throwOnTransactionFailures: true,
        throwOnCallFailures: true,
        loggingEnabled: true // Garante que logs completos de erros sejam exibidos
    }
  },
  solidity: "0.8.27",
};
