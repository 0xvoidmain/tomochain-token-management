import axios from 'axios'
var store = {
  address: '0xb4742932bDAe0caeCf8Eb2AAcb34384433d74226',
  tokens: []
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
  }
}
