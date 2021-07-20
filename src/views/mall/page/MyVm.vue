
<template>
  <div class="my-vm-list">
    <div class="title">
      <div class="name">
        <div class="zh">我的主机</div>
        <div class="en">MAINFRAME</div>
      </div>
      <div class="switch">
        <img :src="layoutModel=== 0 ? layoutIcon.swiperSelect : layoutIcon.lineNormal"  class="swiper-icon" @click="switchLayout(0)"/> 
        <img :src="layoutModel=== 0 ? layoutIcon.swiperNormal : layoutIcon.lineSelect"  class="line-icon" @click="switchLayout(1)"/> 
      </div>
    </div>
    <template v-if="list.length > 0"> 
      <swiper v-show="layoutModel === 0" ref="mySwiper" :options="swiperOptions" class="my-swiper">
        <swiper-slide v-for="(item, index) in list" :key="index">
          <VmInfo  
            :item="item" 
            :layoutModel="layoutModel"
            :startingUpMahineKey="startingUpMahineKey"
            @reset="reset" 
            :index="index" 
            @switchDetail="switchDetail"
          />
        </swiper-slide>
        <template v-if="list.length > 1">
          <img 
            class="swiper-button-prev" 
            slot="button-prev" 
            :src="swiperIndex === 0 ? arrowIcon.leftNormal : arrowIcon.leftSelect" />
          <img 
            class="swiper-button-next" 
            slot="button-next" 
            :src="swiperIndex === list.length - 1 ? arrowIcon.rightNormal: arrowIcon.rightSelect" />
        </template>
        
      </swiper>
      <div class="list" v-if="layoutModel === 1">
        <div v-for="(item, index) in list" :key="index" class="item" >
          <VmInfo 
            :item="item" 
            :layoutModel="layoutModel"
            :startingUpMahineKey="startingUpMahineKey"
            @reset="reset" 
            :index="index" 
            @switchDetail="switchDetail"
            @refreshList="getList"
            @updataVmOnChange="updataVmOnChange"
            />
        </div>
        
      </div>
    </template>
    <div class="vm-empty" v-if="list.length === 0">
      <img src="@/assets/images/mall/vm_empty.png" />
      <div class="msg"><span>您暂未购买主机，请到</span><span class='to-mall' @click="toMall">商城</span><span>能购买</span></div>
    </div>
    <UpdatePay v-if="isShowPayDialog" :payInfo="payInfo" @close="closePay" @crystalPaySuccess="crystalPaySuccess"/>
  <QiMoService />
  </div>
</template>

<script>
import {
  // SYSEM_DISK_ID,
  // HARD_DISK_ID,
  GRAPHIC_MEMORY_ID,
  OPERATE_SYSTEM_ID,
  // IMAGE_PREFIX,
  TIME_UNIT_LIST,
} from '@/config/public_config'
import VmInfo from '../components/VmInfo.vue'
import QiMoService from '@/components/public/QiMoService.vue'

import {
  queryDicList,
  vmListPaging,
  getVmPoswer,
  getICA,
} from '@/server/api.js'

