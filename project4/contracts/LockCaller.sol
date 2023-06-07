// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Интерфейс контракта Lock для взаимодействия
interface ILock {
    enum Move { None, Rock, Paper, Scissors }
    function join(bytes32 moveHash) external payable;
    function reveal(Move move, uint256 secret) external;
}

contract LockCaller {
    ILock private lockInstance;

    constructor(address lockAddress) {
        lockInstance = ILock(lockAddress);
    }

    // Функция для вызова метода join контракта Lock
    function callJoin(bytes32 moveHash) external payable {
        lockInstance.join{value: msg.value}(moveHash);
    }

    // Функция для вызова метода reveal контракта Lock
    function callReveal(ILock.Move move, uint256 secret) external {
        lockInstance.reveal(move, secret);
    }
}
