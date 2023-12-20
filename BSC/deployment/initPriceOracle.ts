import { ethers, run } from "hardhat";
import { inputData, rewardTokens, ChainLinkAggregator, LpAggregator, allTokensPart1,allTokensPart2, permittedTokens } from "./deploymentInputs";
import deployedAddress from "../deploymentData.json";


async function initPriceOracle(_deployedAddress:any,_priceOracleData:any){
    const PriceOracle = await ethers.getContractFactory("PriceOracle");
    const priceOracleContract = PriceOracle.attach(_deployedAddress.PriceOracle);
  
    console.log("------- Initializing in PriceOracle -------")
  
    const tokenArray:any = [];
    const quoteArray:any = [];
    const aggregatorArray:any = [];
  
      for(const item of _priceOracleData){
        tokenArray.push(item.address[0]);
        quoteArray.push(item.address[1]);
        aggregatorArray.push(item.address[2]);
        console.log("Added Token In Array:", item.token);
     }
     const tx = await priceOracleContract._addFeed(tokenArray,quoteArray,aggregatorArray,{gasPrice: 3000000000});
        tx.wait(3);
  
    console.log("------- PriceOracle Initialized -------");
     return
  }

initPriceOracle(deployedAddress,[...ChainLinkAggregator,...LpAggregator]).then(() => process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1);
});