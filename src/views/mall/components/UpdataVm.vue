<template>
  <div class="updata">
    <div class="close" @click="onClose"></div>
    <div class="vm-config">
      <p class="vc-label">原主机配置：</p>
      <p class="vc-content" v-if="vmInfo">
        {{vmInfo.vmInfoVO.cpu}}VCPU / 
        {{vmInfo.vmInfoVO.memory}} GB 内存 /
        {{vmInfo.vmInfoVO.graphicsMemoryName}} 显存/
        {{vmInfo.vmInfoVO.hardDiskName}} 硬盘
      </p>
    </div>
    <div class="u-tip">(您可自主选择升级方案)</div>
    <p class="u-line"></p>
    <div class="update-content">
      <p class="uc-label">主机升级方案:</p>
      <template v-if="dataList.length > 0">
        <ul class="uc-list">
          <li class="uc-item" :class="{'actived' : item.upgradeId === activedItem.upgradeId}" @click="activeItem(item)" v-for="(item, index) of dataList" :key="index">
            <div class="uc-radio"></div>
            <div class="uc-itemcontent">
              <span>
                {{item.vmInfo.memory}}G内存；
                {{item.vmInfo.cpu}}VCPU；
              </span>
              <!-- <span>¥ 20000</span> -->
            </div>
          </li>
        </ul>
      </template>
      <div v-if="dataList.length <= 0" class="uc-list ul-center">
        <span>暂无可升级方案</span>
      </div>
    </div>
    
    <template v-if="dataList.length > 0">
      <button class="uc-confirm" @click="getPaymentAmount">确认</button>
      <div class="agreement">
        <input v-model="agreement" type="checkbox">
        <span class="label" @click="showAgreeHtml">升级协议</span>
      </div>
      <p class="uc-botton-tip">升级有效期时间与之前一致保持不变</p>
    </template>
    <UpgradeAgreement
      v-if="isShowAggreeWaring"
      @close="closeAggreeDialog" 
      @sure="getPaymentAmount"
      />
    <AgreementHtml 
      @close="closeAgreeHtml" 
      @sure="closeAgreeHtml"
      v-if="isShowAgreementHtml"
      />
  </div>
</template>

