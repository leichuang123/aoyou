<template>
  
    <div class="cnt" v-if="item !== null" :style="{width: layoutModel === 0 ? '780px' : 'auto'}">
      <div class="base-info" :style="{width: layoutModel === 0 ? '416px' : '350px'}">
        <div class="renew-info">
          <div :class="['renew', item.durationOrderVO.dueTime < item.currentTime ? 'renew-active' : '']" @click="reNew(item)" >
            <img src="@/assets/images/mall/icon-17.png" />
            <span>主机续费</span>
          </div>
          <div class="msg" v-if="new Date(item.durationOrderVO.dueTime).getTime() - new Date(item.currentTime).getTime() < 15 * 24 * 60 * 60 * 1000">
            {{new Date(item.durationOrderVO.dueTime).getTime() - new Date(item.currentTime).getTime() > 0 ? '您的主机即将到期，请及时续费' : '您的主机已到期，请续费后使用。若7天后未续费，我们将回收主机，并清除所有文件。'}}
          </div>
        </div>
        
        <div class="cover" ></div>
        <div class="startingup" :style="{opacity: startingUpMahineKey === item.durationOrderVO.machineKey ? 1 : 0}">
          虚拟机正在开机需要1~2分钟，请稍作等待
        </div>
        <div class="vm-name">
          {{item.productName}}
          <div class="update-version" @click="showUpdate = true" v-if="item.durationOrderVO.channelNo === 1 && item.isUpgrade">
            <img src="../../../assets/images/icon/shengji.png" alt="">
            升级
          </div>
        </div>
        <div class="time-info">
          <img src="@/assets/images/mall/icon-18.png" />
          <span>购买时间：{{item.durationOrderVO.createTime}}</span>
        </div>
        <div class="time-info end-time">
          <img src="@/assets/images/mall/icon-19.png" />
          <span>到期时间：{{item.durationOrderVO.dueTime}}</span>
        </div>
        <div class="btns" :class="[layoutModel === 0 ? 'btn-swiper' : 'btn-line']">
          <div class="connect btn" @click="showConnectWaring(item)">
            <img src="@/assets/images/mall/icon-20.png" />
            <span>连接</span>
          </div>
          <div class="reboot btn" @click="showRebootWaring(item)">
            <span>重&nbsp;&nbsp;启</span>
          </div>
          <div class="reset btn" @click="showResetWaring(item)">
            <span>一键还原</span>
          </div>
        </div>
        <div class="switch-detail" v-if="layoutModel === 1" @click="switchDetail">
          主机详情&gt;&gt;
        </div>
      </div>
      <UpdataVm :vmInfo="item" v-if="showUpdate" @onClose="showUpdate = false" @onChange="updataVmOnChange" />
      <UpdatePay ref="updatepay" />
      <template v-if="!showUpdate">

      
        <div class="specs" 
        :style="{width: layoutModel === 0 ? '354px' : '314px'}" 
        v-if="layoutModel === 0 || (layoutModel === 1 && item.showDetail)">
          <div class="item">
            <div class="label">
              配置参数
            </div>
            <div class="value">
              {{ item.vmInfoVO.cpu + 'vcpu' }}, {{item.vmInfoVO.memory + 'G内存'}},{{ item.vmInfoVO.graphicsMemoryName + '显存'}}
            </div>
          </div>
          <div class="item">
            <div class="label">
              预装软件
            </div>
            <div class="value">
              {{item.preinstallSoftwareVOList.map(item => {
                return item.name
              }).join(',')}}
            </div>
          </div>
          <div class="item">
            <div class="label">
              存储说明
            </div>
            <div class="value">
              {{ item.vmInfoVO.instructions }}
            </div>
          </div>
          <div class="item">
            <div class="label">
              操作系统
            </div>
            <div class="value">
              {{item.vmInfoVO.operateSystemName}}
            </div>
          </div>
        </div>
      </template>

    <ReNew v-if="isShowReNewDialog" :payInfo="reNewInfo" @close="closeRenew" @paySuccess="paySuccess"/>
    <UpdatePay />
    <ConnectWaring 
      v-if="isShowConnectWaring" 
      :msgs="connectWaringMsgs" 
      btnText="我知道了" 
      @sure="connect" 
      @close="hideConnectWaring"
    />
    <RebootWaring
      v-if="isShowRebootWaring"
      :msgs="rebootWaringMsgs" 
      btnText="确认重启"
      @sure="reboot"
      @close="hideRebootWaring"
     />
    <ResetWaring
      v-if="isShowResetWaring"
      :msgs="resetWaringMsgs" 
      btnText="确认还原"
      @sure="reset"
      @close="hideResetWaring"
     />
  

    </div>
 
