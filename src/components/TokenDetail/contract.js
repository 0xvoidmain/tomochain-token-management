const abi = require('./abi.json');
import store from "../../store";

export default {
    transferTokens(recipientAddress, transferValue, addr, cb) {
        let contractInstance = web3.eth.contract(abi).at(addr);
        contractInstance.decimals((errors, decimals) => {
            transferValue = transferValue * (10 ** decimals);
            contractInstance.transfer(
                recipientAddress,
                transferValue,
                cb
            );
        });
    },
    getTokenBalance(addr, cb) {
        let contractInstance = web3.eth.contract(abi).at(addr);
        contractInstance.balanceOf(store.data.address, (error, result) => {
            contractInstance.decimals((errors, decimals) => {
                result = result.div(10 ** decimals);
                let balance = result.toString();
                cb && cb(balance)
            })
        })
    },
    getAddressBalance(cb) {
        web3.eth.getBalance(store.data.address, (error, result) => {
            if (error) {
                return error;
            } else {
                let balance = web3.toDecimal(result);
                cb && cb(balance);
            }
        });
    }
}
