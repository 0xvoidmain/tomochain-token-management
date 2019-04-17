import axios from 'axios';

var store = {
  address: '',
  tokens: [],
}

export default {
  data: store,
  async loadTokens(page, limit) {
    var { data } = await axios.get(`${window.API}/token-holders`, {
      params: {
        page: page || 1,
        limit: limit || 15,
        hash: store.address
      }
    });
    var newTokens = data.items.map(e => ({
      icon: '',
      name: (e.tokenObj.name || '').trim(),
      symbol: (e.tokenObj.symbol || '').trim(),
      balance: e.quantityNumber,
      address: e.tokenObj.hash.toLowerCase()
    }))
    .filter(e => !store.tokens.find(f => f.address == e.address));
    store.tokens = store.tokens.concat(newTokens);
  },
  login(cb) {
    if (typeof web3 !== "undefined") {
      window.web3.eth.getAccounts(function (err, accounts) {
        if (err) {
          return cb && cb('Have an error with Metamask')
        }
        else if (accounts.length === 0) {
          return cb && cb('Unlock Metamask, please')
        }
        store.address = accounts[0];

        window.web3.version.getNetwork((err, netId) => {
          if (netId == "89") {
            window.API = 'https://scan.testnet.tomochain.com/api';
            window.TXS = 'https://scan.testnet.tomochain.com/txs';
          }
          else if (netId == "88") {
            window.API = 'https://scan.tomochain.com/api';
            window.TXS = 'https://scan.tomochain.com/txs';
          }
          else {
            cb && cb('Uknown network, change network to TomoChain, please');
            return;
          }
          cb && cb(null, store.address);
        });
      });
    } else {
      window.alert('Please unlock MetaMask and reload browser!');
    };
  },
  getToken(addr) {
    let token = store.tokens.find(e => e.address == addr);
    return token;
  },
  checkAddress(addr) {
    return web3.isAddress(addr);
  },
}
