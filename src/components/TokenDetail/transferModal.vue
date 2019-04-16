<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="exchange">
            <div class="exchange__container">
              <div class="input-group">
                <div style="color: #868f9b; text-align: right" @click="$emit('close')">x</div>
                <div class="input-group__title" style="display: flex;">Send:</div>
                <div class="input-group__wrapper">
                  <input
                    class="input-group__input input-group__input-swap"
                    type="text"
                    placeholder="0"
                    v-model="transferValue"
                  >
                  <div v-on:click="allToken()" style="color: #3dbeff;">All</div>
                </div>
                <div class="input-group__info input-group__info-address"></div>
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
              <div v-if="validated() === false" class="exchange__button-container common__fade-in">
                <div
                  class="exchange__button common__button-gradient"
                  style="opacity: 0.2"
                >Transfer Now</div>
              </div>
              <div v-else class="exchange__button-container common__fade-in">
                <div
                  class="exchange__button common__button-gradient"
                  v-on:click="transfer()"
                >Transfer Now</div>
              </div>
              <h5 v-if="zeroTomo" style="color: red; margin-left: 37px;">Can't transfer without TOMO</h5>
              <!-- <h5 style="color: gray; text-align: center" @click="$emit('close')">Back</h5> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import store from "../../store";
import { constants } from "fs";
import contract from "./contract";
export default {
  data() {
    return {
      token: null,
      transferValue: "",
      recipientAddress: "",
      tokenBalance: 0,
      zeroTomo: false
    };
  },
  // props: {
  //   token: Object,
  //   tokenBalance: Number,
  //   zeroTomo: Boolean,
  // },
  async created() {
    this.token = await store.getToken(this.$route.params.address);
    let loadTokenBalance = setInterval(() => {
      contract.getTokenBalance(this.$route.params.address, balance => {
        this.tokenBalance = balance;
      });
    }, 2000);
    let loadAccountBalance = contract.getAddressBalance(balance => {
      if (balance === 0) this.zeroTomo = true;
    });
  },
  methods: {
    transfer: function() {
      let result = contract.transferTokens(
        this.recipientAddress,
        this.transferValue,
        this.token.address,
        async (err, hash) => {
          // alert(hash);
        }
      );
    },
    validated: function() {
      if (
        this.zeroTomo ||
        this.transferValue > this.token.balance ||
        !this.isNumeric(this.transferValue) ||
        this.transferValue === "" ||
        this.recipientAddress === "" ||
        store.checkAddress(this.recipientAddress) !== true
      ) {
        return false;
      } else {
        return true;
      }
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
.exchange {
  box-sizing: border-box;
  display: block;
  font-family: Montserrat, sans-serif;
}

.exchange__container {
  margin-bottom: 30px;
}

.exchange__container.diabled {
  margin-bottom: 30px;
  opacity: 0.2;
}

.input-group {
}

.input-group__title {
  font-size: 16px;
  font-weight: 500;
  color: #3dbeff;
  padding-left: 10px;
  margin-bottom: 13px;
}

.input-group__wrapper {
  padding: 14px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 30px;
  border: 2px solid transparent;
  background-color: #29315b;
  transition: all 0.3s;
}

.token-selector {
  display: flex;
}

.input-group__info-address {
  margin-bottom: 25px;
  display: block;
}

.input-group__info {
  height: 22px;
  font-size: 14px;
  font-weight: 500;
  color: #8690ad;
  padding: 0 25px;
  position: relative;
  display: -webkit-flex;
  display: flex;
  -webkit-align-items: flex-start;
  align-items: flex-start;
}

.input-group__input-swap {
  width: calc(100% - 100px);
}

.input-group__input {
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 31px;
  outline: none;
  border: none;
  width: 100%;
  font-weight: 500;
  color: #caccd9;
  background-color: #29315b;
  transition: padding 0.3s;
}

.input-group__input--full {
  width: 100% !important;
  text-align: left;
}

.exchange__button-container {
  text-align: center;
}

.common__fade-in {
  transform: translateY(10px);
  animation: fade-in 0.3s forwards;
}

.exchange__button {
  margin-top: 25px;
}

.common__button-gradient {
  font-size: 18px;
  font-weight: 500;
  color: #fff;
  border-radius: 30px;
  display: inline-block;
  padding: 16px 10px;
  width: 159px;
  text-align: center;
  box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.16);
  background: linear-gradient(180deg, #36cef9, #279df4) 0 100%;
  background-size: auto 150%;
  cursor: pointer;
  transition: all 0.3s;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 258px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #191d34;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
</style>