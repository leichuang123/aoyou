<template>
  
    <v-dialog
      v-model="dialog"
      max-width="350"
      @click:outside="overlayclick"
      >
      <div class="agreement">
        <div class="close" @click="close"></div>
        <div class="title">
          <img class="icon" src="@/assets/images/mall/shengjitishi.png" />
          升级须知
        </div>
        <div class="msgs">
          <div>1.升级后的主机不支持降低配置。</div>
          <div>2.升级价格=主机差价*主机剩余时长。</div>
          <div>3.不足一天按照一天计算。</div>
        </div>
        <div class="center">
          <div class="btn" @click="sure">下一步</div>
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
.agreement {
  padding: 30px;
  min-height: 287px;
  background: #fff;
  position: relative;
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
  .title {
    display: flex;
    align-items: center;
    font-size: 24px;
    color: #444444;
    .icon {
      width: 30px;
      margin-right: 10px;
    }
  }
  .msgs {
    font-size: 14px;
    line-height: 30px;
    color: #555555;
    margin-top: 26px;
    padding-bottom: 48px;
  }
  .center {
    text-align: center;
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
  }
}
</style>