<template>
  
    <v-dialog
      v-model="dialog"
      max-width="400"
      @click:outside="overlayclick"
      >
      <div class="agreement-html">
        <div class="close" @click="close"></div>
        <iframe 
          class="iframe"  
          frameborder="no" 
          border="0" 
          marginwidth="0" 
          marginheight="0" 
          scrolling="yes" 
          src="https://yunnybox.yunzhiqu.com/upgrade_agreement.html" />
        <div class="center">
          <div class="btn" @click="sure">我知道了</div>
        </div>
      </div>
    </v-dialog>
 
</template>

<script>

export default {
  name: 'Agreement',
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
.agreement-html {
  padding: 30px;
  height: 590px;
  box-sizing: border-box;
  padding-bottom: 70px;
  background: #fff;
  position: relative;
  &::-webkit-scrollbar {
    display: none;
  }
  .close {
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;
    height: 40px;
    background-image: url('../../../assets/images/icon/guanbi.png');
    // background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    cursor: pointer;
    background-size: 40%;
  }

  .iframe {
    width: 100%;
    height: 100%;
  }

  .btn {
    margin: 0 auto;
    background-image: linear-gradient(270deg, #5CC0FF 0%, #11A0FE 100%);
    border-radius: 25px;
    width: 125px;
    height: 40px;
    line-height: 40px;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    position: absolute;
    bottom: 15px;
    left: 50%;
    margin-left: -63px;
    text-align: center;
  }
}
</style>