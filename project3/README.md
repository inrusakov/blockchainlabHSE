Русаков Иван БПИ206

Address deploying the contract --> 0xb3389d620d258d1bd0Cffbd1CdD237c152218ec5

Token contract address --> 0x802FDdFA45ABeC3Fb8FEb319cB8791d0Ab1E3729

Ответы на вопросы:

1. Особенность смарт-контрактов без конструктора заключается в том, что они не имеют специальной функции инициализации, которая вызывается при деплое контракта. Это может быть полезно, если контракт не требует начальной настройки или инициализации переменных.

2. Тип смарт-контракта library отличается от типа contract тем, что library предоставляет набор функций, которые можно использовать в других контрактах без необходимости создания экземпляра библиотеки. Библиотеки не имеют состояния и не могут хранить переменные, в то время как контракты могут иметь состояние и хранить переменные.

3. В EVM (Ethereum Virtual Machine) существуют три типа памяти:

    Стек: временное хранилище для операндов и результатов операций. Он имеет ограниченный размер и работает по принципу LIFO (последний пришел, первый ушел).
    
    Память (Memory): линейное хранилище, которое используется для хранения данных во время выполнения функций контракта. Память очищается после завершения выполнения функции.
    
    Хранилище (Storage): постоянное хранилище данных, которое сохраняется между вызовами функций и доступно только для чтения и записи в контракте.
    
4. ABI (Application Binary Interface) необходим для кодирования и декодирования данных, передаваемых между смарт-контрактами и внешними вызывающими. ABI определяет формат данных и способ вызова функций контракта, что позволяет клиентским приложениям и другим контрактам взаимодействовать с контрактом.
    
5. Вставки assembly в смарт-контракт используются для выполнения низкоуровневых операций, которые недоступны или неэффективны на языке Solidity. Это может быть полезно для оптимизации производительности или работы с определенными аспектами EVM, которые не могут быть обработаны стандартными средствами Solidity.
    
6. Типы msg, tx, и block предоставляют информацию о текущем контексте выполнения функции контракта:
    
    msg: содержит информацию о текущем сообщении, такую как отправитель (msg.sender), значение переданного эфира (msg.value) и данные (msg.data).
    
    tx: содержит информацию о текущей транзакции, такую как хеш транзакции (tx.origin) и газ, потраченный на выполнение транзакции (tx.gasprice).
    
    block: содержит информацию о текущем блоке, такую как номер блока (block.number), хеш блока (block.hash), и время блока (block.timestamp).

7. В смарт-контрактах нельзя получить истинно случайное значение, так как блокчейн является детерминированным. Однако можно использовать некоторые методы для генерации псевдослучайных значений, такие как комбинация block.timestamp, block.difficulty, и msg.sender. Также можно использовать оракулы (внешние источники данных), которые предоставляют случайные числа извне блокчейна, но это может вводить дополнительные риски и требовать доверия к оракулу.


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