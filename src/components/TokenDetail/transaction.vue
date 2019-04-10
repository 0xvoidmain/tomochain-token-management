<template>
  <div style="padding-bottom: 30px">
    <div
      class="transaction-item"
      v-for="transaction in transactions"
      :key="transaction.id"
      @click="linkToScan(transaction.transactionHash)"
    >
      <div v-if="transaction.from === address" class="transaction-table">
        <div class="container" style="margin-right: 0px; width: 60%">
          <h3 style="color: red;margin: 0 0 10px;font-size: 1em;">Send</h3>
          <h5
            style="overflow: auto;white-space: nowrap;overflow: hidden;width: 100%;text-overflow: ellipsis;margin: 0;font-weight: normal;"
          >To: {{transaction.to}}</h5>
        </div>
        <div
          style="color: red;width: 40%;font-size: 12px;text-align: right;"
        >- {{transaction.value/10**18}} {{transaction.symbol}}</div>
      </div>
      <div v-if="transaction.to === address" class="transaction-table">
        <div class="container" style="margin-right: 0px; width: 60%">
          <h3 style="color: green;margin: 0 0 10px;font-size: 1em;">Received</h3>
          <h5
            style="overflow: auto;white-space: nowrap;overflow: hidden;width: 100%;text-overflow: ellipsis;margin: 0;font-weight: normal;"
          >From: {{transaction.from}}</h5>
        </div>
        <div
          style="color: green;width: 40%;font-size: 12px;text-align: right;"
        >+ {{transaction.value/10**18}} {{transaction.symbol}}</div>
      </div>
    </div>
    <h5 @click="load()" style="color: gray; text-align: center;">Load</h5>
  </div>
</template>

<script>
import store from "../../store";
import axios from "axios";
export default {
  data() {
    return {
      transactions: null,
      page: 13,
      address: "",
      url: ""
    };
  },
  async created() {
    this.url = `${window.TXS}`;
    this.address = store.data.address;
    let transactions = await axios.get(
      `${window.API}/token-txs?token=${this.$route.params.address}&address=${
        store.data.address
      }&page=1&limit=3`
    );
    this.transactions = transactions.data.items;
  },
  methods: {
    async load() {
      let transactions = await axios.get(
        `${window.API}/token-txs?token=${
          this.$route.params.address
        }&   address=${store.data.address}&page=1&limit=${this.page}`
      );
      this.transactions = transactions.data.items;
      this.page += 10;
    },
    linkToScan(hash) {
      window.open(this.url + "/" + hash, "_blank");
      // window.location.href = this.url + "/" + hash;
    }
  }
};
</script>

<style lang="stylus" scoped>
.transaction-item {
  align-items: center;
  padding: 25px 15px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;

  .transaction-table {
    display: flex;
    align-items: center;
  }
}
</style>