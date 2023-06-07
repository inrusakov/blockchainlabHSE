
const main = async () => {
    const initialSupply =  ethers.utils.parseEther("0.000000000000000001");
    console.log(`Initial Suply --> ${initialSupply}`);

    const [deployer] = await ethers.getSigners();
    console.log(`Address deploying the contract --> ${deployer.address}`);

    const tokenFactory = await ethers.getContractFactory("LockCaller");

    const anotherContract = '0x802FDdFA45ABeC3Fb8FEb319cB8791d0Ab1E3729'
    console.log(`Another contract address --> ${anotherContract}`);
    const contract = await tokenFactory.deploy(anotherContract);

    console.log(`Token contract address --> ${contract.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });