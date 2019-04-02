<template>
<div>
  <TransactionItem />
  <TransactionItem />
  <TransactionItem />
  <TransactionItem />
</div>
</template>

<script>
export default {
  data() {
    return {
      transactions: []
    }
  },
  created() {
    //load transaction (user_address, erc20 address)

  }
}
</script>
