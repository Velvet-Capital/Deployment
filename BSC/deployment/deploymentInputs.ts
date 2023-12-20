import baseToken from "../data/BaseTokens.json";
import venusToken from "../data/VenusTokens.json";
import wombatToken from "../data/WombatTokens.json";
import apeLendingToken from "../data/ApeSwapLendingTokens.json";
import apeLpToken from  "../data/ApeSwapLpTokens.json";
import beefyToken from "../data/BeefyTokens.json";
import beefyLpToken from "../data/BeefyPancakeLpTokens.json";
import biswapLpToken from "../data/BiSwapLpTokens.json";
import pancakeLpToken from "../data/PancakeSwapLpTokens.json";
import chainlinkAggregator from "../data/PriceOracleChainLink.json";
import lpAggragtor from "../data/LpAggregator.json";
import rewardToken from "../data/RewardTokens.json";
import permittedToken from "../data/PermittedTokens.json";


export const inputData = {
    lpSlippage: "2500",
    maxAssetManagerFee: "5000",
    maxPerformanceFee: "5000",
    velvetTreasury: "",
    outAsset: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    velvetProtocolFee: "100",
    _protocolFeeBottomConstraint: "30",
    _maxEntryFee: "500",
    _maxExitFee:"500",
    protocolFee: "2500",
    maxInvestmentAmount: "100000000000000000000000",
    minInvestmentAmount: "1000000000000000000",
    assetManagerTreasury: "",
    velvetManagerAddress: "",
    pancakeSwapRouterAddress: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    rewardVault: "",
    maxAssetLimit: "15",
    wBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    cooldownPeriod: "60",
    gnosisSingleton : "0x3E5c63644E683549055b9Be8653de26E0B4CD36E",
    gnosisFallbackLibrary : "0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4",
    gnosisMultisendLibrary : "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    gnosisSafeProxyFactory :"0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2",
    moduleProxyFactory : "0x76E2cFc1F5Fa8F6a5b3fC4c8F4788F0116861F9B",
    ownerMultiSigWalletAddress: "",
    version: "v0.0.1"
  }

  export const BaseTokens = baseToken;

  export const VenusTokens = venusToken;

  export const WombatTokens = wombatToken;

  export const ApeSwapLendingTokens = apeLendingToken;

  export const ApeSwapLpTokens = apeLpToken;

  export const BeefyTokens = beefyToken;

  export const BeefyPancakeLpTokens = beefyLpToken;

  export const BiSwapLpTokens = biswapLpToken;

  export const PancakeSwapLpTokens = pancakeLpToken;

  export const ChainLinkAggregator = chainlinkAggregator;

  export const LpAggregator = lpAggragtor;

  export const rewardTokens = rewardToken;

  export const permittedTokens = permittedToken;

  export const allTokensPart1 = [...BaseTokens, ...VenusTokens, ...WombatTokens, ...ApeSwapLendingTokens, ...ApeSwapLpTokens];

  export const allTokensPart2 = [...BeefyTokens,...BeefyPancakeLpTokens, ...BiSwapLpTokens, ...PancakeSwapLpTokens]