</template>

<script>
import ReNew from '../components/ReNew.vue'
import Waring from '../components/Waring.vue'
import UpdataVm from './UpdataVm'
import UpdatePay from './UpdatePay'

import store from '@/store/index'
import {
  getVmStatus,
  vmRestart,
  vmReset,
} from '@/server/api.js'
export default {
  name: 'Waring',
  data () {
    return {
      showUpdate: false,
      isShowReNewDialog: false,
      reNewInfo: null,
      isShowConnectWaring: false,
      operateItem: null,
      connectWaringMsgs: [{
        text: '云主机',
        color: '#000'
      },{
        text: '断开连接30分钟',
        color: 'red'
      },{
        text: '后会自动关机，请注意保存相关文件，防止数据丢失！',
        color: '#000'
      }],
      isShowRebootWaring: false,
      rebootWaringMsgs: [{
        text: '主机重启过程预计耗时3分钟。',
        color: '#000'
      },{
        text: '如有未保存的数据，请保存后再重启，以免造成数据丢失。',
        color: 'red'
      }],
      isShowResetWaring: false,
      resetWaringMsgs: [{
        text: '主机还原将清除系统内所有数据，只保留【个人云盘】下的数据。',
        color: '#000'
      },{
        text: '请先确认重要数据已保存至您的【个人云盘】，以免造成数据丢失。',
        color: 'red'
      }],
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return null
      }
    },
    layoutModel: {
      type: Number,
      default: () => {
        return 0
      }
    },
    index: {
      type: Number,
      default: () => {
        return 0
      }
    },
    startingUpMahineKey: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  components: {
    ReNew,
    UpdataVm,
    UpdatePay,
    ConnectWaring: Waring,
    RebootWaring: Waring,
    ResetWaring: Waring,
  },
  methods: {
    updataVmOnChange(val) {
      // this.$refs.updatepay.init(val)
      // console.log("22222222", val)
      // this.$emit('updataVmOnChange2', val)
      this.$refs.updatepay.init(val)
    },
    update() {
      this.$emit('update', this.vmInfo);
    },
    showResetWaring (info) {
      this.operateItem = info
      this.isShowResetWaring = true
    },
    hideResetWaring () {
      this.operateItem = null
      this.isShowResetWaring = false
    },
    showRebootWaring (info) {
      this.operateItem = info
      this.isShowRebootWaring = true
    },
    hideRebootWaring () {
      this.operateItem = null
      this.isShowRebootWaring = false
    },
    showConnectWaring (info) {
      this.operateItem = info
      this.isShowConnectWaring = true
    },
    hideConnectWaring () {
      this.operateItem = null
      this.isShowConnectWaring = false
    },
    async reset () {
      let machineKey = this.operateItem.durationOrderVO.machineKey
      this.$Spin.show()
      let status = await getVmStatus({
        machineKey
      })
      this.$Spin.hide()
      if (status.code !== 200) {
        this.$message.error(status.message)
        return
      }
      let reset = await vmReset({
        machineKey
      })
      if (reset.code !== 200) {
        this.$message.error(reset.message)
        return
      }
      this.isShowResetWaring = false
      this.$emit('reset', machineKey)
    },
    async reboot () {
      let machineKey = this.operateItem.durationOrderVO.machineKey
      this.$Spin.show()
      let status = await getVmStatus({
        machineKey
      })
      this.$Spin.hide()
      if (status.code !== 200) {
        this.$message.error(status.message)
        return
      }
      let restart = await vmRestart({
        machineKey,
        oprMode: 'soft',
      })
      if (restart.code !== 200) {
        this.$message.error(restart.message)
        return
      }
      this.isShowRebootWaring = false
      this.$router.push(`/mall/loading?user_name=${machineKey}&type=3&machineName=${this.operateItem.durationOrderVO.machineName}`)
    },
    connect () {
      let prefix = process.env.VUE_APP_BUILD_ENV === 'test' ? 'http://192.168.7.245:8080' : 'https://yunnyweb.yunzhiqu.com'
      window.location.href = `${prefix}/h5connect/index.html?machineKey=${this.operateItem.durationOrderVO.machineKey}&token=${this.$store.state.token}&backUrl=${encodeURIComponent(window.location.href)}&channelNo=2`
      // this.$router.push(`/mall/loading?type=2&user_name=${this.operateItem.durationOrderVO.machineKey}`)
    },
    closeRenew (isRefresh = false) {
      this.isShowReNewDialog = false
      if (isRefresh) {
        this.getList()
      }
    },
    reNew (info) {
      this.reNewInfo = {
        productName: info.productName,
        config: info.vmInfoVO.cpu + 'cpu,' + info.vmInfoVO.memory + '内存,' +  info.vmInfoVO.graphicsMemoryName + '显存',
        timeChargeId: info.productInfoVO.timeChargeId,
        productNo: info.productInfoVO.productNo,
        machineKey: info.durationOrderVO.machineKey,
        shortcutDurationVOList: info.productInfoVO.shortcutDurationVOList
      }
      this.isShowReNewDialog = true
    },
    switchDetail () {
      this.$emit('switchDetail', this.index)
    },
    paySuccess () {
      this.isShowReNewDialog = false
      this.$message.success('续费成功')
      store.dispatch('updateUserInfo',{token: store.getters.getToken})
      this.$emit('refreshList')
    },
  }
}
</script>

