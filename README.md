# POMS

Product ownership management system based on blockchain technology


## Abstract

This system presents a solution to the problem of counterfeit products in the production field by utilizing blockchain technology. Counterfeit products are a major concern in the industry, and traditional methods such as electronic product codes have proven to be inadequate in preventing them. This system addresses this issue by storing product ownership information on a blockchain, thus providing authentic records through a decentralized public ledger.

The system leverages blockchain technology, specifically a permissioned public blockchain network, in combination with Merkle Patricia Trie, Elliptic Curve Digital Signature Algorithms, and Proof of Work mechanism to provide cost and time-effective product ownership management functionalities. The system allows for operations such as enrolling, shipping, and receiving products to be executed by various parties, including the admin, manufacturers, and customers.

This system offers a solution that differs from existing multipurpose public blockchain platforms such as Ethereum, which are not optimized for commercial use by companies and have high processing time and cost. The proposed system provides a more efficient and practical solution for product ownership management while still maintaining the security and authenticity of records.


## References

[1]	BitFury Group in collaboration with Jeff Garzik, “Public versus Private Blockchains Part 1 : Permissioned Blockchains.” 2016.
https://bitfury.com/content/downloads/public-vs-private-pt1-1.pdf

[2]	BitFury Group in collaboration with Jeff Garzik, “Public versus Private Blockchains Part 2 : Permissionless Blockchains.” 2016.
https://bitfury.com/content/downloads/public-vs-private-pt2-1.pdf

[3]	K. Toyoda, P. T. Mathiopoulos, I. Sasase and T. Ohtsuki, "A Novel Blockchain-Based Product Ownership Management System (POMS) for Anti-Counterfeits in the Post Supply Chain," in IEEE Access, vol. 5, pp. 17465-17477, 2017, doi: 10.1109/ACCESS.2017.2720760.

[4]	Satoshi Nakamoto, “Bitcoin: A Peer-to-Peer Electronic Cash System,” 2008.
https://bitcoin.org/bitcoin.pdf

[5]	Vitalik Buterin, “A Next-Generation Smart Contract and Decentralized Application Platform,” 2014.
https://ethereum.org/en/whitepaper/


## System Requirements

This system was developed with [Node.js 14](https://nodejs.org/en/blog/release/v14.17.3/) on [Ubuntu 20.04](https://releases.ubuntu.com/focal/).


## Setup

1. Clone or download this repository.

2. Change directory to the project root.

3. Install dependencies with: 
``` 
npm install 
```


## Generating an Account

Open interactive wallet shell and generate private key and address with:
```
npm run wallet
> account.create()
```
Store the `privateKey` and `address`.



## Running POMS

**Note:** The connection between the nodes is tested with the firewall disabled computers in the same network.

**Important!** Use different `storage-path` and `port-number` if you are running both nodes in the same machine.

### Running as Main

Run main node with:
```
npm run main -- -m <main-account-address> -d <storage-path> -p <port-number>
```
Replace `main-account-address` with generated `address` string.

The ip address of the main node will be shown upon start up.

### Running as Side

Run side node with:
```
npm run side -- -m <main-account-address> --i <main-node-ip-address> -d <storage-path> -p <port-number>
```
Replace `main-account-address` with the `address` string you used to run the main node.

Replace `main-node-ip-address` with ip address of the main node.