let myVmPageThis = null
export default {
  name: 'MyVmList',
  components: {
    VmInfo,
    QiMoService,
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },
  data () {
    return {
      isShowPayDialog: false,
      payInfo: null,
      orderStateTimer: -1,
      // systemDiskList: [],
      // hardList: [],
      graphicList: [],
      operateSystemList: [],
      sectionList: [],
      currentPage: 1,
      pageSize: 9999,
      total: 0,
      list: [],
      swiperIndex: 0,
      swiperOptions: {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 204,
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows : true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        on: {
          slideChange () {
            myVmPageThis.swiperIndex = this.activeIndex
          }
        }
      },
      resetMachineKey: '',
      layoutModel: 0, // 布局模式： 0.swiper    .列表
      layoutIcon: {
        swiperNormal: require('@/assets/images/mall/icon-23.png'),
        swiperSelect: require('@/assets/images/mall/icon-21.png'),
        lineNormal: require('@/assets/images/mall/icon-22.png'),
        lineSelect: require('@/assets/images/mall/icon-24.png'),
      },
      arrowIcon: {
        leftNormal: require('@/assets/images/mall/icon-26.png'),
        leftSelect: require('@/assets/images/mall/icon-28.png'),
        rightNormal: require('@/assets/images/mall/icon-27.png'),
        rightSelect: require('@/assets/images/mall/icon-29.png')
      },
      startingUpMahineKey: '',
    }
  },
  async mounted () {
    myVmPageThis = this
    // await this.getDicList(SYSEM_DISK_ID)
    // await this.getDicList(HARD_DISK_ID)
    await this.getDicList(GRAPHIC_MEMORY_ID)
    await this.getDicList(OPERATE_SYSTEM_ID)
    this.getList()
  },

  beforeDestroy () {
    if (this.powerTimer !== -1) {
      window.clearInterval(this.powerTimer)
    }
    if (this.orderStateTimer !== -1) {
      clearInterval(this.orderStateTimer)
    }
  },

  methods: {
    
    closePay () {
      this.isShowPayDialog = false
      if (this.orderStateTimer !== -1) {
        clearInterval(this.orderStateTimer)
        this.orderStateTimer = -1
      }
    },
    async getDicList (codeTypeNo) {
      let res = await queryDicList({
        codeTypeNo,
        pageSize: 9999,
      })
      if (res.code !== 200) {
        this.$message.error(res.message)
        return
      }
      switch (codeTypeNo) {
        // case SYSEM_DISK_ID:
        //   this.systemDiskList = res.data.dataList
        //   break;
        // case HARD_DISK_ID:
        //   this.hardList = res.data.dataList
        //   break;
        case GRAPHIC_MEMORY_ID:
          this.graphicList = res.data.dataList
          break;
        case OPERATE_SYSTEM_ID:
          this.operateSystemList = res.data.dataList
          break;
        default:
          break;
      }
    },
    async getList () {
      this.$Spin.show()
      let res = await vmListPaging({
        deviceNo: this.$store.state.deviceNo,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        productName: '',
      })
      this.$Spin.hide()
      // res = {"code":200,"message":"success","data":{"page":{"currentPage":1,"prePage":1,"nextPage":1,"pageSize":9999,"totalPage":1,"totalCount":3},"dataList":[{"productName":"测试-自有9.25","durationOrderVO":{"id":512,"orderNo":"AYSPSC202009280002","deviceNo":"","productNo":"AYSP2020090003","userNo":"u20200427000001","resetTimes":24,"dueTime":"2020-10-01 09:31:54","showTime":"2020-10-01 09:21:54","retentionTime":null,"createTime":"2020-09-28 10:49:55","dueTimeStr":null,"showTimeStr":null,"retentionTimeStr":null,"createTimeStr":null,"state":1,"channelNo":1,"machineName":"CS-B01-0023","machineKey":"TESTVM202009280002"},"productPictureVOList":[{"id":123,"type":1,"url":"2020-09-25/16010047984691596.jpg","productNo":"AYSP2020090003","createMan":6,"updateMan":6,"state":1},{"id":124,"type":2,"url":"2020-09-25/16010048017629512.jpg","productNo":"AYSP2020090003","createMan":6,"updateMan":6,"state":1}],"agreement":1,"currentTime":"2020-09-29 09:38:54","vmInfoVO":{"cpu":"8","memory":"16","operateSystem":"1","systemDisk":"1","hardDisk":"1","graphicsMemory":"1","instructions":"测试"},"productInfoVO":{"id":51,"typeNo":2,"name":"测试-自有9.25","productNo":"AYSP2020090003","channelNo":1,"createTime":"2020-09-25T11:33:31","state":1,"vmId":1,"timeChargeId":29,"realTimeChargeId":0,"instructions":"测试","diyTime":0,"productPictureVOList":[{"id":123,"type":1,"url":"2020-09-25/16010047984691596.jpg","productNo":"AYSP2020090003","createMan":6,"updateMan":6,"state":1},{"id":124,"type":2,"url":"2020-09-25/16010048017629512.jpg","productNo":"AYSP2020090003","createMan":6,"updateMan":6,"state":1}],"shortcutDurationVOList":[{"id":97,"productNo":"AYSP2020090003","duration":1,"durationUnit":1,"state":1,"createMan":6,"updateMan":6}]},"preinstallSoftwareVOList":[{"name":"QQ","startup":"qq.exe","state":1}]},{"productName":"测试自有9.3","durationOrderVO":{"id":513,"orderNo":"AYSPSC202009280003","deviceNo":"","productNo":"AYSP2020090001","userNo":"u20200427000001","resetTimes":24,"dueTime":"2020-09-30 11:08:25","showTime":"2020-09-30 10:58:25","retentionTime":null,"createTime":"2020-09-28 11:08:25","dueTimeStr":null,"showTimeStr":null,"retentionTimeStr":null,"createTimeStr":null,"state":1,"channelNo":1,"machineName":"CS-B01-0024","machineKey":"TESTVM202009280003"},"productPictureVOList":[{"id":119,"type":1,"url":"2020-09-03/15990972327208023.jpg","productNo":"AYSP2020090001","createMan":1,"updateMan":1,"state":1},{"id":120,"type":2,"url":"2020-09-03/1599097236473431.jpg","productNo":"AYSP2020090001","createMan":1,"updateMan":1,"state":1}],"agreement":1,"currentTime":"2020-09-29 09:38:54","vmInfoVO":{"cpu":"8","memory":"16","operateSystem":"1","systemDisk":"1","hardDisk":"1","graphicsMemory":"1","instructions":"测试"},"productInfoVO":{"id":49,"typeNo":2,"name":"测试自有9.3","productNo":"AYSP2020090001","channelNo":1,"createTime":"2020-09-03T09:40:56","state":1,"vmId":1,"timeChargeId":27,"realTimeChargeId":0,"instructions":"测试","diyTime":0,"productPictureVOList":[{"id":119,"type":1,"url":"2020-09-03/159909723272080 23.jpg","productNo":"AYSP2020090001","createMan":1,"updateMan":1,"state":1},{"id":120,"type":2,"url":"2020-09-03/1599097236473431.jpg","productNo":"AYSP2020090001","createMan":1,"updateMan":1,"state":1}],"shortcutDurationVOList":[{"id":95,"productNo":"AYSP2020090001","duration":1,"durationUnit":1,"state":1,"createMan":1,"updateMan":1}]},"preinstallSoftwareVOList":[{"name":"QQ","startup":"qq.exe","state":1}]},{"productName":"测试-D自有7.8","durationOrderVO":{"id":514,"orderNo":"AYSPSC202009280004","deviceNo":"","productNo":"AYSP2020070001","userNo":"u20200427000001","resetTimes":24,"dueTime":"2020-09-30 11:12:46","showTime":"2020-09-30 11:02:46","retentionTime":null,"createTime":"2020-09-28 11:12:46","dueTimeStr":null,"showTimeStr":null,"retentionTimeStr":null,"createTimeStr":null,"state":1,"channelNo":1,"machineName":"CS-B01-0025","machineKey":"TESTVM202009280004"},"productPictureVOList":[{"id":111,"type":1,"url":"2020-07-08/15941715341353558.jpg","productNo":"AYSP2020070001","createMan":6,"updateMan":6,"state":1},{"id":112,"type":2,"url":"2020-07-08/15941715378571430.jpg","productNo":"AYSP2020070001","createMan":6,"updateMan":6,"state":1}],"agreement":1,"currentTime":"2020-09-29 09:38:54","vmInfoVO":{"cpu":"8","memory":"16","operateSystem":"1","systemDisk":"1","hardDisk":"1","graphicsMemory":"1","instructions":"测试"},"productInfoVO":{"id":45,"typeNo":2,"name":"测试-D自有7.8","productNo":"AYSP2020070001","channelNo":1,"createTime":"2020-07-08T09:25:42","state":1,"vmId":1,"timeChargeId":27,"realTimeChargeId":0,"instructions":"测试","diyTime":0,"productPictureVOList":[{"id":111,"type":1,"url":"2020-07-08/15941715341353558.jpg","productNo":"AYSP2020070001","createMan":6,"updateMan":6,"state":1},{"id":112,"type":2,"url":"2020-07-08/15941715378571430.jpg","productNo":"AYSP2020070001","createMan":6,"updateMan":6,"state":1}],"shortcutDurationVOList":[{"id":85,"productNo":"AYSP2020070001","duration":1,"durationUnit":1,"state":1,"createMan":6,"updateMan":6}]},"preinstallSoftwareVOList":[{"name":"QQ","startup":"qq.exe","state":1}]}]}}
      // res = {"code":200,"message":"success","data":{"page":{"currentPage":1,"prePage":1,"nextPage":1,"pageSize":9999,"totalPage":1,"totalCount":1},"dataList":[{"productName":"测试10.14自有","durationOrderVO":{"id":545,"orderNo":"AYSPSC202010200006","deviceNo":"001001A01000100E04C490E0B","productNo":"AYSP2020100001","userNo":"u20200907000001","resetTimes":24,"dueTime":"2021-10-20 10:14:40","showTime":"2021-10-20 10:04:40","retentionTime":null,"createTime":"2020-10-20 10:14:40","dueTimeStr":null,"showTimeStr":null,"retentionTimeStr":null,"createTimeStr":null,"state":1,"channelNo":1,"machineName":"CS-B01-0036","machineKey":"TESTVM202010200006"},"productPictureVOList":[{"id":125,"type":1,"url":"2020-10-14/16026598125386871.jpg","productNo":"AYSP2020100001","createMan":6,"updateMan":6,"state":1},{"id":126,"type":2,"url":"2020-10-14/16026598165205608.jpg","productNo":"AYSP2020100001","createMan":6,"updateMan":6,"state":1}],"agreement":1,"currentTime":"2020-10-22 09:20:48","vmInfoVO":{"id":1,"cpu":"8","memory":"16","operateSystem":"1","systemDisk":"1","hardDisk":"1","graphicsMemory":"1","instructions":"测试"},"productInfoVO":{"id":52,"typeNo":2,"name":"测试10.14自有","productNo":"AYSP2020100001","channelNo":1,"createTime":"2020-10-14T15:17:04","state":1,"vmId":1,"timeChargeId":30,"realTimeChargeId":0,"instructions":"测试自有","diyTime":0,"productPictureVOList":[{"id":125,"type":1,"url":"2020-10-14/16026598125386871.jpg","productNo":"AYSP2020100001","createMan":6,"updateMan":6,"state":1},{"id":126,"type":2,"url":"2020-10-14/16026598165205608.jpg","productNo":"AYSP2020100001","createMan":6,"updateMan":6,"state":1}],"shortcutDurationVOList":[{"id":98,"productNo":"AYSP2020100001","duration":1,"durationUnit":1,"state":1,"createMan":6,"updateMan":6}]},"preinstallSoftwareVOList":[{"name":"QQ","startup":"qq.exe","state":1}]}]}}
      if (res.code !== 200) {
        this.$message.error(res.message)
        return
      }
      // for (var i = 0; i < 2; i++) {
      //   res.data.dataList.push(JSON.parse(JSON.stringify(res.data.dataList[0])))
      // }
     
      // res.data.dataList.forEach((info, index) => {
      //   console.log(index + 1)
      //   info.productName =  '虚拟机 ' + (index + 1)
      // })
      //  console.log(res)
      let resetInfo = null
      res.data.dataList.forEach(info => {
        info.showDetail = false
        // info.durationOrderVO.dueTime = '2019-01-01 00:00:00'
        this.graphicList.forEach(item => {
          if (item.serialNo === +info.vmInfoVO.graphicsMemory) {
            info.vmInfoVO.graphicsMemoryName = item.name
          }
        })
        this.operateSystemList.forEach(item => {
          if (item.serialNo === +info.vmInfoVO.operateSystem) {
            info.vmInfoVO.operateSystemName = item.name
          }
        })
        info.productInfoVO.shortcutDurationVOList.forEach(element => {
          element.durationUnitName = typeof TIME_UNIT_LIST[element.durationUnit] !== 'undefined' ? TIME_UNIT_LIST[element.durationUnit].name : ''
        })
        if (this.resetMachineKey !== '' && info.durationOrderVO.machineKey === this.resetMachineKey) {
          resetInfo = info
        }
      })
      this.list = res.data.dataList
      this.total = res.data.page.totalCount
      if (resetInfo !== null) {
        this.$router.push(`/mall/loading?type=4&user_name=${resetInfo.durationOrderVO.machineKey}&machineName=${resetInfo.durationOrderVO.machineName}`)
      }

      if (this.list.length > 0) {
        const powerRes = await getVmPoswer({
          deviceNo: this.$store.state.deviceNo,
          machineKey: this.list[0].durationOrderVO.machineKey
        })
        if (powerRes.code !== 200) {
          return
        }
        if (powerRes.data.data.vm_state === 5 || powerRes.data.data.vm_state === 7) {
          this.startingUpMahineKey = this.list[0].durationOrderVO.machineKey
          getICA({machineKey: this.startingUpMahineKey})
          let retryCount = 0

          this.powerTimer = setInterval(async () => {
            retryCount++
            if (retryCount >= 100) {
              clearInterval(this.powerTimer)
              this.powerTimer = -1
            }
            let vmRes = await getICA({machineKey: this.startingUpMahineKey})
            if (vmRes.data && vmRes.data.tokenError) {
              clearInterval(this.powerTimer)
              this.powerTimer = -1
              return
            }
            if (!vmRes.data || typeof vmRes.data.code !== 'undefined'|| (vmRes.data.type && vmRes.data.type === 'application/json')) { // 返回内容可能为空
              return
            }
            this.startingUpMahineKey = ''
            clearInterval(this.powerTimer)
            this.powerTimer = -1
          }, 10 * 1000)
        }
        
      }
    },
    reset (machineKey) {
      this.resetMachineKey = machineKey
      this.getList()
    },
    switchLayout (layoutModel) {
      this.layoutModel = layoutModel
    },
    switchDetail (index) {
      let list = JSON.parse(JSON.stringify(this.list))
      list[index].showDetail = !list[index].showDetail
      this.list = list
    },
    toMall () {
      this.$router.push('/mall')
    },
  }
}
</script>

