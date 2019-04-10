import axios from 'axios';

var store = {
  address: '',
  tokens: [],
}

window.store = store;

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
      name: e.tokenObj.name,
      symbol: e.tokenObj.symbol,
      balance: e.quantityNumber,
      address: e.tokenObj.hash.toLowerCase()
    })).filter(e => !store.tokens.find(f => f.address == e.address));
    store.tokens = store.tokens.concat(newTokens);
  },
  login() {
    if (typeof web3 !== "undefined") {
      store.address = web3.eth.accounts[0];
      return store.address;
    } else {
      alert('Please unlock MetaMask and reload browser!');
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
