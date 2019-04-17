<template>
  <div>
    <h4 style="color: #fff; margin-bottom: 10px; padding-top: 20px;">
      Transactions
      <button class="refresh-btn" @click="refreshTransaction">refresh</button>
    </h4>
    <div style="padding-bottom: 30px">
      <div
        class="transaction-item"
        v-for="transaction in transactions"
        :key="transaction.id"
        @click="linkToScan(transaction.transactionHash)"
      >
        <div v-if="transaction.from === address" class="transaction-table">
          <div class="container" style="margin-right: 0px; width: 60%">
            <h3 style="color: #FF5723; margin: 0 0 10px;font-size: 1em;">Send</h3>
            <h5
              style="color: rgba(255, 255, 255, 0.5); overflow: auto; white-space: nowrap;overflow: hidden;width: 100%; text-overflow: ellipsis; margin: 0; font-weight: normal;"
            >To: {{transaction.to}}</h5>
          </div>
          <div
            style="color: #FF5723; width: 40%;font-size: 16px;text-align: right;"
          >-{{(transaction.value/10**18).toFixed(2)}} {{transaction.symbol}}</div>
        </div>
        <div v-if="transaction.to === address" class="transaction-table">
          <div class="container" style="margin-right: 0px; width: 60%">
            <h3 style="color: #4CD964; margin: 0 0 10px;font-size: 1em;">Received</h3>
            <h5
              style="color: rgba(255, 255, 255, 0.5); overflow: auto;white-space: nowrap;overflow: hidden;width: 100%;text-overflow: ellipsis;margin: 0;font-weight: normal;"
            >From: {{transaction.from}}</h5>
          </div>
          <div
            style="color: #4CD964;width: 40%;font-size: 16px;text-align: right;"
          >+{{(transaction.value/10**18).toFixed(2)}} {{transaction.symbol}}</div>
        </div>
      </div>
      <h5 v-if="haveMore" @click="loadMore()" style="color: gray; text-align: center;">Load More</h5>
    </div>
  </div>
</template>

<script>
import store from "../../store";
import axios from "axios";
import { constants } from "fs";
export default {
  data() {
    return {
      transactions: null,
      page: parseInt(localStorage.page),
      address: "",
      url: "",
      haveMore: true,
      limit: 15
    };
  },
  async created() {
    this.url = `${window.TXS}`;
    this.address = store.data.address;
    try {
      this.transactions = JSON.parse(localStorage.transactions || '[]');
    }
    catch (ex) {}
    if (this.transactions && this.transactions.length == 0) {
      this.load();
    }
    this.intervalUpdateTransaction = setInterval(() => this.updateTransaction(), 2000);
  },
  destroyed() {
    clearInterval(this.intervalUpdateTransaction);
  },
  methods: {
    refreshTransaction() {
      this.transactions = [];
      this.page = 1;
      this.haveMore = true;
      delete localStorage.transactions;
      localStorage.page = 1;
      this.load();
    },
    async updateTransaction() {
      let { data } = await axios.get(`${window.API}/token-txs`, {
        params: {
          token: this.$route.params.address,
          address: store.data.address,
          page: 1,
          limit: 10
        }
      });
      data.items = data.items
        .filter(e => !this.transactions.find(t => e.transactionHash.toLowerCase() == t.transactionHash.toLowerCase()));
      this.transactions = data.items.concat(this.transactions);
      localStorage.transactions = JSON.stringify(this.transactions);
    },
    loadMore() {
      this.page = this.page + 1;
      localStorage.page = this.page;
      this.load();
    },
    async load() {
      let { data } = await axios.get(`${window.API}/token-txs`, {
        params: {
          token: this.$route.params.address,
          address: store.data.address,
          page: this.page,
          limit: this.limit
        }
      });

      this.transactions = this.transactions.concat(data.items);
      localStorage.transactions = JSON.stringify(this.transactions);
      if (data.items.length < this.limit) {
        this.haveMore = false;
      }
      else {
        this.haveMore = true;
      }
    },
    linkToScan(hash) {
      window.location.href = this.url + "/" + hash;
    }
  }
};
</script>

<style lang="stylus" scoped>
.transaction-item {
  align-items: center;
  padding: 10px 15px;
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

.refresh-btn {
  color: #27a0f4;
  float: right;
  outline: none;
  border: none;
  background: transparent;
  padding-right: 0;
}
</style>