<style lang="less" scoped>
.my-vm-list {
  text-align: center;
  .title {
    width: 1115px;
    margin: 0 auto;
    padding-top: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .name {
      width: 120px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-left: solid 4px #19A5FE;
      flex-direction: column;
      padding-left: 16px;
      .zh {
        font-size: 22px;
        line-height: 30px;
        color: #666666;
        text-align: left;
      }
      .en {
        font-size: 11px;
        line-height: 16px;
        color: #999999;
        margin-top: 3px;
        width: 80px;
        text-align: left;
      }
    }
    .switch {
      font-size: 0;
      img {
        width: 32px;
        cursor: pointer;
      }
      .line-icon {
        margin-left: 10px;
      }
    }
  }
  
}
.my-swiper {
  padding: 40px 0;
  // max-width: 1620px;
  // min-width: 1600px;
  // width: 1620px;
  width: 1200px;
  margin: 0 auto;
  position: relative;
}
.swiper-slide {
  width: 700px;
}

.list {
  padding-bottom: 40px;
  width: 1150px;
  margin: 0 auto;
  text-align: left;
  .item {
    width: auto;
    display: inline-block;
    margin-top: 40px;
    margin-right: 32px;
    // &:nth-child(3n) {
    //   margin-right: 0;
    // }
  }
}
.swiper-button-prev, .swiper-button-next{
  width: 68px;
  position: absolute;
  top: 50%;
  margin-top: -34px;
  z-index: 5;
}

.swiper-button-prev {
  left: 136px;
}

.swiper-button-next {
  right: 80px;
}


@media screen and (min-width: 1920px) {
  .my-swiper {
    width: 1620px;
  }
  .swiper-button-prev {
    left: 340px;
  }

  .swiper-button-next {
    right: 290px;
  }
}

.vm-empty {
  padding-top: 156px;
  padding-bottom: 132px;
  text-align: center;
  
  .msg {
    font-size: 20px;
    color: #999999;
    line-height: 28px;
    .to-mall {
      color: #19A5FE;
      margin-top: 8px;
      cursor: pointer;
    }
  }
  img {
    width: 483px;
    margin: 0 auto;
  }
}


</style>
