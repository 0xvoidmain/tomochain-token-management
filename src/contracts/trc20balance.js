// Load metamask in the browser
window.addEventListener('load', function () {
    if (typeof web3 !== 'undefined') {
        console.log('Web3 Detected! ' + web3.currentProvider.constructor.name);
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.log('No Web3 Detected... using HTTP Provider');
        displayProviderInfo();
    }
});

function displayProviderInfo() {
    document.getElementById("main").innerHTML =
        'No compatible wallet provider found. Please install <a target="_blank" href="https://metamask.io/">Metamask</a>.';
};

const promisify = (inner) =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    );

// Get address balance (in metamask network)     
async function getBalance() {
    let address, wei, balance
    address = INPUT_ADDRESS;
    wei = promisify(cb => web3.eth.getBalance(address, cb))
    try {
        balance = web3.fromWei(await wei, 'ether')
        document.getElementById("output").innerHTML = balance + " ETH";
    } catch (error) {
        document.getElementById("output").innerHTML = error;
    }
};

// Get erc20 token balance (in metamask network)
async function getERC20Balance() {
    let address, contractAddress, contractABI, tokenContract, decimals, balance, name, symbol, adjustedBalance;
    address = INPUT_ADDRESS;
    contractAddress = INPUT_CONTRACT_ADDRESS;
    contractABI = INPUT_CONTRACT_ABI;

    tokenContract = web3.eth.contract(contractABI).at(contractAddress);

    decimals = promisify(cb => tokenContract.decimals(cb));
    balance = promisify(cb => tokenContract.balanceOf(address, cb));
    name = promisify(cb => tokenContract.name(cb));
    symbol = promisify(cb => tokenContract.symbol(cb));

    try {
        adjustedBalance = await balance / Math.pow(10, await decimals);
        return adjustedBalance;
    } catch (error) {
        return error;
    }
};

// Transfer token
function transferTokens() {
    let transferValue = INPUT_TRANSFER_VALUE;

    let recipientAddress = TO_ADDRESS;
    if (!recipientAddress.startsWith("0x")) {
        recipientAddress = "0x" + recipientAddress;
    }
    if (!recipientAddress || !web3.isAddress(recipientAddress)) {
        return;
    }

    transferValue = transferValue * 10 ** decimals;
    contractInstance.transfer(recipientAddress, transferValue, (error, result) => {
        if (error) {
            return error;
        } else {
            return result;
        }
    });
};
