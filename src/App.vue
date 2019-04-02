<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import store from './store';
export default {
  name: 'App',
  created() {
    store.login();
  }
}
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #ffffff;
  font-weight: 500;
  background: #191D34;
  min-height: 100vh;
}
</style>
