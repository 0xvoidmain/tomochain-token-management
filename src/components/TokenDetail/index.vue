<template>
  <div v-if="token" id="tokendetail" style="padding: 15px;">
    <div class="container" style="font-size: 25px">
      <div v-if="token" class="token-symbol">{{token.name}}</div>
    </div>
    <div class="token-header">
      <!-- <div class="container">
        <img v-if="token.icon" class="icon" :src="token.icon">
        <div v-else class="icon">{{token.symbol[0]}}</div>
      </div>-->
      <div class="container">
        <div class="amount" style="font-size: 40px">{{parseFloat(tokenBalance).toFixed(2)}}</div>
        <div
          style="font-family: SFProText,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif; color: #cfcde1; text-align: center;"
        >{{token.symbol}}</div>
      </div>
    </div>
    <div class="exchange__button-container common__fade-in">
      <div class="exchange__button common__button-gradient" @click="showModal = true">Send</div>
    </div>
    <h4 style="color: #fff; margin-bottom: 10px;">Transactions:</h4>
    <transaction style="padding-bottom: 30px"/>
    <transferModal v-if="showModal" @close="showModal = false"></transferModal>
  </div>
</template>

<script>
import store from "../../store";
import { constants } from "fs";
import contract from "./contract";
import transferModal from "./transferModal";
import transaction from "./transaction";
import { debuglog } from "util";
export default {
  name: "TokenDetail",
  beforeCreate() {
    if (!store.data.address) {
      window.addEventListener("load", () => {
        const checkAddr = store.login();
        if (checkAddr !== "undefined") {
          store.loadTokens(1, 15);
        }
      });
    }
  },
  components: {
    transferModal,
    transaction
  },
  data() {
    return {
      token: null,
      tokenBalance: 0,
      zeroTomo: false,
      showModal: false
    };
  },
  async created() {
    this.getTokens();
  },
  methods: {
    getTokens: async function() {
      this.token = await store.getToken(this.$route.params.address);
      let loadTokenBalance = setInterval(async () => {
        this.token = await store.getToken(this.$route.params.address);
        contract.getTokenBalance(this.$route.params.address, balance => {
          this.tokenBalance = balance;
        });
      }, 1000);
      let loadAccountBalance = contract.getAddressBalance(balance => {
        if (balance === 0) this.zeroTomo = true;
      });
    }
  }
};
</script>

<style scoped>
.token-symbol {
  text-align: center;
  padding: 15px 15px 0;
  color: #cfcde1;
  font-family: SFProText, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
  padding-bottom: 10px;
}

div.icon {
  text-align: center;
  font-weight: 900;
  height: 30px;
  line-height: 30px;
  background: #678be0;
  border-radius: 25px;
  color: #fff;
  width: 30px;
  margin: 15px auto;
}

.amount {
  text-align: center;
  font-weight: 600;
  color: #30ddd8;
}

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
  padding: 0 15px;
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
  width: 245px;
  text-align: center;
  box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.16);
  background: linear-gradient(180deg, #36cef9, #279df4) 0 100%;
  background-size: auto 150%;
  cursor: pointer;
  transition: all 0.3s;
}

.token-header {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 25px 15px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  margin-bottom: -10px;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
}
</style>