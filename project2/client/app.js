const Web3 = require('web3');
const abi = require('../artifacts/contracts/Lock.sol/Lock.json').abi;

// Создаем экземпляр Web3 и указываем адрес ноды Sepolia через WebSockets
const web3 = new Web3('wss://sepolia.network');

// Указываем адрес контракта и его ABI
const contractAddress = '0x990bD26aa319eF2A279000102ff40c7F9dA5ba30';
const contractABI = abi;

// Создаем экземпляр контракта
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Вызываем функцию контракта
contract.methods.balanceOf('0x990bD26aa319eF2A279000102ff40c7F9dA5ba30').call((error, result) => {
  if (error) {
    console.error(error);
  } else {
    console.log(`Balance: ${result}`);
  }
});

// Добавляем обработчик событий
contract.events.DataAdded({
  filter: { id: 1 },
  fromBlock: 0
}, (error, event) => {
  if (error) {
    console.error(error);
  } {
    console.log(`Data added: ${JSON.stringify(event.returnValues)}`);
  }
});

// Добавляем структуру в отображение
contract.methods.addData(1, 'Test', true, Date.now()).send({ from: '0x990bD26aa319eF2A279000102ff40c7F9dA5ba30' }, (error, transactionHash) => {
  if (error) {
    console.error(error);
  } else {
    console.log(`Transaction hash: ${transactionHash}`);
  }
});

// Удаляем структуру из отображения
contract.methods.removeData(1).send({ from: '0x990bD26aa319eF2A279000102ff40c7F9dA5ba30' }, (error, transactionHash) => {
  if (error) {
    console.error(error);
  } else {
    console.log(`Transaction hash: ${transactionHash}`);
  }
});