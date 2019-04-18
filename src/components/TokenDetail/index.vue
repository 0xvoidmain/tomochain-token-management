<template>
  <div v-if="token" id="tokendetail" style="padding: 0 15px 15px 15px;">
    <div class="navbar">
      <div class="navbar-container">
        <button class="back-btn" @click="back">
          <img src="./back.svg" width="20px">
        </button>
      </div>
    </div>
    <div class="token-header">
      <div class="container" style="font-size: 25px">
        <div v-if="token" class="token-symbol">{{token.name}}</div>
      </div>
      <div class="container">
        <div class="amount" style="font-size: 40px">
          {{parseFloat(tokenBalance).toFixed(2)}}
          <span style="color: #cfcde1; font-size: 20px">{{token.symbol}}</span>
        </div>
      </div>
    </div>
    <div class="exchange__button-container common__fade-in">
      <div class="exchange__button common__button-gradient" @click="showModal = true">Send</div>
    </div>
    <transaction :token="token" style="padding-bottom: 100px"/>
    <transferModal :show="showModal" :token="token" :balance="tokenBalance" @close="showModal = false"></transferModal>
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
    if (!store.data.address) {
      window.addEventListener("load", () => {
        store.login((err, address) => {
          if (err) alert(err);
          else {
            store.loadTokens(1, 50);
            this.getToken();
          }
        });
      });
    }
    else {
      this.getToken();
    }
  },
  destroyed() {
    clearInterval(this.loadTokenBalance);
  },
  methods: {
    back() {
      this.$router.back();
    },
    getToken: async function() {
      this.token = await store.getToken(this.$route.params.address);
      contract.getTokenBalance(this.$route.params.address, balance => {
        this.tokenBalance = balance;
      });
      this.loadTokenBalance = setInterval(async () => {
        this.token = await store.getToken(this.$route.params.address);
        contract.getTokenBalance(this.$route.params.address, balance => {
          this.tokenBalance = balance;
        });
      }, 2000);
      let loadAccountBalance = contract.getAddressBalance(balance => {
        if (balance === 0) this.zeroTomo = true;
      });
    }
  }
};
</script>

<style scoped>
.token-symbol {
  color: #ffffff;
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
  font-weight: 600;
  color: rgb(76, 217, 100);
}

.exchange__button-container {
  text-align: center;
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
}

.common__fade-in {
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
  margin-top: 5px;
  padding: 15px 15px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.05);
}

.navbar {
  height: 60px;
}
.navbar-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 50px;
  padding-top: 10px;
  background: #262c4e;
  z-index: 999;
}

.back-btn {
  padding: 10px;
  outline: none;
  background: transparent;
  border: none;
  padding: 13px;
}
</style>