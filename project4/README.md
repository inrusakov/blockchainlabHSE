Русаков Иван БПИ206

Address deploying the contract --> 0xb3389d620d258d1bd0Cffbd1CdD237c152218ec5

Token contract address --> 0xd29feE29518d55A1876D6B364a3b3660085e82ab

Ответы на вопросы:

1. На этапе разработки используется локальная EVM (Ethereum Virtual Machine) вместо рабочей сети по нескольким причинам:

Безопасность: Работа с локальной EVM позволяет избежать случайного взаимодействия с реальными смарт-контрактами и аккаунтами, что может привести к потере средств или другим нежелательным последствиям.
    
Скорость разработки: Локальная EVM обеспечивает быстрое взаимодействие и тестирование, поскольку она не зависит от времени блока и скорости сети.
    
Экономия средств: Использование локальной EVM позволяет избежать затрат на газ, связанные с развертыванием и взаимодействием со смарт-контрактами в рабочей сети.
    
Управление состоянием: Локальная EVM позволяет легко управлять состоянием блокчейна, что упрощает тестирование различных сценариев и отладку.


2. Для call:

(bool success, ) = targetAddress.call{value: msg.value}("");
require(success, "Call failed");

Для delegatecall:

Функция delegatecall не позволяет напрямую передавать ETH, так как он выполняет код целевого контракта в контексте вызывающего контракта, сохраняя msg.sender и msg.value неизменными. Если нужно передать ETH вместе с вызовом delegatecall, можно сначала отправить ETH на адрес контракта, а затем использовать delegatecall для вызова функции, которая будет управлять этими средствами.


# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
