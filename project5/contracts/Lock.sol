// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Lock {
    enum Move { None, Rock, Paper, Scissors }
    enum GameState { WaitingForPlayers, WaitingForReveal, Finished }

    struct Player {
        address addr;
        bytes32 moveHash;
        Move move;
    }

    Player[2] public players;
    GameState public state = GameState.WaitingForPlayers;
    uint256 public betAmount;

    event PlayerJoined(address player);
    event PlayerCommitted(address player);
    event PlayerRevealed(address player, Move move);
    event GameFinished(address winner);

    modifier onlyInState(GameState _state) {
        require(state == _state, "Invalid game state");
        _;
    }

    modifier onlyPlayer() {
        require(msg.sender == players[0].addr || msg.sender == players[1].addr, "Not a player");
        _;
    }

    function join(bytes32 moveHash) public payable onlyInState(GameState.WaitingForPlayers) {
        require(players[0].addr == address(0) || players[1].addr == address(0), "Game is full");
        require(gasleft() >= 50000, "Not enough gas");

        if (players[0].addr == address(0)) {
            players[0] = Player(msg.sender, moveHash, Move.None);
            betAmount = msg.value;
        } else {
            require(msg.value == betAmount, "Invalid bet amount");
            players[1] = Player(msg.sender, moveHash, Move.None);
            state = GameState.WaitingForReveal;
        }

        emit PlayerJoined(msg.sender);
    }

    function reveal(Move move, uint256 secret) public onlyPlayer onlyInState(GameState.WaitingForReveal) {
        require(move != Move.None, "Invalid move");
        Player storage player = getPlayer();
        require(player.move == Move.None, "Move already revealed");
        require(keccak256(abi.encodePacked(move, secret)) == player.moveHash, "Invalid move or secret {}");
        require(msg.sender == player.addr, "Not a player");

        player.move = move;
        emit PlayerRevealed(msg.sender, move);

        if (players[0].move != Move.None && players[1].move != Move.None) {
            finishGame();
        }
    }


    function finishGame() private {
        require(state == GameState.WaitingForReveal, "Invalid game state");
        address winner = address(0);
        if (players[0].move != players[1].move) {
            if ((uint256(players[0].move) + 1) % 3 == uint256(players[1].move)) {
                winner = players[1].addr;
            } else {
                winner = players[0].addr;
            }
            payable(winner).transfer(betAmount * 2);
        } else {
            payable(players[0].addr).transfer(betAmount);
            payable(players[1].addr).transfer(betAmount);
        }

        emit GameFinished(winner);

        delete players[0];
        delete players[1];
        state = GameState.WaitingForPlayers;
    }

    function getPlayer() private view returns (Player storage) {
        if (msg.sender == players[0].addr) {
            return players[0];
        } else {
            return players[1];
        }
    }
}