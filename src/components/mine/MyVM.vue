<template>
  <div class="vm" v-if="info">
    <img class="cover" :src="getCover" :alt="info.productPictureVOList[0].productNo">
    <div class="part-1">
      <p class="name">{{info.productInfoVO.name}}</p>
      <!-- <p class="version">{{info.productInfoVO.instructions}}</p> -->
    </div>
    <ul class="time-list">
      <li class="time-item">购买时间：{{info.durationOrderVO.createTime}}</li>
      <li class="time-item">到期时间：{{info.durationOrderVO.dueTime}}</li>
    </ul>
    <div class="btn-group">
      <!-- <button class="btn cancel">删除</button> -->
      <button class="btn confirm" @click="reNew()">
        <img src="@/assets/images/icon/icon-10.png">
        <span>续费</span>
      </button>
    </div>
    <ReNew v-if="isShowReNewDialog" :payInfo="reNewInfo" @close="closeRenew" @paySuccess="paySuccess"/>
  </div>
</template>

<script>
import { IMAGE_PREFIX } from "@/config/public_config"
import ReNew from '@/views/mall/components/ReNew.vue'
import store from '@/store/index'
export default {
  name: "MyVM",
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data () {
    return {
      isShowReNewDialog: false,
      reNewInfo: null,
    }
  },
  components: {
    ReNew
  },
  computed: {
    getCover() {
      return `${IMAGE_PREFIX}${this.info.productPictureVOList[0].url}`
    }
  },
  methods: {
    closeRenew () {
      this.isShowReNewDialog = false
    },
    reNew () {
      this.reNewInfo = {
        productName: this.info.productName,
        config: this.info.vmInfoVO.cpu + 'cpu,' + this.info.vmInfoVO.memory + '内存,' +  this.info.vmInfoVO.graphicsMemoryName + '显存',
        timeChargeId: this.info.productInfoVO.timeChargeId,
        productNo: this.info.productInfoVO.productNo,
        machineKey: this.info.durationOrderVO.machineKey,
        shortcutDurationVOList: this.info.productInfoVO.shortcutDurationVOList
      }
      this.isShowReNewDialog = true
    },
    paySuccess () {
      this.isShowReNewDialog = false
      this.$message.success('续费成功')
      store.dispatch('updateUserInfo',{token: store.getters.getToken})
      this.$emit('refreshList')
    }
  }
}
</script>

<style lang="less" scoped>
.vm{
  width: 320px;
  height: 420px;
  background: #FBFBFB;
  border: 1px solid #EDEDED;
  box-shadow: inset 0 1px 10px 0 rgba(237,236,236,0.50);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 10px;
  .cover{
    height: 132px;
    max-width: 300px;
    margin-bottom: 25px;
  }
  .part-1{
    display: flex;
    margin-bottom: 30px;
    .name{
      font-size: 18px;
      height: 26px;
      line-height: 26px;
      color: #132B49;
      margin-right: 12px;
    }
    .version{
      padding: 0 10px;
      height: 26px;
      line-height: 26px;
      border: 1px solid #999999;
      border-radius: 4px;
    }
  }
  .time-list{
    height: 80px;
    font-size: 14px;
    color: #454955;
    .time-item{
      height: 18px;
      line-height: 18px;
      font-size: 14px;
      color: #454955;
    }
  }
  .btn-group{
    display: flex;
    .btn{
      margin: 0 10px;
      width: 92px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      border-radius: 16px;
      img{
        width: 15px;
        margin-right: 8px;
      }
    }
    .cancel{
      border: 1px solid #DFDFDF;
      color: #B0B0B0;
    }
    .confirm{
      background-image: linear-gradient(90deg, #11A0FE 0%, #5CC0FF 100%);
      border-radius: 32px;
      color: #fff;
    }
  }
}
</style>