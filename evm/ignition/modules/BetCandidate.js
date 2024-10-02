// ./ignition/modules/Betcandidate.js
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("BetcandidateModule", (m) => {

  const lock = m.contract("BetCandidate", [], {});

  return { lock };
});
