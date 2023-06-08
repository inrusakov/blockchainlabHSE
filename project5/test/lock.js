const { expect } = require("chai");
const { BN, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
const contract = require("@truffle/contract");
const { BigNumber } = require("@ethersproject/bignumber");
const { keccak256 } = require('web3-utils');
const { ethers } = require("hardhat");

describe("Lock", function() {
  
  const Rock = 1;
  const Paper =2;
  const Scissors = 3;
  
  const betAmount = new BigNumber.from("1000000000000000000"); // 1 ether
  
  function getMoveHash(move, secret) {
    return ethers.utils.solidityKeccak256(["uint8", "uint256"], [move, secret]);
  }

  const moveHash1 = getMoveHash(Rock, 123);
  const moveHash2 = getMoveHash(Paper, 456);

  
  before(async () => {
    const signers = await ethers.getSigners();
    player1 = signers[0];
    player2 = signers[1];

    contractFactory = await ethers.getContractFactory("Lock");
    this.lock = await contractFactory.deploy();
  });

  //------------------------------ Integrational ------------------------------

  it("should correctly play a game between two players", async () => {
    await this.lock.connect(player1).join(moveHash1, { value: betAmount });
    await this.lock.connect(player2).join(moveHash2, { value: betAmount });

    const tx1 = await this.lock.connect(player1).reveal(Rock, 123);
    await tx1.wait().then(result => {
      expectEvent(result, "PlayerRevealed", { player: player1.address, move: Rock });
    }).catch(error => {
      console.error(error);
    });

    const tx2 =  await this.lock.connect(player2).reveal(Paper, 456);
    await tx2.wait().then(result => {
      expectEvent(result, "PlayerRevealed", { player: player2.address, move: Paper });
      expectEvent(result, "GameFinished", { winner: player2.address });
    }).catch(error => {
      console.error(error);
    });
  });

  it("should handle a draw correctly", async () => {
    const moveHash3 = web3.utils.soliditySha3(Move.Scissors, 789);
  
    await this.lock.join(moveHash1, { from: player1, value: betAmount });
    await this.lock.join(moveHash3, { from: player2, value: betAmount });
  
    const initialBalance1 = await web3.eth.getBalance(player1);
    const initialBalance2 = await web3.eth.getBalance(player2);
  
    await this.lock.reveal(Move.Rock, 123, { from: player1 });
    await this.lock.reveal(Move.Scissors, 789, { from: player2 });
  
    const receipt = await this.lock.finishGame({ from: player1 });
    expectEvent(receipt, "GameFinished", { winner: player1 });
  
    const finalBalance1 = await web3.eth.getBalance(player1);
    const finalBalance2 = await web3.eth.getBalance(player2);
  
    expect(new BN(finalBalance1)).to.be.bignumber.gt(new BN(initialBalance1));
    expect(new BN(finalBalance2)).to.be.bignumber.lt(new BN(initialBalance2));
  });

  //------------------------------ Unit ------------------------------

  it("should allow players to join", async () => {
    const receipt = await this.lock.join(moveHash1, { from: player1, value: betAmount });
    expectEvent(receipt, "PlayerJoined", { player: player1 });

    const receipt2 = await this.lock.join(moveHash2, { from: player2, value: betAmount });
    expectEvent(receipt2, "PlayerJoined", { player: player2 });
  });

  it("should not allow non-players to reveal", async () => {
    await this.lock.join(moveHash1, { from: player1, value: betAmount });
    await this.lock.join(moveHash2, { from: player2, value: betAmount });

    await expectRevert(
      this.lock.reveal(Move.Rock, 123, { from: nonPlayer }),
      "Not a player"
    );
  });

  it("should not allow joining with an invalid bet amount", async () => {
    await this.lock.join(moveHash1, { from: player1, value: betAmount });
  
    await expectRevert(
      this.lock.join(moveHash2, { from: player2, value: betAmount.add(new BN("1")) }),
      "Invalid bet amount"
    );
  });
  
  it("should not allow revealing an invalid move", async () => {
    await this.lock.join(moveHash1, { from: player1, value: betAmount });
    await this.lock.join(moveHash2, { from: player2, value: betAmount });
  
    await expectRevert(
      this.lock.reveal(Move.None, 123, { from: player1 }),
      "Invalid move"
    );
  });
  
  it("should not allow revealing with an invalid secret", async () => {
    await this.lock.join(moveHash1, { from: player1, value: betAmount });
    await this.lock.join(moveHash2, { from: player2, value: betAmount });
  
    await expectRevert(
      this.lock.reveal(Move.Rock, 999, { from: player1 }),
      "Invalid move or secret"
    );
  });

  // Add more integration tests for different scenarios
});
