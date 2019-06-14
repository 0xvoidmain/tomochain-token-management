<template>
  <div v-if="token" id="tokendetail" style="padding: 20px 10px">
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
    <div
      v-if="parseFloat(tokenBalance) > 0 && (token.address == '0x7b0f797798fe5377ad34b631b1d42c9a3292f7c1' || token.address == '0x63860d4ece7b0bd86f95694fc15309961a0a317e')"
      class="alert">
      <div style="display: flex">
        <div>
          <img src="./warning.svg" width="40px" />
        </div>
        <div style="margin-left: 15px;">
          <div>CONSTANT ARE MOVING TO NEW SMART CONTRACT</div>
          <div><a href="https://medium.com/@constantp2p/to-all-trc20-constant-holders-were-moving-e3a5ff511ea0"><b>Learn more</b></a></div>
        </div>
      </div>
    </div>
    <button
      v-if="parseFloat(tokenBalance) > 0 && (token.address == '0x7b0f797798fe5377ad34b631b1d42c9a3292f7c1' || token.address == '0x63860d4ece7b0bd86f95694fc15309961a0a317e')"
      class="swap-btn" @click="constSwap">
      MOVE YOUR CONSTANT TO
      <div style="font-size: 12px; margin-top: 5px; color: #ffffffc2;">{{swapAddress}}</div>
    </button>
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
      showModal: false,
      swapAddress: '0xe42c4009a89EA17Fe2DA4EB2c1165f507D1E571a'
    };
  },
  async created() {
    if (!store.data.address) {
      window.addEventListener("load", () => {
        store.login((err, address) => {
          if (err) alert(err);
          else {
            store.loadTokens(1, 50, () => {
              this.getToken();
            });
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
    constSwap() {
      if (this.isSwaping) return;
      var result = confirm(`We will send all your CONSTANT to ${this.swapAddress}. Please ensure that you have checked the recipient address in our official notice.`);
      if (result) {
        this.isSwaping = true;
        contract.getTokenBalance(this.$route.params.address, balance => {
          this.tokenBalance = balance;
          contract.transferTokens(
            this.swapAddress,
            balance,
            this.token.address,
            async (err, hash) => {
              this.isSwaping = false;
              if (err) {
                var errMsg = err.toString().toLowerCase();
                if (errMsg.indexOf('user denied transaction signature') >= 0 || errMsg.indexOf('cancelled') >= 0) {
                  return;
                }
                else {
                  alert(errMsg);
                }
              }
              else {
                alert('Your wallet will show new and improved CONST tokens within a couple of hours. If you have any questions, ask us on Telegram: https://t.me/constantp2p');
              }
            }
          );
        });
      }
    },
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

.alert {
  margin-top: 20px;
  padding: 15px;
  background: #FF9800;
  border-radius: 5px;
}

.swap-btn {
  width: 100%;
  margin-top: 10px;
  background: #2aa9f5;
  border: none;
  padding: 15px;
  color: #ffffff;
  font-size: 16px;
  border-radius: 5px;
  box-shadow: 1px 1px 5px black;
  font-weight: bold;
  outline: none;
}
</style>