const abi = require('./abi.json');

export default {
    transferTokens(recipientAddress, transferValue, addr, cb) {
        let contractInstance = web3.eth
            .contract(abi).at(addr);
        transferValue = transferValue * 10 ** 18;
        contractInstance.transfer(
            recipientAddress,
            transferValue,
            cb
        )
    }
}