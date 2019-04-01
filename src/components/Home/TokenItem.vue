<template>
  <div class="token-item">
    <img v-if="token.icon" class="icon" :src="token.icon">
    <div v-else class="icon">{{token.symbol[0]}}</div>
    <div class="info">
      <div>
        <div class="name">{{token.name}}</div>
        <div class="symbol">{{token.symbol}}</div>
      </div>
      <div class="amount">
        {{parseFloat(token.balance).toFixed(2)}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['token']
}
</script>


<style lang="stylus" scoped>
.token-item
  display flex
  align-items center
  padding 10px 15px
  box-shadow 1px 1px 3px rgba(0, 0, 0, 0.1)
  border-radius 5px
  margin-bottom 10px
  background rgba(255, 255, 255, 0.05)
  cursor pointer
  .icon
    width 30px
  div.icon
    text-align center
    font-weight 900
    height 30px
    line-height 30px
    background #FF9800
    border-radius 25px
    color #fff
  .info
    margin-left 20px
    display flex
    align-items center
    justify-content space-between
    flex 1
    .name
      font-weight 500
    .symbol
      font-size 12px
      text-transform uppercase
      color rgba(255, 255, 255, 0.5)
    .amount
      font-weight 600
      color #4CD964
</style>
