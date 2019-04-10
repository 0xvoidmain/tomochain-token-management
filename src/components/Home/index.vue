<template>
  <div class="home">
    <TokenItem v-for="e in store.tokens" :key="e.address" :token="e"/>
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
      const checkAddr = store.login();
      if (checkAddr !== "undefined") {
        store.loadTokens(1, 15);
      }
    });
  }
};
</script>

<style lang="stylus" scoped>
.home {
  padding: 15px 10px;
}
</style>
