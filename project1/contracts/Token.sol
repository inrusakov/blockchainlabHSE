// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

contract Token {
    address private owner; // slot 0

    // Название.
    string public constant name = "MyToken";

    // Слот 1
    uint256 private totalSupply;

    // Слот 2
    bool private mintingFinished;

    // Хранилище балансов пользователей
    mapping(address => uint256) private balances;

    // Событие для уведомления о чеканке новых токенов
    event Mint(address indexed to, uint256 amount);

    // Конструктор контракта
    constructor(uint256 _totalSupply) {
        console.log("Deploying the contract!, with a totalSupply of -->", _totalSupply);

        // Устанавливаем владельца контракта
        owner = msg.sender;

        // Устанавливаем общее количество токенов
        totalSupply = _totalSupply;

        // Начальное распределение токенов на баланс владельца
        balances[owner] += totalSupply;
    }

    // Функция для перевода токенов
    function transfer(uint256 _amount, address _to) external {
        // Проверяем, достаточно ли токенов у отправителя
        require(balances[msg.sender] >= _amount, "Not enough funds");

        // Списываем токены у отправителя
        balances[msg.sender] -= _amount;

        // Зачисляем токены получателю
        balances[_to] += _amount;
    }

    // Функция для получения баланса пользователя
    function balanceOf(address _address) external view returns (uint256 result) {
        result = balances[_address];
    }

    // Функция для получения общего количества токенов
    function getTotalSupply() external view returns (uint256 _totalSupply) {
        _totalSupply = totalSupply;
    }

    // Функция для чеканки новых токенов
    function mint(address _to, uint256 _amount) external returns (bool) {
        // Проверяем, что операция чеканки не завершена
        require(!mintingFinished, "Minting has already finished");

        // Проверяем, что адрес получателя не является пустым
        require(_to != address(0), "Invalid address");

        // Проверяем, что количество токов для чеканки больше 0
        require(_amount > 0, "Invalid amount");

        // Увеличиваем баланс получателя на количество чекнутых токенов
        balances[_to] += _amount;

        // Увеличиваем общее количество токенов
        totalSupply += _amount;

        // Вызываем событие для уведомления о чеканке новых токенов
        emit Mint(_to, _amount);

        return true;
    }

    // Функция для завершения операции чеканки токенов
    function finishMinting() external returns (bool) {
        // Проверяем, что вызывающий адрес является владельцем контракта
        require(msg.sender == owner, "Only the owner can finish minting");

        // Проверяем, что операция чеканки не завершена
        require(!mintingFinished, "Minting has already finished");

        // Устанавливаем значение mintingFinished в true
        mintingFinished = true;

        return true;
    }
}