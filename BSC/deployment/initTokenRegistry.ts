import { ethers, run } from "hardhat";
import { inputData, rewardTokens, ChainLinkAggregator, LpAggregator, allTokensPart1,allTokensPart2, permittedTokens } from "./deploymentInputs";
import deployedAddress from "../deploymentData.json";

async function initTokenRegistry(_deployedAddress:any){
    const TokenRegistry = await ethers.getContractFactory("TokenRegistry");
    const tokenRegistryContract = TokenRegistry.attach(_deployedAddress.TokenRegistry)
  
    console.log("------- Initializing in TokenRegistry -------")
    var priceOracleArray:any = []
    var tokenArray:any = [];
    var addressArray:any = [];
    var handlerArray:any = [];
    var primaryArray:any = [];
    var rewardArray:any =[];
    
    for (let i = 0; i < allTokensPart1.length; i++) {
      const object = allTokensPart1[i];
      tokenArray.push(object.token);
      addressArray.push(object.address);
      handlerArray.push(_deployedAddress[object.handler]);
      primaryArray.push(object.primary);
      rewardArray.push([object.rewardToken]);
      priceOracleArray.push(_deployedAddress.PriceOracle)
    }

    const tx1 = await tokenRegistryContract.enableToken(priceOracleArray,addressArray,handlerArray,rewardArray,primaryArray,{gasPrice: 3000000000});
    tx1.wait(2);
  
    console.log("Enabled Tokens In TokenRegistry Part 1");
  
    var priceOracleArray:any =[]
    var tokenArray:any = [];
    var addressArray:any = [];
    var handlerArray:any = [];
    var primaryArray:any = [];
    var rewardArray:any =[];
    
    for (let i = 0; i < allTokensPart2.length; i++) {
      
      const object = allTokensPart2[i];
      tokenArray.push(object.token);
      addressArray.push(object.address);
      handlerArray.push(_deployedAddress[object.handler]);
      primaryArray.push(object.primary);
      rewardArray.push([object.rewardToken]);
      priceOracleArray.push(_deployedAddress.PriceOracle)
    }
  
    const tx11 = await tokenRegistryContract.enableToken(priceOracleArray,addressArray,handlerArray,rewardArray,primaryArray,{gasPrice: 3000000000});
    tx11.wait(2);
  
    console.log("Enabled Tokens In TokenRegistry Part 2");
  
     const txI = await tokenRegistryContract.addRewardToken(rewardTokens,_deployedAddress.BaseHandler,{gasPrice: 3000000000});
     txI.wait(4);
    
  
    console.log("Enabled Reward Tokens");
    
    const tx4 = await tokenRegistryContract.enablePermittedTokens(permittedTokens, [_deployedAddress.PriceOracle, _deployedAddress.PriceOracle],{gasPrice: 3000000000})
    tx4.wait(4);
    await delay(1000);
    console.log("Enabled Permitted Token")
    const tx6 = await tokenRegistryContract.enableSwapHandlers([_deployedAddress.SwapHandler],{gasPrice: 3000000000});
    tx6.wait(4);
    await delay(1000);
    console.log("Enabled Swap Handlers")
    const tx7 = await tokenRegistryContract.enableExternalSwapHandler(_deployedAddress.OneInchSwapHandler,{gasPrice: 3000000000});
    tx7.wait(4);
    await delay(1000);
    console.log("Enabled 1Inch External Swap Handler")
    const tx8 = await tokenRegistryContract.enableExternalSwapHandler(_deployedAddress.ZeroExSwapHandler,{gasPrice: 3000000000});
    tx8.wait(4);
    await delay(1000);
    console.log("Enabled ZeroEx External Swap Handler")
    const tx9 = await tokenRegistryContract.enableExternalSwapHandler(_deployedAddress.ParaswapHandler,{gasPrice: 3000000000});
    tx9.wait(4);
    await delay(1000);
    console.log("Enabled Paraswap External Swap Handler")
    const tx10 =await tokenRegistryContract.addNonDerivative(_deployedAddress.WombatHandler,{gasPrice: 3000000000});
    tx10.wait(4);
    await delay(1000);
    console.log("Enabled Wombat Non Derivative Handler")
  
    console.log("------- TokenRegistry Initializing Completed -------")
    return
  
}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

initTokenRegistry(deployedAddress).then(() => process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1);
});