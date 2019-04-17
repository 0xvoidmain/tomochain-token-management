<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import store from "./store";
export default {
  name: "App",
  // created() {
  //   window.addEventListener("load", function() {
  //     store.login();
  //   });
  // }
};
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #ffffff;
  font-weight: 500;
  background: #262c4e;
  min-height: 100vh;
}
.list-title {
  font-size: 20px;
  font-weight: 600;
  padding: 15px 0 10px 0;
  opacity: 0.8;
}
</style>
