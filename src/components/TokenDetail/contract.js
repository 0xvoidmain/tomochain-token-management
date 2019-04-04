const abi = require('./abi.json');
import store from "../../store";

export default {
    transferTokens(recipientAddress, transferValue, addr, cb) {
        let contractInstance = web3.eth
            .contract(abi).at(addr);
        transferValue = transferValue * 10 ** 18;
        contractInstance.transfer(
            recipientAddress,
            transferValue,
            cb
        );
    },
    getTokenBalance(addr, cb) {
        let decimals = 18;
        let contractInstance = web3.eth
            .contract(abi).at(addr);
        contractInstance.balanceOf(store.data.address, (error, result) => {
            contractInstance.decimals((errors, decimals) => {
                result = result.div(10 ** decimals);
                let balance = result.toString();
                // console.log(balance);
                cb && cb(balance)
            })
        })
    }
}
