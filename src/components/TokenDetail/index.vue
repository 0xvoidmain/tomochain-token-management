<template>
  <div v-if="token" id="tokendetail">
    <div class="container">
      <div v-if="token" class="token-symbol">{{token.symbol}}</div>
    </div>
    <div class="container">
      <img v-if="token.icon" class="icon" :src="token.icon">
      <div v-else class="icon">{{token.symbol[0]}}</div>
    </div>
    <div class="container">
      <div class="amount">{{parseFloat(token.balance).toFixed(2)}}</div>
    </div>
    <div class="panel">
      <div class="field">
        Send
        <input type="text" v-model="transferValue" size="10">
      </div>
      <div class="field">
        To address:
        <input type="text" v-model="recipientAddress" size="50">
      </div>
    </div>
    <div class="button">
      <a class="btn" href="#" v-on:click="transfer()">Send</a>
    </div>
  </div>
</template>

<script>
import store from "../../store";
import { constants } from "fs";
import contract from "./contract";
export default {
  name: "TokenDetail",
  data() {
    return {
      token: null,
      transferValue: "",
      recipientAddress: ""
    };
  },
  async created() {
    this.token = await store.getToken(this.$route.params.address);
  },
  methods: {
    transfer: function() {
      let result = contract.transferTokens(
        this.recipientAddress,
        this.transferValue,
        this.token.address,
        async (err, hash) => {
          alert(hash);
          this.token = await store.getToken(this.$route.params.address);
        }
      );
    }
  }
};
</script>

<style scoped>
.token-symbol {
  text-align: center;
}

.icon {
  width: 30px;
}

div.icon {
  text-align: center;
  font-weight: 900;
  height: 30px;
  line-height: 30px;
  background: #ff9800;
  border-radius: 25px;
  color: #fff;
}

.amount {
  text-align: center;
  font-weight: 600;
  color: #4cd964;
}
</style>