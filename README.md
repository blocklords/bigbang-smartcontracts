### miner-smartcontracts


**Mini Miners** is a *Play to Earn Blockchain* game. Developed by **BitPunch** Studio, and Published by [Seascape Network](https://seascape.network/).

This repository contains the smartcontracts of **Mini Miners**.

---
## Smartcontracts

* `contracts/nfts` &ndash; The NFTs of Mini Miners game.
* `contracts/factory` &ndash; The smartcontract used as a gate for mint NFTs of the game.
* `contracts/game` &ndash; The blockchain related gameplay inside the game. *e.g import/export nft, purchase in game resource*.
* `contracts/token` &ndash; [MSCP][CWS] a native token of the game.

---
## Installation
Create `.env` file on the root folder by adding the following variables:

```
ACCOUNT_1=
```

Set your privatekeys in `ACCOUNT_*` variables.

> The **ACCOUNT_1** are used in local development. So it could be any private keys without any funds on any network.

---

Then, start the docker container:

```
docker-compose up -d
```


---

In order to deploy or test the smartcontracts, enter into the container:

```
docker exec -it moonscape-smartcontract bash
```

Then call `truffle compile` to compile solidity code. Or call `truffle migrate <file name in migrations> --network <network name>` to deploy on network.

---
Once you finished the working on the project, its better to close the containers.

First exit from container:

```
exit
```

Then shut down the container:

```
docker-compose down
```