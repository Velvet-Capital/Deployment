import { ethers, run } from "hardhat";
import { inputData, rewardTokens, ChainLinkAggregator, LpAggregator, allTokensPart1,allTokensPart2, permittedTokens } from "./deploymentInputs";
import deployedAddress from "../deploymentData.json";

async function initExternalSwapHandlers(){
    console.log("------- Initializing External Swap Handlers -------")
    const ZeroExSwapHandler = await ethers.getContractFactory("ZeroExHandler");
    const zeroExHandler = ZeroExSwapHandler.attach(deployedAddress.ZeroExSwapHandler)

    const tx = await zeroExHandler.attach(zeroExHandler.address).init("0xdef1c0ded9bec7f1a1670819833240f027b25eff",deployedAddress.PriceOracle,{gasPrice: 3000000000});
    tx.wait(2);
    const tx22 = await zeroExHandler.attach(zeroExHandler.address).addOrUpdateProtocolSlippage("300",{gasPrice: 3000000000});
    tx22.wait(2);

    console.log("ZeroEx Handler initialised");

    const OneInchSwapHandler = await ethers.getContractFactory("OneInchHandler");
    const oneInchHandler = OneInchSwapHandler.attach(deployedAddress.OneInchSwapHandler)

    const tx2 = await oneInchHandler.attach(oneInchHandler.address).init("0x1111111254EEB25477B68fb85Ed929f73A960582",deployedAddress.PriceOracle,{gasPrice: 3000000000});
    tx2.wait(2);
    const tx23 = await oneInchHandler.attach(oneInchHandler.address).addOrUpdateProtocolSlippage("300",{gasPrice: 3000000000});
    tx23.wait(2);
    console.log("OneInch Handler initialised");

    const ParaswapHandler = await ethers.getContractFactory("ParaswapHandler");
    const paraswapHandler = ParaswapHandler.attach(deployedAddress.ParaswapHandler)

    const tx3 = await paraswapHandler.attach(paraswapHandler.address).init("0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57","0x216B4B4Ba9F3e719726886d34a177484278Bfcae",deployedAddress.PriceOracle,{gasPrice: 3000000000});
    tx3.wait(2);
  
    const tx24 = await paraswapHandler.attach(paraswapHandler.address).addOrUpdateProtocolSlippage("300",{gasPrice: 3000000000});
    tx24.wait(2);
    console.log("Paraswap Handler initialised");

    console.log("------- External Swap Handlers Initialised -------")
}
initExternalSwapHandlers().then(() => process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1);
});