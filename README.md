# Velvet.Capital

This repository includes the smart contracts and scripts developed for the upcoming v2 relase of [Velvet Capital](https://velvet.capital/).
The contracts are divided into multiple sections:

## List of contracts

**1. Access**: This folder includes the contract (and interface) related to access: to specify and grant roles for a particular index. 
File Name: _AccessController.sol_

**2. Core**: This folder includes contracts (and interfaces) related to the core functionalities like investing, withdrawing, rebalance, etc.

- _Exchange.sol_ : This contract is where the actual swap takes place. Interaction happens with the vault and the handlers, and tokens are swapped into protocol tokens or back to the withdrawal token (as per the deposit and redeem) to generate additional yield from the third-party protcols. 

- _IndexSwap.sol_ : This is where the investment and withdrawal starts via the investInFund() and withdrawFund() functions. It holds the logic of investing and redeeming from our portfolios (charging fees, calculating the swap amounts to make sure the weights are not being manipulated by investments, interacting with the Exchange to swap tokens and mint/burn)

- _IndexSwapLibrary.sol_ : This includes all the logic and functions behind the calculation and balances of token in the vault, and also the swap amounts to be involved in different operations.

- _OffChainIndexSwap.sol_ : This contract makes the IndexSwap opeartions (investing, withdrawal) possible by fetching off-chain data from the 0x API.

**3. Fee** : This folder contains the contracts (and interfaces) to charge fees for our protocol (and for the asset managers) on different levels.

File Names: _FeeLibrary.sol_, _FeeModule.sol_.

- _FeeLibrary.sol_ : This is a helper library for FeeModule.sol file.

- _FeeModule.sol_ : This includes all logic for different types of fees charging.

The following fees are being charged currently in our product's v2:
- Entry/Exit Fee: This is a basic fee charged whenever user invests and withdraws from the protocol.
- Protocol/Management Fee: This is the basic fee that has to be paid by the users before investing/withdrawal or when the asset manager demands for it to be charged.
- Performance Fee: This fee is based upon the performance of a particular portfolio.

**4. Handler** : This folder contains the handlers for various protocols that are supported in our v2 launch. They can be listed as follows:

- [ApeSwap](https://apeswap.finance/): It provides lending as well as (pair) Liquidity options where the users can invest and get interest bearing tokens in return.
- [Beefy](https://beefy.com/): It provides lending as well as Liquidity options. After providing liquidity to a chosen protocol (e.g. PancakeSwap) the LP token can be deposited into Beefy and their protocol stakes the LP token which will in turn bring additional rewards (e.g. on PancakeSwap we get CAKE tokens).
- [BiSwap](https://biswap.org/): It allows for Liquidity option where the user gets interest bearing LP token in return that brings additional rewards.
- [PancakeSwap](https://pancakeswap.finance/): It provides the liquidity option and also additional yield farming options for better returns.
- [Venus](https://venus.io/): It is a lending-based platform bringing better yields for the users.
- [Wombat](https://www.wombat.exchange/): It is a staking platform where after investing, the LP token gets staked in the protocol, thus bringing rewards for the investor.

The directory also contains _BaseHandler.sol_ which is used to take care of base (non-derivative tokens).

Besides this, the v2 of our protocol also gives the flexibility to use multiple swap handlers, whose working is also handled by contracts in this directory. Those are as follows:
- PancakeSwap
- OneInch
- ParaSwap
- ZeroEx

**5. Interfaces** : This directory contains general interfaces that are used in the codebase.

**6. Library** : This folder contains the _ErrorLibrary.sol_ file which is used to take care of all those errors (and function reverts) that might potentially come up in our protocol. All of these have been thouroughly tested via our test cases, making the protocol robust enough.

This folder also contains _GnosisDeployer.sol_ file which is used to deploy a multi-sig safe to act as a vault for each individual fund. The safe is deployed as soon as new index fund is created.

**7. Oracle** : This folder contains the contract (and interface) for our ChainLink priceOracle. This is the genesis of all the prices that circulate in our protocol, making Velvet Capital come to life! Now we can support any aggregator which supports chainlink oracle standard/interface. 

This folder also contains aggregator where we can deploy our custom aggregator using the interface of *aggregatorV3Interface*. 

**8. Rebalance** : This directory takes care of the Rebalance property, which is very fundamental to our product. The following files make it all happen:
- OffChainRebalance.sol : This allows the rebalance functionality based on the off-chain data fetched by the 0x API. The updateWeights and updateTokens features works as the rebalance functionality should work.
- RebalanceAggregator.sol : This contract helps the asset manager to swap 1:1 tokens while rebalancing using different third-part crypto aggregators (OneInce, 0x and ParaSwap).
- RebalanceLibrary.sol : This is a library contract that assist the Rebalance contract in its functioning.
- Rebalancing.sol : This is where the core rebalance functions like updateWeights and updateTokens is located. The buying and selling of tokens (accordingly) starts from here while rebalancing. (Pancake swap)

**9. Registry** : This folder holds the token registry (which is like an information storehouse for the portfolios: tokens enabled, swap handler being used, token handler, whitelisted tokens, etc) and the asset manager config (where all the data related to an index's asset manager is taken care of: permitted tokens, investment amount range, fee specifications, etc).
File Names: _AssetManagerConfig.sol_, _TokenRegistry.sol_

**10. Vault**: This includes files for Safe functionality for our indexes, depending on how the portfolio is being created. This module acts as a bridge between the protocol and safe multi-sig.
File Names: _VelvetSafeModule.sol_

**11. IndexFactory.sol**: Special mention to this solo contract that is basically a script allowing us to create a portfolio on our protocol in a single go!


## Running test cases

To run the testcases, make sure that the `.env` file is updated (with the RPC URL, API keys and the Wallet Mnemonic value) and then run the following command:

```
$ npx hardhat test --network hardhat
```

The above command can also simply work by doing:
```
$ npx hardhat test
```

In order to check the coverage of our protocol, install the `solidity-coverage` npm package, and then run the following command:
```
$ npm i solidity-coverage 
$ npx hardhat coverage
```

## Deployment

To deploy the smart contracts we use the command(Please complete the data in deploymentInputs):

```
$ npx hardhat run BSC/deployment/deployBsc.ts
```

To initialise the individual contracts we need to call different tasks:

```
npx hardhat run BSC/deployment/initExternalSwapHandlers.ts --network 

npx hardhat run BSC/deployment/initPriceOracle.ts --network 

npx hardhat run BSC/deployment/initTokenRegistry.ts --network 

npx hardhat run BSC/deployment/initLpHandlers.ts --network 
```
