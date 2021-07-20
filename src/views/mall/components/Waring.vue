<template>
  
    <v-dialog
      v-model="dialog"
      max-width="470"
      @click:outside="overlayclick"
      >
      <div class="waring">
        <div class="close" @click="close"></div>
        <img class="waring-icon" v-if="!hideWaringIcon" src="@/assets/images/public/jinggao-6.png" />
        <div class="msg">
          <span v-for="(item, index) in msgs" :key="index" :style="{color: item.color || '#000'}">
            {{item.text}}
          </span>
        </div>
        <div class="btn" @click="sure">{{btnText}}</div>
      </div>
    </v-dialog>
 
</template>

<script>

export default {
  name: 'Waring',
  data () {
    return {
      dialog: true,
    }
  },
  props: {
    msgs: {
      type: Array,
      default: () => {
        return []
      }
    },
    btnText: {
      type: String,
      default: () => {
        return '确定'
      }
    },
    hideWaringIcon: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  methods: {
    overlayclick () {
      this.$emit('close')
    },
    sure () {
      this.$emit('sure')
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.waring {
  padding: 46px 60px 30px;
  min-height: 73px;
  background: #fff;
  box-shadow: 0 2px 6px 0 rgba(26,38,52,.21);
  border-radius: 10px;
  position: relative;
  text-align: center;
  .close {
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;
    height: 40px;
    background-image: url('../../..//assets/images/public/close.png');
    // background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    cursor: pointer;
  }
  .waring-icon {
    width: 45px;
  }
  .msg {
    margin-top: 30px;
    font-size: 18px;
    line-height: 27px;
    max-width: 354px;
    text-align: left;
  }
  .btn {
    margin: 0 auto;
    background-image: linear-gradient(90deg,#2aa1df,#94d5f3);
    border-radius: 32px;
    width: 166px;
    height: 64px;
    line-height: 64px;
    color: #fff;
    font-size: 20px;
    margin-top: 42px;
    cursor: pointer;
  }
}
</style>