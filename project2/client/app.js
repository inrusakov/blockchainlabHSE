const Web3 = require('web3');
const abi = require('../artifacts/contracts/Lock.sol/Lock.json').abi;

require("dotenv").config(".env");

const endpoint = process.env.INFURA_KEY;

// Создаем экземпляр Web3 и указываем адрес ноды Sepolia через WebSockets
const web3 = new Web3("wss://sepolia.infura.io/ws/v3/"+endpoint);

// Указываем адрес контракта и его ABI
const contractAddress = '0xFEb8a2d09FB63B73d910a8eCae826505d1EF5BE5';
const contractABI = abi;

// Создаем экземпляр контракта
const contract = new web3.eth.Contract(contractABI, contractAddress);

web3.currentProvider.on('connect', () => {
  console.log('WebSocket connection established');

  // Вызываем функцию контракта
  contract.methods.balanceOf("0xb3389d620d258d1bd0Cffbd1CdD237c152218ec5").call().then(result => {
    console.log(`Balance: ${result}`);
  }).catch(error => {
    console.error(error);
  });

  // Добавляем обработчик событий
  contract.events.DataAdded({
    filter: { id: [1] },
    fromBlock: 0
  }, (error, event) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`Data added: ${JSON.stringify(event.returnValues)}`);
    }
  });

  // Добавляем структуру в отображение
  contract.methods.addData(1, 'Test', true, Date.now()).call().then(transactionReceipt => {
    console.log(`Data added: 1 Test true ${Date.now()}`);
  }).catch(error => {
    console.error(error);
  });

  // Удаляем структуру из отображения
  contract.methods.removeData(1).call().then(transactionReceipt => {
    console.log(`Data removed: 1 Test true ${Date.now()}`);
  }).catch(error => {
    console.error(error);
  });
});



web3.currentProvider.on('error', (error) => {
  console.error('WebSocket connection error:', error);
});

web3.currentProvider.on('end', () => {
  console.log('WebSocket connection closed');
});