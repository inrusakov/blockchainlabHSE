require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

require("dotenv").config(".env");

const privateKey = process.env.PRIVATE_KEY;
const endpoint = process.env.URL;
const etherscanKey = process.env.ETHERSCAN_KEY;


module.exports = {
    solidity: {
        version: "0.8.18",
    },
    networks: {
      sepolia: {
        url: endpoint,
        accounts: [privateKey]
      }
    },
    etherscan: {
        apiKey: etherscanKey
    }
}