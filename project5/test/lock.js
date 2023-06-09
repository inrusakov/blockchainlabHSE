const { assert } = require("chai");
const { BigNumber } = require("@ethersproject/bignumber");
const { ethers } = require("hardhat");

describe("Lock", function() {
  const None = 0;
  const Rock = 1;
  const Paper =2;
  const Scissors = 3;
  
  const betAmount = new BigNumber.from("10000000000000000000"); // 10 ether
  function getMoveHash(move, secret) {
    return ethers.utils.solidityKeccak256(["uint8", "uint256"], [move, secret]);
  }

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    player1 = signers[0];
    player2 = signers[1];
    nonPlayer = signers[2];

    contractFactory = await ethers.getContractFactory("Lock");
    this.lock = await contractFactory.deploy();
  });

  //------------------------------ Unit ------------------------------

  it("should allow players to join", async () => {
    const moveHash1 = getMoveHash(Rock, 123);
    const moveHash2 = getMoveHash(Rock, 456);

    const tx1 = await this.lock.connect(player1).join(moveHash1, { value: betAmount });
    await tx1.wait().then(result => {
      assert.ok(result.events.find(event => event.event === 'PlayerJoined'), 'Object does not have "PlayerJoined" event');
    }).catch(error => {
      console.error(error);
    });

    const tx2 = await this.lock.connect(player2).join(moveHash2, { value: betAmount });
    await tx2.wait().then(result => {
      assert.ok(result.events.find(event => event.event === 'PlayerJoined'), 'Object does not have "PlayerJoined" event');
    }).catch(error => {
      console.error(error);
    });
  });

  it("should not allow non-players to reveal", async () => {
    const moveHash1 = getMoveHash(Rock, 123);
    const moveHash2 = getMoveHash(Rock, 456);

    await this.lock.connect(player1).join(moveHash1, { value: betAmount });
    await this.lock.connect(player2).join(moveHash2, { value: betAmount });

    try{
      await this.lock.connect(nonPlayer).reveal(Rock, 456)
      assert.equal(true,false)
    } catch {
      assert.equal(true,true)
    }
  });

  it("should not allow joining with an invalid bet amount", async () => {
    const moveHash1 = getMoveHash(Rock, 123);
    const moveHash2 = getMoveHash(Rock, 456);

    await this.lock.connect(player1).join(moveHash1, { value: betAmount });

    try{
      await this.lock.connect(player2).join(moveHash2, { value: betAmount+1 });
      assert.equal(true,false)
    } catch {
      assert.equal(true,true)
    }
  });
  
  it("should not allow revealing an invalid move", async () => {
    const moveHash1 = getMoveHash(Rock, 123);
    const moveHash2 = getMoveHash(Rock, 456);

    await this.lock.connect(player1).join(moveHash1, { value: betAmount });
    await this.lock.connect(player2).join(moveHash2, { value: betAmount });

    try{
      await this.lock.connect(player1).reveal(None, 123)
      assert.equal(true,false)
    } catch {
      assert.equal(true,true)
    }

    try{
      await this.lock.connect(player1).reveal(Rock, 123)
      assert.equal(true,true)
    } catch {
      assert.equal(true,false)
    }
  });
  
  it("should not allow revealing with an invalid secret", async () => {
    const moveHash1 = getMoveHash(Rock, 123);
    const moveHash2 = getMoveHash(Rock, 456);

    await this.lock.connect(player1).join(moveHash1, { value: betAmount });
    await this.lock.connect(player2).join(moveHash2, { value: betAmount });

    try{
      await this.lock.connect(player1).reveal(Rock, 321)
      assert.equal(true,false)
    } catch {
      assert.equal(true,true)
    }

    try{
      await this.lock.connect(player1).reveal(Rock, 123)
      assert.equal(true,true)
    } catch {
      assert.equal(true,false)
    }
  });

  //------------------------------ Integrational ------------------------------

  it("should correctly play a game between two players with rock and paper", async () => {
    const moveHash1 = getMoveHash(Rock, 123);
    const moveHash2 = getMoveHash(Paper, 456);

    const initialBalance1 = await player1.provider.getBalance(player1.address);
    const initialBalance2 = await player2.provider.getBalance(player2.address);

    await this.lock.connect(player1).join(moveHash1, { value: betAmount });
    await this.lock.connect(player2).join(moveHash2, { value: betAmount });

    const tx1 = await this.lock.connect(player1).reveal(Rock, 123);
    await tx1.wait().then(result => {
      assert.ok(result.events.find(event => event.event === 'PlayerRevealed'), 'Object does not have "PlayerRevealed" event');
    }).catch(error => {
      console.error(error);
    });

    const tx2 = await this.lock.connect(player2).reveal(Paper, 456);
    await tx2.wait().then(result => {
      assert.ok(result.events.find(event => event.event === 'PlayerRevealed'), 'Object does not have "PlayerRevealed" event');
      assert.ok(result.events.find(event => event.event === 'GameFinished'), 'Object does not have "GameFinished" event');
      assert.ok(result.events.find(event => event.args.winner === player2.address), 'Incorrect winner');
    }).catch(error => {
      console.error(error);
    });
    
    const finalBalance1 = await player1.provider.getBalance(player1.address);
    const finalBalance2 = await player2.provider.getBalance(player2.address);

    assert.notEqual(parseInt(ethers.utils.formatEther(initialBalance1)), parseInt(ethers.utils.formatEther(finalBalance1)))
    assert.notEqual(parseInt(ethers.utils.formatEther(initialBalance2)), parseInt(ethers.utils.formatEther(finalBalance2)))
  });

  it("should correctly play a game between two players with rock and scissors", async () => {
    const moveHash1 = getMoveHash(Rock, 123);
    const moveHash2 = getMoveHash(Scissors, 456);

    const initialBalance1 = await player1.provider.getBalance(player1.address);
    const initialBalance2 = await player2.provider.getBalance(player2.address);

    await this.lock.connect(player1).join(moveHash1, { value: betAmount });
    await this.lock.connect(player2).join(moveHash2, { value: betAmount });

    const tx1 = await this.lock.connect(player1).reveal(Rock, 123);
    await tx1.wait().then(result => {
      assert.ok(result.events.find(event => event.event === 'PlayerRevealed'), 'Object does not have "PlayerRevealed" event');
    }).catch(error => {
      console.error(error);
    });

    const tx2 = await this.lock.connect(player2).reveal(Scissors, 456);
    await tx2.wait().then(result => {
      assert.ok(result.events.find(event => event.event === 'PlayerRevealed'), 'Object does not have "PlayerRevealed" event');
      assert.ok(result.events.find(event => event.event === 'GameFinished'), 'Object does not have "GameFinished" event');
      assert.ok(result.events.find(event => event.args.winner === player1.address), 'Incorrect winner');
    }).catch(error => {
      console.error(error);
    });
    
    const finalBalance1 = await player1.provider.getBalance(player1.address);
    const finalBalance2 = await player2.provider.getBalance(player2.address);

    assert.notEqual(parseInt(ethers.utils.formatEther(initialBalance1)), parseInt(ethers.utils.formatEther(finalBalance1)))
    assert.notEqual(parseInt(ethers.utils.formatEther(initialBalance2)), parseInt(ethers.utils.formatEther(finalBalance2)))
  });

  it("should handle a draw correctly", async () => {
    const moveHash1 = getMoveHash(Rock, 123);
    const moveHash2 = getMoveHash(Rock, 456);

    const initialBalance1 = await player1.provider.getBalance(player1.address);
    const initialBalance2 = await player2.provider.getBalance(player2.address);
  
    await this.lock.connect(player1).join(moveHash1, { value: betAmount });
    await this.lock.connect(player2).join(moveHash2, { value: betAmount });
  
    await this.lock.connect(player1).reveal(Rock, 123);

    const tx2 =  await this.lock.connect(player2).reveal(Rock, 456);
    await tx2.wait().then(result => {
      assert.ok(result.events.find(event => event.event === 'PlayerRevealed'), 'Object does not have "PlayerRevealed" event');
      assert.ok(result.events.find(event => event.event === 'GameFinished'), 'Object does not have "GameFinished" event');
    }).catch(error => {
      console.error(error);
    }); 
  
    const finalBalance1 = await player1.provider.getBalance(player1.address);
    const finalBalance2 = await player2.provider.getBalance(player2.address);

    assert.equal(parseInt(ethers.utils.formatEther(initialBalance1)), parseInt(ethers.utils.formatEther(finalBalance1)))
    assert.equal(parseInt(ethers.utils.formatEther(initialBalance2)), parseInt(ethers.utils.formatEther(finalBalance2)))
  });
});