<script>
import {upgradePackageList, getPaymentAmount, queryDicList} from '@/server/api.js'
import UpgradeAgreement from './UpgradeAgreement.vue'
import AgreementHtml from './AgreementHtml.vue'
import { 
  SYSEM_DISK_ID,
  HARD_DISK_ID,
  GRAPHIC_MEMORY_ID,
  OPERATE_SYSTEM_ID,
} from '@/config/public_config.js'
export default {
  name: "Updata",
  props: {
    vmInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
   components: {
    UpgradeAgreement,
    AgreementHtml,
  },
  data() {
    return {
      dataList:[],
      activedItem: {},
      systemDiskList: [],
      hardList: [],
      graphicList: [],
      operateSystemList: [],
      isShowPayDialog: false,
      agreement: true,
      isShowAggreeWaring: false,
      isShowAgreementHtml: false,
      aggreeWaringMsgs: [{
        text: '升级配置,支持对当前实例的实例规格（CPU、内存）进行升级，升级后新配置将覆盖实例的整个生命周期，您需要支付从当前配置到升级新配置的差价（不足一小时按照一小时计算）。实例规格或经典网络类型实例的首次0Mbps带宽升级在您支付完成后需要通过ECS控制台或ECS API重启ECS实例，配置变更才能生效；通过其他方式重启实例无效。主机升级后不再支持降配置。',
        color: '#000'
      }],
    }
  },
  async mounted() {
    // await this.getDicList(SYSEM_DISK_ID)
    // await this.getDicList(HARD_DISK_ID)
    // await this.getDicList(GRAPHIC_MEMORY_ID)
    // await this.getDicList(OPERATE_SYSTEM_ID)
    this.upgradePackageList()
  },
  methods: {
    showAgreeHtml () {
      this.isShowAgreementHtml = true
    },
    closeAgreeHtml () {
      this.isShowAgreementHtml = false
    },
    showAgree () {
      
      this.isShowAggreeWaring = true
    },
    closeAggreeDialog () {
      this.isShowAggreeWaring = false
    },
    async getDicList (codeTypeNo) {
      return async resolve => {
        let res = await queryDicList({
          codeTypeNo,
          pageSize: 9999
        })
        if (!res || res.code !== 200) {
          resolve(true)
          return
        }
        switch (codeTypeNo) {
          // case PREPARE_SOFTWARE_ID:
          //   this.softwareList = res.data.dataList
          //   break;
          case SYSEM_DISK_ID:
            this.systemDiskList = res.data.dataList
            break;
          case HARD_DISK_ID:
            this.hardList = res.data.dataList
            break;
          case GRAPHIC_MEMORY_ID:
            this.graphicList = res.data.dataList
            break;
          case OPERATE_SYSTEM_ID:
            this.operateSystemList = res.data.dataList
            break;
          default:
            break;
        }
        resolve()
      }
    },
    // closePay () {
    //   this.isShowPayDialog = false
    // },
    async getPaymentAmount() {
      if (!this.agreement) {
        this.$message.error('请先同意升级协议')
        return
      }
      let params = {
        "upgradeNo":this.activedItem.upgradeNo,//升级虚机计费id(升级包ID)
        "upgradeChargeId": this.activedItem.timeCharge.id,//升级时长计费id(升级包的时长计费ID)
        "upgradeVmId": this.activedItem.vmInfo.id,  //升级虚机id不能为空（升级包的虚机）
        "nowChargeId": this.vmInfo.productInfoVO.timeChargeId,//用户当前虚机时长计费
        "orderNo": this.vmInfo.durationOrderVO.orderNo//用户当前虚机剩余天数
      }
      let response = await getPaymentAmount(params)
      if(response.code !== 200) {
        this.$message(response.message)
        return false
      }
      const payInfo = {
        machineKey: this.vmInfo.durationOrderVO.machineKey,
        upgradeNo: this.activedItem.upgradeNo,
        upgradeVmChargeId:this.activedItem.upgradeId,
        upgradeChargeId:this.activedItem.timeCharge.id,
        upgradeVmId: this.activedItem.vmInfo.id,

        productName: this.vmInfo.productName,
        productNo: this.vmInfo.productInfoVO.productNo,
        timeChargeId: this.vmInfo.productInfoVO.timeChargeId,
        shortcutDurationId: this.selectedTimeCardId, // ??
        // shortcutDurationName: shortcutDurationName,
        price:response.data,
        
        config: `${this.activedItem.vmInfo.memory}G 内存 /
                ${this.activedItem.vmInfo.cpu}VCPU / `,
        // config: `${this.activedItem.vmInfo.cpu}VCPU / 
        //   ${this.activedItem.vmInfo.systemDiskName} 系统盘 / 
        //   ${this.activedItem.vmInfo.hardDiskName} 硬盘 / 
        //   ${this.activedItem.vmInfo.graphicsMemoryName} 内存 / 
        //   ${this.activedItem.vmInfo.operateSystemName}`,
        // voucherID: this.selectedCoupon === null ? -1 : this.selectedCoupon.userCardId,
        // voucherType: this.selectedCoupon === null ? -1 : this.selectedCoupon.awardType,
        // discountAmount: this.selectedCoupon === null ? 0 : this.selectedCoupon.waiverAmount
        // discountAmount: this.getCouponPrice
      }
      // this.isShowPayDialog = true
      this.$emit('onChange', payInfo)
    },
    onClose() {
      this.$emit('onClose')
    },
    activeItem(item) {
      this.activedItem = item
    },
    async upgradePackageList() {
      const params = {
        machineKey: this.vmInfo.durationOrderVO.machineKey,
        productNo: this.vmInfo.durationOrderVO.productNo,
      }
      let response = await upgradePackageList(params)
      if(response.code !== 200 ) {
        console.log('获取失败')
        return false
      }
      if(!response.data) {
        response.data = []
      }
      // response.data.forEach(info => {
          
      //     this.graphicList.forEach(item => {
      //       if (item.serialNo === +info.vmInfo.graphicsMemory) {
      //         info.vmInfo.graphicsMemoryName = item.name
      //       }
      //     })
      //     this.operateSystemList.forEach(item => {
      //       if (item.serialNo === +info.vmInfo.operateSystem) {
      //         info.vmInfo.operateSystemName = item.name
      //       }
      //     })
      //     this.systemDiskList.forEach(item => {
      //       if (item.serialNo === +info.vmInfo.systemDisk) {
      //         info.vmInfo.systemDiskName = item.name
      //       }
      //     })
      //     this.hardList.forEach(item => {
      //       if (item.serialNo === +info.vmInfo.hardDisk) {
      //         info.vmInfo.hardDiskName = item.name
      //       }
      //     })
      //   })
      this.dataList = response.data
      this.activedItem = this.dataList[0]
    }
  }
}
</script>

<style lang="less" scoped>
.updata{
  background: rgba(251, 251, 251, .7);
  border-radius: 0px 10px 10px 0px;
  border: 1px solid #EDEDED;
  box-shadow: inset 0 1px 10px 0 rgba(237,236,236,0.50);
  width: 473px;
  height: 406px;
  position: relative;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  padding: 24px;
  .close{
    position: absolute;
    top: 0;
    right: 0;
    // width: 55px;
    // height: 55px;
    width: 35px;
    height: 35px;
    cursor: pointer;
    background: url("../../../assets/images/icon/guanbi.png") no-repeat center center;
    background-size: 15px 15px;
  }
}

.vm-config{
  display: flex;
  margin-bottom: 20px;
  .vc-label{
    width: 87px;
    flex-grow: 0;
    flex-shrink: 0;
    margin-right: 10px;
  }
  .vc-content{
    width: 265px;
  }
}
.u-tip{
  margin-bottom: 20px;
}
.u-line{
  width: 100%;
  height: 1px;
  background: #E8E8E8;
}
.update-content{
  padding-top: 20px;
  .uc-label{
    font-size: 16px;
    height: 22px;
    line-height: 22px;
    margin-bottom: 16px;
  }
  .uc-list{
    height: 150px;
    overflow-y: auto;
    
    .uc-item{
      height: 32px;
      display: flex;
      align-items: center;
      margin: 10px 0;
      
      cursor: pointer;
      .uc-radio{
        display: block;
        width: 16px;
        height: 16px;
        background: url("../../../assets/images/icon/zhujishengjiweixuanzhong.png") no-repeat;
        background-size: contain;
        margin-right: 10px;
      }
      .uc-itemcontent{
        border: 1px solid #DFDFDF;
        border-radius: 5px;
        width: 300px;
        height: 32px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
      }
    }
    .actived{
      .uc-radio{
        background: url("../../../assets/images/icon/zhujishengjixuanzhong.png") no-repeat;
        background-size: contain;
      }
      .uc-itemcontent{
        border: 1px solid #0084DD;
        color: #0084DD;
      }
    }
  }
}
.uc-confirm{
  background-image: linear-gradient(270deg, #5CC0FF 0%, #11A0FE 100%);
  border-radius: 20px;
  width: 125px;
  line-height: 40px;
  cursor: pointer;
  margin: 0 auto 6px;
  height: 40px;
  color: #fff;
  text-align: center;
  display: block;
}
.uc-botton-tip{
  width: 100%;
  font-size: 10px;
  color: #999999;
  text-align: center;
}
@media screen and(max-width: 1800px) {
  .updata {
    width: 300px;
  }
}
@media screen and(min-width: 1801px) {
  .updata {
    width: 400px;
  }
}
.ul-center{
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.agreement {
  display: flex;
  font-size: 14px;
  align-items: center;
  justify-content: center;
  .label {
    text-decoration: underline;
    margin-left: 8px;
  }
}
.aggress-msg {
  font-size: 16px;
  background: white;
  padding: 16px;
  position: relative;
  .aggre-close {
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
}


</style>