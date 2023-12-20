import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import "@nomicfoundation/hardhat-chai-matchers";

import { ethers, upgrades, run } from "hardhat";
import { BigNumber, Contract, providers } from "ethers";
import {
    IndexSwap,
    // IndexSwapV2,
    IndexSwap__factory,
    Exchange,
    // ExchangeV2,
    // TokenRegistryV2,
    Rebalancing__factory,
    AccessController,
    IndexFactory,
    // IndexFactoryV2,
    PancakeSwapHandler,
    VelvetSafeModule,
    PriceOracle,
    AssetManagerConfig,
    TokenRegistry,
    OneInchHandler
} from "../../../typechain";

import { inputData, rewardTokens, ChainLinkAggregator, LpAggregator, allTokensPart1,allTokensPart2, permittedTokens } from "./deploymentInputs";
const fs = require('fs');

import deploymentJson from "../deployment.json";

const userInputData = inputData;

const deployedAddress: any ={};
const deploymentInputParamData: any ={};

async function deploy(){
  try{
    const [deployer,acc1,acc2,acc3,acc4,acc5] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Deployer Balance: ", await ethers.provider.getBalance(deployer.address))

    console.log(userInputData);

    console.log("---------------------- DEPLOYMENT STARTED---------------------");

    deploymentInputParamData.typeAction = "deployment"
    deploymentInputParamData.version = inputData.version;
    const { chainId } = await ethers.provider.getNetwork()
    deploymentInputParamData.network = chainId;
    deploymentInputParamData.date = new Date().toUTCString();

    var tempArray:any =[];

    //Deploy IndexSwapLibrary
    const IndexSwapLibraryDefault = await ethers.getContractFactory("IndexSwapLibrary");
    const indexSwapLibrary = await IndexSwapLibraryDefault.deploy({gasPrice: 3000000000});
    await indexSwapLibrary.deployed();
    console.log("Deployed IndexSwapLibrary at: ", indexSwapLibrary.address);
    deployedAddress.IndexSwapLibrary = indexSwapLibrary.address;
    tempArray.push({"contract": "IndexSwapLibrary","address": indexSwapLibrary.address,"inputs": []})


   //Deploy FeeLibrary
    const FeeLibrary = await ethers.getContractFactory("FeeLibrary");
    const feeLibrary = await FeeLibrary.deploy({gasPrice: 3000000000});
    await feeLibrary.deployed();
    console.log("Deployed FeeLibrary at: ", feeLibrary.address);
    deployedAddress.FeeLibrary = feeLibrary.address;
    tempArray.push({"contract": "FeeLibrary","address": feeLibrary.address,"inputs": []})
   
    //Deploy RebalanceLibrary
    const RebalanceLibrary = await ethers.getContractFactory("RebalanceLibrary",
      {
        libraries: {
          IndexSwapLibrary: indexSwapLibrary.address,
        },
      }
    );
    const rebalanceLibrary = await RebalanceLibrary.deploy({gasPrice: 3000000000});
    await rebalanceLibrary.deployed();
    console.log("Deployed RebalanceLibrary at: ", rebalanceLibrary.address);
    deployedAddress.RebalanceLibrary = rebalanceLibrary.address;
    tempArray.push({"contract": "RebalanceLibrary","address": rebalanceLibrary.address,"inputs": []})

// ------------------------------------------------------------------------------------------------------------------------ //
    //Deploying Base Contracts 

    const OffChainRebalance = await ethers.getContractFactory("OffChainRebalance",{  //Deploy BaseOffChainRebalance
        libraries: {
          RebalanceLibrary: rebalanceLibrary.address,
          IndexSwapLibrary: indexSwapLibrary.address,
        },
      }
    );
    const offChainRebalanceDefault = await OffChainRebalance.deploy({gasPrice: 3000000000});
    await offChainRebalanceDefault.deployed();
    console.log("Deployed BaseOffChainRebalance at: ", offChainRebalanceDefault.address);
    deployedAddress.BaseOffChainRebalance = offChainRebalanceDefault.address;
    tempArray.push({"contract": "BaseOffChainRebalance","address": offChainRebalanceDefault.address,"inputs": []})
  
    const RebalanceAggregator = await ethers.getContractFactory("RebalanceAggregator",{ //Deploy BaseRebalanceAggregator
      libraries : {
        RebalanceLibrary: rebalanceLibrary.address,
      }
    });
    const rebalanceAggregatorDefault = await RebalanceAggregator.deploy({gasPrice: 3000000000});
    await rebalanceAggregatorDefault.deployed();
    console.log("Deployed BaseRebalanceAggregator at: ",rebalanceAggregatorDefault.address);
    deployedAddress.BaseRebalanceAggregator = rebalanceAggregatorDefault.address;
    tempArray.push({"contract": "BaseRebalanceAggregator","address": rebalanceAggregatorDefault.address,"inputs": []})

    const Exchange = await ethers.getContractFactory("Exchange",{
      libraries: {
      IndexSwapLibrary: indexSwapLibrary.address
    },
    }); //Deploy BaseExchange 
    const exchangeDefault = await Exchange.deploy({gasPrice: 3000000000});
    await exchangeDefault.deployed();
    console.log("Deployed BaseExchange at: ", exchangeDefault.address);
    deployedAddress.BaseExchange = exchangeDefault.address;
    tempArray.push({"contract": "BaseExchange","address": exchangeDefault.address,"inputs": []})
  
    const IndexSwap = await ethers.getContractFactory("IndexSwap", { //Deploy BaseIndexSwap
        libraries: {
          IndexSwapLibrary: indexSwapLibrary.address,
        },
      });
    const indexSwapDefault = await IndexSwap.deploy({gasPrice: 3000000000});
    await indexSwapDefault.deployed();
    console.log("Deployed BaseIndexSwap at: ", indexSwapDefault.address);
    deployedAddress.BaseIndexSwap = indexSwapDefault.address;
    tempArray.push({"contract": "BaseIndexSwap","address": indexSwapDefault.address,"inputs": []})

    const Rebalancing = await ethers.getContractFactory("Rebalancing", { //Deploy BaseRebalancing
        libraries: {
          IndexSwapLibrary: indexSwapLibrary.address,
          RebalanceLibrary: rebalanceLibrary.address,
        },
      });
    const rebalancingDefault = await Rebalancing.deploy({gasPrice: 3000000000});
    await rebalancingDefault.deployed();
    console.log("Deployed BaseRebalancing at: ", rebalancingDefault.address);
    deployedAddress.BaseRebalance = rebalancingDefault.address;
    tempArray.push({"contract": "BaseRebalance","address": rebalancingDefault.address,"inputs": []})

    const AssetManagerConfigDefault = await ethers.getContractFactory("AssetManagerConfig"); //Deploy BaseAssetManagerConfig
    const assetManagerConfigDefault = await AssetManagerConfigDefault.deploy({gasPrice: 3000000000});
    await assetManagerConfigDefault.deployed();
    console.log("Deployed BaseAssetManagerConfig at: ", assetManagerConfigDefault.address);
    deployedAddress.BaseAssetManagerConfig = assetManagerConfigDefault.address;
    tempArray.push({"contract": "BaseAssetManagerConfig","address": assetManagerConfigDefault.address,"inputs": []})

    const FeeModule = await ethers.getContractFactory("FeeModule", {     //Deploy FeeModule
      libraries: {
        FeeLibrary: feeLibrary.address,
        IndexSwapLibrary: indexSwapLibrary.address,
      },
    });
    const feeModuleDefault = await FeeModule.deploy({gasPrice: 3000000000});
    await feeModuleDefault.deployed();
    console.log("Deployed FeeModule at: ", feeModuleDefault.address);
    deployedAddress.BaseFeeModule = feeModuleDefault.address;
    tempArray.push({"contract": "BaseFeeModule","address": feeModuleDefault.address,"inputs": []})

    const offChainIndex = await ethers.getContractFactory(
      "OffChainIndexSwap",
      {
        libraries: {
          IndexSwapLibrary: indexSwapLibrary.address,
        },
      }
    );
    const offChainIndexSwapDefault = await offChainIndex.deploy({gasPrice: 3000000000});
    await offChainIndexSwapDefault.deployed();
    console.log("Deployed OffChainIndexSwap at: ", offChainIndexSwapDefault.address);
    deployedAddress.BaseOffChainIndexSwap = offChainIndexSwapDefault.address;
    tempArray.push({"contract": "BaseOffChainIndexSwap","address": offChainIndexSwapDefault.address,"inputs": []})

    const VelvetSafeModule = await ethers.getContractFactory("VelvetSafeModule");
    const velvetSafeModule = await VelvetSafeModule.deploy({gasPrice: 3000000000});
    await velvetSafeModule.deployed();
    console.log("Deployed VelvetSafeModule at: ", velvetSafeModule.address);
    deployedAddress.VelvetSafeModule = velvetSafeModule.address;
    tempArray.push({"contract": "VelvetSafeModule","address": velvetSafeModule.address,"inputs": []})

 // ------------------------------------------------------------------------------------------------------------------------ //
    // Deploy Price Oracle
    const PriceOracle = await ethers.getContractFactory("PriceOracle");
    const priceOracle = await PriceOracle.deploy(inputData.wBNB,{gasPrice: 3000000000});
    await priceOracle.deployed();
    console.log("Deployed PriceOracle at: ",priceOracle.address);
    deployedAddress.PriceOracle = priceOracle.address;
    tempArray.push({"contract": "PriceOracle","address": priceOracle.address,"inputs": [inputData.wBNB]})


// ------------------------------------------------------------------------------------------------------------------------ //
     //Deploy SwapHandler
     const PancakeSwapHandler = await ethers.getContractFactory(
        "PancakeSwapHandler"
      );
      const swapHandler = await PancakeSwapHandler.deploy({gasPrice: 3000000000});
      await swapHandler.deployed();
      console.log("Deployed SwapHandler at: ", swapHandler.address);
      deployedAddress.SwapHandler = swapHandler.address;
      tempArray.push({"contract": "SwapHandler","address": swapHandler.address,"inputs": []})

      const swapHandlerContract = await PancakeSwapHandler.attach(swapHandler.address);
      const tx5 = await swapHandlerContract.init(inputData.pancakeSwapRouterAddress,priceOracle.address,{gasPrice: 3000000000});
      tx5.wait(2);
// ------------------------------------------------------------------------------------------------------------------------ //
    //Deploy Handlers

    const BaseHandler = await ethers.getContractFactory("BaseHandler"); //Deploy Base Handler
    const baseHandler = await BaseHandler.deploy(priceOracle.address,{gasPrice: 3000000000});
    await baseHandler.deployed();
    console.log("Deployed BaseHandler at: ", baseHandler.address);
    deployedAddress.BaseHandler = baseHandler.address;
    tempArray.push({"contract": "BaseHandler","address": baseHandler.address,"inputs": [priceOracle.address]})

    const VenusHandler = await ethers.getContractFactory("VenusHandler"); //Deploy Venus Handler
    const venusHandler = await VenusHandler.deploy(priceOracle.address,{gasPrice: 3000000000});
    await venusHandler.deployed();
    console.log("Deployed VenusHandler at: ", venusHandler.address);
    deployedAddress.VenusHandler = venusHandler.address;
    tempArray.push({"contract": "VenusHandler","address": venusHandler.address,"inputs": [priceOracle.address]})

    const PancakeSwapLPHandler = await ethers.getContractFactory("PancakeSwapLPHandler"); //Deploy PancakeSwapLP Handler
    const pancakeSwapLPHandler = await PancakeSwapLPHandler.deploy(priceOracle.address,{gasPrice: 3000000000});
    await pancakeSwapLPHandler.deployed();
    console.log("Deployed PancakeSwapLPHandler at: ", pancakeSwapLPHandler.address);
    deployedAddress.PancakeSwapLPHandler = pancakeSwapLPHandler.address;
    tempArray.push({"contract": "PancakeSwapLPHandler","address": pancakeSwapLPHandler.address,"inputs": [priceOracle.address]})

    const BiSwapLPHandler = await ethers.getContractFactory("BiSwapLPHandler"); //Deploy BiSwapLP Handler
    const biSwapLPHandler = await BiSwapLPHandler.deploy(priceOracle.address,{gasPrice: 3000000000});
    await biSwapLPHandler.deployed();
    console.log("Deployed BiswapLPHandler at: ", biSwapLPHandler.address);
    deployedAddress.BiSwapLPHandler = biSwapLPHandler.address;
    tempArray.push({"contract": "BiSwapLPHandler","address": biSwapLPHandler.address,"inputs": [priceOracle.address]})

    const ApeSwapLPHandler = await ethers.getContractFactory("ApeSwapLPHandler"); //Deploy ApeSwapLP Handler
    const apeSwapLPHandler = await ApeSwapLPHandler.deploy(priceOracle.address,{gasPrice: 3000000000})
    await apeSwapLPHandler.deployed();
    console.log("Deployed ApeSwapLPHandler at: ", apeSwapLPHandler.address);
    deployedAddress.ApeSwapLPHandler = apeSwapLPHandler.address;
    tempArray.push({"contract": "ApeSwapLPHandler","address": apeSwapLPHandler.address,"inputs": [priceOracle.address]})

    const WombatHandler = await ethers.getContractFactory("WombatHandler"); //Deploy Wombat Handler
    const wombatHandler = await WombatHandler.deploy(priceOracle.address,{gasPrice: 3000000000})
    await wombatHandler.deployed();
    console.log("Deployed WombatHandler at: ", wombatHandler.address);
    deployedAddress.WombatHandler = wombatHandler.address;
    tempArray.push({"contract": "WombatHandler","address": wombatHandler.address,"inputs": [priceOracle.address]})


    const ApeSwapLendingHandler = await ethers.getContractFactory("ApeSwapLendingHandler"); //Deploy ApeSwapLending Handler
    const apeSwapLendingHandler = await ApeSwapLendingHandler.deploy(priceOracle.address,{gasPrice: 3000000000})
    await apeSwapLendingHandler.deployed();
    console.log("Deployed ApeSwapLendingHandler at: ", apeSwapLendingHandler.address);
    deployedAddress.ApeSwapLendingHandler = apeSwapLendingHandler.address;
    tempArray.push({"contract": "ApeSwapLendingHandler","address": apeSwapLendingHandler.address,"inputs": [priceOracle.address]})


    const BeefyHandler = await ethers.getContractFactory("BeefyHandler"); //Deploy Beefy Handler
    const beefyHandler = await BeefyHandler.deploy(priceOracle.address,{gasPrice: 3000000000});
    await beefyHandler.deployed();
    console.log("Deployed BeefyHandler at: ", beefyHandler.address);
    deployedAddress.BeefyHandler = beefyHandler.address;
    tempArray.push({"contract": "BeefyHandler","address": beefyHandler.address,"inputs": [priceOracle.address]})

    const BeefyLPHandler = await ethers.getContractFactory("BeefyLPHandler"); //Deploy Beefy Handler
    const beefyLPHandler = await BeefyLPHandler.deploy(pancakeSwapLPHandler.address,priceOracle.address,{gasPrice: 3000000000});
    await beefyLPHandler.deployed();
    console.log("Deployed BeefyLPHandler at: ", beefyLPHandler.address);
    deployedAddress.BeefyLPHandler = beefyLPHandler.address;
    tempArray.push({"contract": "BeefyLPHandler","address": beefyLPHandler.address,"inputs": [pancakeSwapLPHandler.address,priceOracle.address]})

    const ZeroExSwapHandler = await ethers.getContractFactory("ZeroExHandler");
    const zeroExHandler = await ZeroExSwapHandler.deploy({gasPrice: 3000000000})
    await zeroExHandler.deployed();
    console.log("Deployed ZeroExSwapHandler at: ", zeroExHandler.address);
    deployedAddress.ZeroExSwapHandler = zeroExHandler.address;
    tempArray.push({"contract": "ZeroExSwapHandler","address": zeroExHandler.address,"inputs": []})


    const OneInchSwapHandler = await ethers.getContractFactory("OneInchHandler");
    const oneInchHandler = await OneInchSwapHandler.deploy({gasPrice: 3000000000})
    await oneInchHandler.deployed();
    console.log("Deployed OneInchSwapHandler at: ", oneInchHandler.address);
    deployedAddress.OneInchSwapHandler = oneInchHandler.address;
    tempArray.push({"contract": "OneInchSwapHandler","address": oneInchHandler.address,"inputs": []})

    const ParaswapHandler = await ethers.getContractFactory("ParaswapHandler");
    const paraswapHandler = await ParaswapHandler.deploy({gasPrice: 3000000000})
    await paraswapHandler.deployed();
    console.log("Deployed ParaswapHandler at: ", paraswapHandler.address);
    deployedAddress.ParaswapHandler = paraswapHandler.address;
    tempArray.push({"contract": "ParaswapHandler","address": paraswapHandler.address,"inputs": []})

     // ------------------------------------------------------------------------------------------------------------------------ //

    // Deploy Token Registry

    const TokenRegistry = await ethers.getContractFactory("TokenRegistry");
    const tokenRegistry = await upgrades.deployProxy(
        TokenRegistry,[inputData.minInvestmentAmount,inputData.maxInvestmentAmount,inputData.velvetTreasury,inputData.wBNB], { kind: "uups" },);
    await tokenRegistry.deployed();
    console.log("Deployed TokenRegistry at: ",tokenRegistry.address);
    deployedAddress.TokenRegistry = tokenRegistry.address;

    tempArray.push({"contract": "TokenRegistry","address": tokenRegistry.address,"inputs": []})

// ------------------------------------------------------------------------------------------------------------------------ //
   await delay(1000);

// ------------------------------------------------------------------------------------------------------------------------ //
    const IndexFactory = await ethers.getContractFactory("IndexFactory");
    const indexFactory = await upgrades.deployProxy(
        IndexFactory,[{
            _indexSwapLibrary: deployedAddress.IndexSwapLibrary,
            _baseIndexSwapAddress: deployedAddress.BaseIndexSwap,
            _baseRebalancingAddres: deployedAddress.BaseRebalance,
            _baseOffChainRebalancingAddress: deployedAddress.BaseOffChainRebalance,
            _baseRebalanceAggregatorAddress: deployedAddress.BaseRebalanceAggregator,
            _baseExchangeHandlerAddress: deployedAddress.BaseExchange,
            _baseAssetManagerConfigAddress: deployedAddress.BaseAssetManagerConfig,
            _baseOffChainIndexSwapAddress: deployedAddress.BaseOffChainIndexSwap,
            _feeModuleImplementationAddress: deployedAddress.BaseFeeModule,
            _baseVelvetGnosisSafeModuleAddress: deployedAddress.VelvetSafeModule,
            _gnosisSingleton: inputData.gnosisSingleton,
            _gnosisFallbackLibrary: inputData.gnosisFallbackLibrary,
            _gnosisMultisendLibrary: inputData.gnosisMultisendLibrary,
            _gnosisSafeProxyFactory: inputData.gnosisSafeProxyFactory,
            _priceOracle: deployedAddress.PriceOracle,
            _tokenRegistry: deployedAddress.TokenRegistry,
            _velvetProtocolFee: inputData.protocolFee,
            _maxInvestmentAmount: inputData.maxInvestmentAmount,
            _minInvestmentAmount: inputData.minInvestmentAmount,
          },], { kind: "uups" });
    await indexFactory.deployed();
    console.log("Deployed IndexFactory at: ", indexFactory.address);
    deployedAddress.IndexFactory = indexFactory.address;
    tempArray.push({"contract": "IndexFactory","address": indexFactory.address,"inputs": []})
    deploymentInputParamData.address = tempArray;
    deploymentJson.push(deploymentInputParamData);

    fs.writeFileSync('deployment-script/BSC/deploymentData.json', JSON.stringify(deployedAddress));
    fs.writeFileSync('deployment-script/BSC/deployment.json', JSON.stringify(deploymentJson));

// ------------------------------------------------------------------------------------------------------------------------ //

  }catch(e){
    console.log(e);
    fs.writeFileSync('scripts/deploymentData.json', JSON.stringify(deployedAddress));
    console.log("The deployed contracts are: ", deployedAddress);
  }
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

deploy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });


   






