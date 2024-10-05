// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

/*
Desafios:

* não permitir apostar depois de uma data x;
* não sacar comissão no finish, mas sim em uma função separada;
* não permitir mais de uma aposta por pessoa;
* somente permitir finalizar depois de uma data x;
* estudar constant, immutable e decidir onde usar nas variáveis do contrato;
* contabilizar total de apostadores em cada candidato;
* funções administrativas para permitir trocar foto e nome dos candidatos.
*/

struct Dispute
{
    string candidate1;
    string candidate2;
    string image1;
    string image2;
    uint total1;
    uint total2;
    uint winner;
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
            candidate1: "Donald Trump",
            candidate2: "Kamala Harris",
            image1: "https://images.unsplash.com/photo-1580128660010-fd027e1e587a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9uYWxkJTIwdHJ1bXB8ZW58MHx8MHx8fDA%3D",
            image2: "https://www.whitehouse.gov/wp-content/uploads/2021/04/V20210305LJ-0043.jpg",
            total1: 0,
            total2: 0,
            winner: 0
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
        } else {
            dispute.total2 += msg.value;
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
