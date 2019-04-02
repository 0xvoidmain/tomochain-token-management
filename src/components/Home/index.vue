<template>
  <div class="home">
    <TokenItem v-for="e in store.tokens" :key="e.address" :token="e"/>
  </div>
</template>

<script>
import TokenItem from "./TokenItem";
import store from "../../store";
import axios from "axios";

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
  created() {
    store.loadTokens(1, 15);
  }
};
</script>

<style lang="stylus" scoped>
.home {
  padding: 15px 10px;
}
</style>