<style lang="less" scoped>
.cnt {
    display: flex;
    align-items: center;
    .base-info {
      background: rgba(251, 251, 251, .7);
      border: 1px solid #EDEDED;
      box-shadow: inset 0 1px 10px 0 rgba(237,236,236,0.50);
      border-radius: 12px;
      position: relative;
      text-align: center;
      box-sizing: border-box;
      padding-top: 86px;
      height: 518px;
      .renew-info {
        position: absolute;
        top: 16px;
        left: 20px;
        display: flex;
        align-items: center;
        .renew {
          width: 113px;
          height: 35px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient( #FBFBFB 50%, #F0F0F0 99%, #EFEFEF 100%);
          border: 1px solid #EEEEEE;
          border-radius: 32px;
          font-size: 16px;
          color: #b0b0b0;
          cursor: pointer;
          img {
            width: 15px;
            margin-right: 6px;
          }
        }
        
        .renew-active {
          background-image: linear-gradient(270deg, #EDD29C 0%, #F4D7A4 100%);
          color: #572F1D;
        }
        .msg {
          font-size: 12px;
          color: #572F1D;
          margin-left: 10px;
          line-height: 18px;
          text-align: left;
        }
      }
      .cover {
        margin: 0 auto;
        width: 214px;
        height: 132px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
        background-image: url('../../../assets/images/mall/vm.png')
      }
      .startingup {
        margin: 0 auto;
        font-size: 12px;
        color: #FFFFFF;
        width: 245px;
        text-align: center;
        background: #19A5FE;
        border-radius: 14px;
        // margin-top: 18px;
        margin-bottom: 34px;
      }
      .name {
        font-size: 18px;
        color: #132B49;
        padding-top: 4px;
        padding-bottom: 36px;
      }
      .time-info {
        margin-top: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #454955;
        img {
          width: 12px;
          margin-right: 8px;
        }
      }
      .end-time {
        margin-top: 11px;
      }
      .btns {
        display: flex;
        align-items: center;
        justify-content: space-around;
        .btn {
          width: 92px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          font-size: 14px;
          border: 1px solid #DFDFDF;
          color: #B0B0B0;
          border-radius: 32px;
          cursor: pointer;
        }
        
        .connect {
          background-image: linear-gradient(90deg, #11A0FE 0%, #5CC0FF 100%);
          
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          img {
            width: 15px;
            margin-right: 9px;
          }
        }
        
      }
      .btn-swiper {
        padding: 70px 40px 50px 40px;
      }
      .btn-line {
        padding: 50px 27px 0 27px;
      }
    }
    .specs {
      height: 464px;
      background: rgba(243, 244, 246, 0.7);
      border-radius: 0 10px 10px 0;
      box-sizing: border-box;
      padding: 30px 40px;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
      -ms-overflow-style: none;
      .item{
        margin-top: 40px;
        .label {
          font-size: 16px;
          color: #888888;
          text-align: left;
        }
        .value {
          font-size: 14px;
          line-height: 20px;
          color: #444444;
          margin-top: 14px;
          text-align: left;
        }
      }
    }
    .switch-detail {
      text-align: center;
      font-size: 14px;
      color: #666666;
      padding-top: 27px;
      padding-bottom: 30px;
      cursor: pointer;
    }
    
  }
  .vm-name{
    display: flex;
  justify-content: center;
  }
  .update-version{
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 26px;
  line-height: 26px;
  width: 67px;
  // padding: 0 20px;
  background: #11A0FE;
  border-radius: 13px;
  font-size: 14px;
  color: #fff;
  margin-left: 12px;
  img{
    width: 13px;
    height: 16px;
    flex-grow: 0;
    flex-shrink: 0;
    margin-right: 4px;
  }
}
</style>