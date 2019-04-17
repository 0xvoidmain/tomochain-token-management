<template>
  <div class="modal" :class="show ? 'modal-open' : 'modal-close'">
    <div class="modal-container">
      <div class="modal-title">
        Transfer {{token.name}}
      </div>
      <button class="close-btn" @click="() => closeModal()">
        <img src="./close.svg" width="20px">
      </button>
      <div class="input-group">
        <div>Send:</div>
        <div class="input-group-wrap">
          <input
            class="input-group__input"
            type="number"
            placeholder="0"
            v-model="transferValue"
          >
          <button v-on:click="allToken()" class="send-all-btn">All</button>
        </div>
      </div>
      <div class="input-group">
        <div class="input-group__title">To Address:</div>
        <div class="input-group__wrapper">
          <input
            class="input-group__input input-group__input--ful"
            type="text"
            v-model="recipientAddress"
          >
          <div class="input-group__info"></div>
        </div>
      </div>
      <div v-if="errorMsg" class="error-msg">{{errorMsg}}</div>
      <button class="send-btn" v-on:click="transfer()">
        {{isSending ? 'Sending...' : 'Send'}}
      </button>
    </div>
  </div>
</template>

<script>
import store from "../../store";
import { constants } from "fs";
import contract from "./contract";
export default {
  props: ['balance', 'show'],
  data() {
    return {
      token: null,
      transferValue: "",
      recipientAddress: "",
      dontHaveTomoForFee: false,
      isSending: false,
      errorMsg: ''
    };
  },
  created() {
    this.token = store.getToken(this.$route.params.address);
    contract.getAddressBalance(balance => {
      this.dontHaveTomoForFee = balance === 0;
    });
  },
  methods: {
    closeModal() {
      this.transferValue = "";
      this.recipientAddress = "";
      this.$emit('close');
    },
    transfer: function() {
      var errorMsg = this.validated();
      if (errorMsg) {
        this.errorMsg = errorMsg;
        return;
      }
      this.isSending = true;
      let result = contract.transferTokens(
        this.recipientAddress,
        this.transferValue,
        this.token.address,
        async (err, hash) => {
          this.isSending = false;
          this.closeModal();
        }
      );
    },
    validated: function() {
      if (this.dontHaveTomoForFee) return "You don't have TOMO for transaction fee";
      if (this.transferValue > this.token.balance) return "Not engouht balancce";
      if (this.transferValue == "" || this.transferValue == 0) return "Enter your amount";
      if (!this.isNumeric(this.transferValue)) return "Amount must be numeric";
      if (this.recipientAddress == "") return "Enter recipient address";
      if (!store.checkAddress(this.recipientAddress)) return "Invalid recipient address";
      return false;
    },
    isNumeric: function(value) {
      let regex = /[0-9]|\./;
      return regex.test(value);
    },
    allToken: function() {
      this.transferValue = this.token.balance;
    }
  }
};
</script>

<style scoped>

.modal-open {
  bottom: 0;
  opacity: 1;
}

.modal-close {
  bottom: -100vh;
  opacity: 0;
}

.modal {
  margin: 0px auto;
  background-color: rgba(0, 0, 0, 0.16);
  transition: all 0.5s ease;
  position: fixed;
  left: 0;
  right: 0;
  height: 100vh;
}

.modal-container {
  color: #333333;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  padding: 15px 15px 15px 15px;
  border-radius: 10px 10px 0 0;
}

.modal-title {
  font-size: 20px;
  margin-bottom: 30px;
  color: #007AFF;
}

.send-btn {
  background: #007AFF;
  width: 100%;
  border-radius: 5px;
  border: none;
  color: #ffffff;
  padding: 15px;
  font-size: 15px;
  text-transform: uppercase;
  font-weight: 600;
  outline: none;
}

.close-btn {
  position: absolute;
  right: 5px;
  top: 5px;
  padding: 10px;
  opacity: 0.7;
  outline: none;
}

.input-group {
  margin-bottom: 20px;
}

.input-group__input {
  width: calc(100% - 30px);
  border: 1px solid rgba(0, 0, 0, 0.16862745098039217);
  padding: 12px 15px;
  font-size: 17px;
  font-weight: 600;
  border-radius: 5px;
  outline: none;
  background: rgba(0, 0, 0, 0.03137254901960784);
}

.input-group-wrap {
  position: relative;
}

.send-all-btn {
  position: absolute;
  right: -2px;
  top: 0px;
  bottom: 0px;
  background: #007aff;
  font-size: 15px;
  border-radius: 0 5px 5px 0;
  border: none;
  color: #ffffff;
  padding: 0 20px;
  font-weight: 600;
  outline: none;
}

.error-msg {
  color: #FF3B30;
  text-align: center;
  margin-bottom: 10px;
}
</style>