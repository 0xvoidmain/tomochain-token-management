<template>
  <div class="home">
    <div v-if="!store.tokens || store.tokens.length == 0">
      <div class="empty">
        Empty
      </div>
      <div class="empty-text">
        You dont have any TRC-20 tokens;
      </div>
    </div>
    <div v-else>
      <TokenItem v-for="e in store.tokens" :key="e.address" :token="e"/>
    </div>
  </div>
</template>

<script>
import TokenItem from "./TokenItem";
import store from "../../store";

export default {
  name: "Home",
  components: {
    TokenItem
  },
  data() {
    return {
      store: store.data
    };
  },
  async created() {
    window.addEventListener("load", function() {
      const checkAddr = store.login((err, address) => {
        if (err) alert(err);
        else {
          store.loadTokens(1, 15);
        }
      });
    });
    localStorage.page = 1;
    delete localStorage.transactions;
  }
};
</script>

<style lang="stylus" scoped>
.home {
  padding: 15px 10px;
}
.empty {
  text-align: center;
  margin-top: 20px;
  font-size: 40px;
  opacity: 0.2;
}
.empty-text {
  text-align: center;
  opacity: 0.7;
  margin-top: 10px;
}
</style>
