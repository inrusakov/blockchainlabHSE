
const main = async () => {
    const initialSupply =  ethers.utils.parseEther("0.000000000000000001");
    console.log(`Initial Suply --> ${initialSupply}`);

    const [deployer] = await ethers.getSigners();
    console.log(`Address deploying the contract --> ${deployer.address}`);

    const tokenFactory = await ethers.getContractFactory("Lock");
    const contract = await tokenFactory.deploy();

    console.log(`Token contract address --> ${contract.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });