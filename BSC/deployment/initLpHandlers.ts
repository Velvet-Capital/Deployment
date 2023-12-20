import { ethers, run } from "hardhat";
import { inputData, rewardTokens, ChainLinkAggregator, LpAggregator, allTokensPart1,allTokensPart2, permittedTokens } from "./deploymentInputs";
import deployedAddress from "../deploymentData.json";

async function initLPHandler(_deployedAddress:any){
    console.log("------- Initializing in LP Handler -------")
  
    const PancakeSwapLPHandler = await ethers.getContractFactory("PancakeSwapLPHandler");
    const BiSwapLPHandler = await ethers.getContractFactory("BiSwapLPHandler");
    const ApeSwapLPHandler = await ethers.getContractFactory("ApeSwapLPHandler");
    const WombatHandler = await ethers.getContractFactory("WombatHandler");
  
    const pancakeLpHandler = await PancakeSwapLPHandler.attach(_deployedAddress.PancakeSwapLPHandler);
    const biswapLpHandler = await BiSwapLPHandler.attach(_deployedAddress.BiSwapLPHandler);
    const apeSwapLPHandler = await ApeSwapLPHandler.attach(_deployedAddress.ApeSwapLPHandler);
    const wombatHandler = await WombatHandler.attach(_deployedAddress.WombatHandler);
  
    const tx = await pancakeLpHandler.addOrUpdateProtocolSlippage("2500",{gasPrice: 3000000000})
     tx.wait(4);
     console.log("PancakeSwapLP Slippage set at 25% Max")
     await delay(1000);
    const tx2 = await biswapLpHandler.addOrUpdateProtocolSlippage("2500",{gasPrice: 3000000000})
     tx2.wait(4);
     console.log("BiSwapLP Slippage set at 25% Max")
     await delay(1000);
    const tx3 = await apeSwapLPHandler.addOrUpdateProtocolSlippage("2500",{gasPrice: 3000000000})
     tx3.wait(4);
     console.log("ApeSwapLP Slippage set at 25% Max")
     await delay(1000);
    const tx4 = await wombatHandler.addOrUpdateProtocolSlippage("2500",{gasPrice: 3000000000})
     tx4.wait(4);
     console.log("WombatLP Slippage set at 25% Max")
     console.log("------- LP Handler Initialised -------")
     return;
  }

  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  
  initLPHandler(deployedAddress).then(() => process.exit(0))
  .catch((error) => {
      console.log(error);
      process.exit(1);
  });