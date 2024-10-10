// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

struct Dispute
{
    bytes32 candidate1;
    bytes32 candidate2;
    bytes32 image1;
    bytes32 image2;
    uint total1;
    uint total2;
    uint winner;
    uint votes1;
    uint votes2;
}

struct Bet
{
    uint amount;
    uint candidate;
    uint timestamp;
    uint claimed;
}

contract BetCandidate {

    Dispute public dispute;
    mapping(address => Bet) public allBets;

    address owner;
    uint fee = 1000; // 10%
    uint public netPrize;

    constructor()
    {
        owner = msg.sender;
        dispute = Dispute({
            candidate1: "D. Trump",
            candidate2: "K. Harris",
            image1: "https://bit.ly/3Bz5vRE",
            image2: "https://bit.ly/3NiPUbz",
            total1: 0,
            total2: 0,
            winner: 0,
            votes1: 0,
            votes2: 0
        });
    }

    // Pode ser chamada fora do contrato e espera algo pra pagamento
    function bet(uint candidate) external payable {
        require(candidate == 1 || candidate == 2, "Invalid candidate");
        require(msg.value > 0, "Invalid bet");
        require(dispute.winner == 0, "Dispute closed");

        Bet memory newBet;

        newBet.amount = msg.value;
        newBet.candidate = candidate;
        newBet.timestamp = block.timestamp;
        newBet.claimed = 0;

        allBets[msg.sender] = newBet;

        if (candidate == 1) {
            dispute.total1 += msg.value;
            dispute.votes1 += 1;
        } else {
            dispute.total2 += msg.value;
            dispute.votes2 += 1;
        }
    }

    function finish(uint winner) external onlyOwner {
        require(winner == 1 || winner == 2, "Invalid candidate");
        require(dispute.winner == 0, "Dispute closed");

        dispute.winner = winner;

        uint grozzPrize = dispute.total1 + dispute.total2;
        uint comission = (grozzPrize * fee) / 1e4;

        netPrize = grozzPrize - comission;

        payable(owner).transfer(comission);
    }

    function claim() external {
        Bet memory userBet = allBets[msg.sender];
        require(dispute.winner > 0 && dispute.winner == userBet.candidate && userBet.claimed == 0, "Invalid claim");

        uint winnerAmount = dispute.winner == 1 ? dispute.total1 : dispute.total2;
        uint ratio = (userBet.amount * 1e4) / winnerAmount;
        uint individualPrize = netPrize * ratio / 1e4;

        allBets[msg.sender].claimed = individualPrize;
        payable(msg.sender).transfer(individualPrize);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function isOwner() external view returns (bool) {
        return (msg.sender == owner);
    }
}
