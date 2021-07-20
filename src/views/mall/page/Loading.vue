<template>
  <div class="loading-cont">
    <div class="bg-img-c">
      <img :src="currentCover" class="bg-img" />
    </div>
    
    <div class="loading">

      <div :class="['progress-area', isRatio43 ? 'ratio43' : '']">
        <div class="progress-bg">
          <div ref="progress" class="fill" :style="{width: progress + '%'}"></div>
        </div>
        <p class="tip">
          <!-- <span>{{msgs[type-1]}}</span> -->
          <span>{{type === 2 || type === 5 ? '正在为您连接主机，'+(isShowOpenMsg ? '云主机开机中，' : '')+'请稍后…' : stepMsg}}</span>
          <span>{{progressShow}}%</span>
        </p>
      </div>
    </div>
    <div class="loading-kefu" @click="showCustomer">
      <img class='img' src="@/assets/images/public/kefu-3@2x.png" alt="客服">
      <span class='text'>联系客服</span>
    </div>
    <!-- <a-modal
      v-model="visible"
      :footer="null"
      centered
      :closable="false"
      width="420px"
      @cancel="closeDialog"
    >
    <div class="error-dialog">
      <p class="text">主机正在准备中，如长时间没有响应，请稍后重试或尝试重启</p>
      <div class="button-area">
        <button v-if="connectLoop < 0" class="try confirm-botton"  @click="tryConnect">重试</button>
        <button v-else class="reboot confirm-botton"  @click="reboot">重启</button>
        <button class="service confirm-botton" @click="toVmList">返回</button>
      </div>
    </div>
  </a-modal> -->
  </div>
</template>

<script>

import { 
  vmListPaging, 
  getVmPoswer, 
  // getVmStatus, 
  // startVm, 
  getICA, 
  vmRestart,
  queryUpgradeStatus,
} from '@/server/api.js'

import { 
  // downloadICAFile, 
  // downloadFile, 
  getBoxList,
  switchCustomer
} from '@/utils/utils.js'

// import { 
//   COVER_PREFIX
// } from '@/config/public_config.js'

export default {
  name: "loading",
  data() {
    return {
      isRatio43: false, // 是否为4：3分辨率，解决文字底部文字重叠的bug
      progress: 0, // 百分比
      timmer: null,
      allTime: 30, // 到达99%的总时间,
      rate: 200, // 频率，多少毫秒执行一次,100-1000毫秒之间
      loopTime: 10000, // 轮询时间 30秒
      user_name: '',
      user_pwd: null,
      type: 1, // 1.分配， 2.连接  3.重启  4.重置 5.电源状态异常时 6.免密状态，并且为分配中, 7.手工订单
      vm_type: -1, // 查询虚拟机状态时使用
      powerTimer: null,
      errTipTime: 180, // 错误提示倒计时(秒)
      errTipTimmer: null,
      vmStatusTimer: -1,
      vmid: '',
      msgs: ['当前服务器火爆，加速分配主机中…', '正在为您连接主机，请稍后…', '系统正在重启，大约需要3分钟，请耐心等待…', '系统正在还原，大约需要3分钟，请耐心等待…'],
      step:{
        distribution: "正在为您分配主机",
        open: "正在为您开机",
        register : "正在为您注册主机",
        shutdown: "正在为您关机",
        destory: "正在为您销毁主机",
        success: '成功'
      },
      defaultBackground: require('@/assets/images/loading/loading_01.jpg'),
      currentCover: '',
      imageTimer: -1,
      stepMsg: '',
      machineName: '',
      connectCount: 0, // 连接重试次数
      maxTryCount: 15,
      isShowOpenMsg: false,
      visible: false,
      icaCount: 0, // ica执行任务数
      powerCount: 0, // 电源执行次数
      connectLoop: 0, // 前三次重试，后续显示重启
      agentConnect: false, // 无法连接，重启，用于重启后继续连接
      orderNo: '',
      upgradeTimer: -1, 
    }
  },
  mounted() {
    this.isRatio43 = window.innerHeight / window.innerWidth === 3 / 4
    this.errTipTiming()
    this.getQuery();
    // this.currentCover = this.defaultBackground
    this.getCover()
    this.startImageTimer()
  },
  methods: {
    tryConnect () {
      this.visible = false
      this.connectLoop++
      this.progress = 0
      this.connectCount = 0
      this.icaCount = 0
      this.getQuery()
    },
    toVmList () {
      window.clearInterval(this.errTipTimmer)
      this.errTipTimmer = -1
      this.$router.push('/mall/my_vm')
    },

    restartInit () {
      this.visible = false
      this.progress = 0
      this.connectCount = 0;
      this.$router.push(`/loading?type=3&user_name=${this.user_name}&machineName=${this.machineName}&agentConnect=true`)
      this.getQuery()
      this.errTipTiming()
    },

    restartConnect () {
      this.visible = false
      this.progress = 0
      this.connectCount = 0;
      this.$router.push(`/loading?type=2&user_name=${this.user_name}&machineName=${this.machineName}`)
      this.getQuery()
      this.errTipTiming()
    },

    async reboot () {
      let response = await vmRestart({
        machineKey: this.user_name,
        oprMode: 'hard',
      });
      if (response.code === 200) {
        this.$message.success('主机开始重启')
        // this.$modal.show('message', {text: response.data.msg})
        this.restartInit()
        return
      }
      let errorMsg = response.message
      if(response.code === 10710010 || response.code === 10710011) {
        this.restartInit()
        return
        // this.errMsg = response.data.msg;
        // const errList = {10710010: '重启',10710011: '重置'};
        // errorMsg = '主机' + (errList[response.code] || '') + '中，暂时无法进行此操作';
      }
      this.$message.error(errorMsg)
    },
    closeDialog () {
      this.visible = false
    },
    showCustomer () {
      switchCustomer(this)
    },
    startImageTimer () {
      this.imageTimer = setInterval(() => {
        this.getCover()
      }, 5 * 1000)
    },
     getCover () {
       if (!this.user_name || !this.machineName) {
         this.currentCover = this.defaultBackground
         return
       }

      // var src = `${this.vmCover[this.user_name].replace('_thumbnail', '').split('?')[0]}?t=${new Date().getTime()}`
      //  const img = new Image()
      //   img.onload = () => {
      //    this.currentCover = img.src
      //   }
      //   img.onerror = () => {
      //     this.currentCover = this.defaultBackground
      //   }
      //  img.src = src
      this.currentCover = `https://clms.yunzhiqu.com/v1/images?machine=${this.machineName}&size=1920_1080&t=${new Date().getTime()}&q=60`
      // console.log(this.vmCover[this.user_name])
      // console.log('currentCover: ', this.currentCover)
    },
    async errTipTiming() {
      window.clearTimeout(this.errTipTimmer)
      this.errTipTimmer = setTimeout( async () => {
        window.clearInterval(this.loopTimmer)
        window.clearInterval(this.timmer);
        window.clearInterval(this.powerTimer)
        window.clearInterval(this.vmStatusTimer)
        if (this.type === 1 || this.type === 6 || this.type === 7) {
          // 极端情况。机器分配成功，但电源状态还未正常
          const response = await vmListPaging({
            deviceNo: this.$store.state.deviceNo,
            productName: '',
          })
          // console.log('预期结果', response.code === 200 , ' ', response.data.dataList.length > 0)
          if (response.code === 200 && response.data.dataList.length > 0) {
            this.done()
            this.$router.push('/mall/my_vm')
            return
          }
        }
        // let errMsgs = ['主机分配异常', '主机连接失败', '重启失败', '还原失败', '连接', '分配', '分配']
        if (this.type === 7) {
          this.handlerManualOrderFail()
          return
        }

        if (this.type === 8) {
          window.clearInterval(this.upgradeTimer)
          this.upgradeTimer = -1
          this.$message.error('升级失败')
           window.setTimeout(() => {
            this.$router.push('/mall/my_vm')
          },2000)
          return
        }
          let message = ''
          let suffix = '请稍后重试或联系客服'
          switch (this.stepMsg) {
            case this.step.distribution:
              message = '云主机分配失败,' + suffix
              break;
            case this.step.open:
              message = '开机失败,' + suffix
              break;
            case this.step.register:
              message = '云主机注册失败,' + suffix
              break;
            case this.step.shutdown:
              message = '关机失败,' + suffix
              break;
            case this.step.destory:
              message = '云主机销毁失败,' + suffix
              break;
            default:
              message = suffix
              break;
          }
          if (this.stepMsg !== this.step.success) {
            this.$message.error(message)
          }
          window.setTimeout(() => {
            // 防止loading页面刷新。
            const backroute = this.$route.query.backroute || '/mall/my_vm'
            this.$router.push(backroute)
            // this.$router.go(-1);
          },2000)
        
      }, this.errTipTime * 1000);
    },
    //生成一个进度数组
    // getStepArray(len = 60) {
    //   const stdStep = 100 / len;
    //   let indexArr = [];
    //   let stepArr = [];
    //   let matchValue = -1;
    //   // 生成0-len数组
    //   for(let i = 0; i < len - 1; i++) {
    //     indexArr[i] = i;
    //   }      
    //   while(indexArr.length > 0) {
    //     let randomIndex = Math.floor(Math.random() * indexArr.length)
        
    //     let nowIndex = indexArr.splice(randomIndex, 1)[0]
        
    //     if (matchValue >= 0) {
    //       stepArr[nowIndex] = stdStep + (stdStep / 2);
    //       matchValue = -1;
    //     } else {
    //       matchValue = stdStep - (stdStep / 2);
    //       stepArr[nowIndex] = matchValue;
    //     }
    //   }
      
    //   return stepArr
    // },
    getStepArray() {
      let stepArr = new Array(50).fill(9.5, 0, 10).fill(0.1, 10, 50);
      // for (let i = 0; i < 10; i++) {
      //   stepArr.push(9.5);
      // }
      // for (let i = 0; i < 40; i++) {
      //   stepArr.push(0.1);
      // }
      
      return stepArr
    },
    updateProgress () {
      this.progress = 0;
      this.timmer = setInterval(() => {
        let max = this.type === 3 || this.type === 4 ? 90 : 95
        if (this.progress <= max) {
          this.progress += (max / 10 / 5)
        } else if (this.progress > max && this.progress <= 99) {
          this.progress += (4 / 10 / 20)
        }
        if (this.progress >= 99) {
          window.clearInterval(this.timmer);
        }
      }, 200);
      // let stepArr = this.getStepArray(60);
      // let progress = 0;
      // let nowIndex = 0;
      // const maxProgress = 99;

      //   this.progress = 0;
      // setTimeout(() => {
      //   this.progress += 95;
      // });
      

      // setTimeout(() => {
      //   this.timmer = setInterval(() => {
      //     if(stepArr[nowIndex]) {nowIndex
      //       progress += stepArr[nowIndex];
      //       nowIndex += 1;
      //       this.progress = progress <= maxProgress ? progress : maxProgress
      //     } else {
      //       this.progress = maxProgress
      //       clearInterval(this.timmer);
      //     }
          
      //   }, 1000);
      // },10000);
      
      // const time = parseInt(3 * Math.random() + 1) * 1000
      // let progress = this.progress + parseInt(Math.random() * 5)
      // this.progress = progress <= 99 ? progress : 99
      // if (this.progress === 99) return
      // setTimeout(() => {
      //   this.updateProgress()
      // }, 1000)
    },
    getQuery() {
      const type = this.$route.query.type || 1;
      this.machineName = this.$route.query.machineName || ''
      this.agentConnect = this.$route.query.agentConnect + '' === 'true'
      this.type = +type;
      /**
       * type:
       * 1: 激活
       * 2： 连接，不可连接状态也会进入，并且状态为2
       * 3：重启
       * 4.还原
       * 5.维护模式
       */
      this.user_name = this.$route.query.user_name || '';
      this.user_pwd = this.$route.query.user_pwd || '';
      this.vm_type = this.$route.query.vm_type || -1
      this.vmid = this.$route.query.vmid || ''
      switch (type * 1) {
        case 1:
        case 6:
        case 7:
          this.stepMsg = this.step.distribution
          this.progress = 25
          this.loopTimmer = setInterval(() => {
            this.checkVmDistributionStatus()
          }, this.loopTime)
          break;
        case 2:
        case 5:
          // this.updateProgress()
          window.clearTimeout(this.errTipTimmer)
          this.icaCount++
          this.checkVmConnectStatus()
          this.vmStatusTimer = setInterval(() => {
            this.icaCount++
            this.connectCount++
            this.progress = Math.min((this.connectCount / this.maxTryCount).toFixed(2) * 100, 100)
            if (this.icaCount === 1) {
              this.checkVmConnectStatus()
            }
          }, this.loopTime)
          // }, 2000)
          break;
        case 3:
        case 4:
          this.stepMsg = this.type === 3 ? this.step.shutdown : this.step.distribution
          this.progress = 25
          window.setTimeout(() => {
            this.powerCount++
            this.checkPowerStatus()
            this.powerTimer = setInterval(() => {
              this.powerCount++
              if (this.powerCount === 1) {
                this.checkPowerStatus()
              }
            }, this.loopTime);
          }, 20 * 1000)
          break;
        case 8:
          this.upgradeNo =  this.$route.query.upgradeNo
          this.orderNo = this.$route.query.orderNo
          if (!this.upgradeNo || !this.orderNo) {
            this.$message.error('参数异常')
            setTimeout(() => {
              this.$router.history.go(-1)
            }, 3000);
            return
          }
          this.stepMsg = '云主机升级中'
          this.upgradeTimer = setInterval(() => {
            this.checkUpgradeStatus()
          }, 10 * 1000)
          break;
        default:
          // this.$message.error(text: "页面异常，请联系客服");
          // setTimeout(() => {
          //   this.$router.history.go(-1)
          // }, 2000);
          break;

      }
    },
    done() {
      this.progress = 100;
      window.clearInterval(this.timmer)
    },

    async checkUpgradeStatus () {
      let res = await queryUpgradeStatus({
        upgradeNo: this.upgradeNo,
        orderNo: this.orderNo
      })
      let progress = this.progress + parseInt(Math.random() * 16)
      if (progress > 99) {
        progress = 99
      }
      this.progress = progress
      if (res.code !== 200 || !res.data) {
        return
      }
      window.clearInterval(this.upgradeTimer)
      this.upgradeTimer = -1
      this.progress = 100
      if (res.data.apiResultCode * 1 === 200) {
        this.$message.success('升级成功')
      } else {
        this.$message.error(res.data.apiResultCode * 1 === 10710013 ? res.data.apiResultBody : '升级失败')
      }
      setTimeout(() => {
        this.$router.push('/mall/my_vm')
      }, 3000)
    },

    getVmPoswerInfo () {
      return new Promise(async resolve => { // eslint-disable-line
        const param = {
        deviceNo: this.$store.state.deviceNo,
        machineKey: this.user_name
      }
      const res = await getVmPoswer(param)
        if (res.code !== 200) {
          resolve(false)
          return
        }
        let powerInfo = res.data.data
        if (powerInfo.vm_state === 5) {
          getICA({machineKey: this.user_name})
        }
        if (powerInfo.vm_state === 7) { // 关机中
          if (this.type === 1 || this.type === 6 || this.type === 7) {
            // 分配中忽略这个状态
            resolve(false)
            return
          }
          this.stepMsg = this.step.shutdown
          this.progress = 25
          resolve(false)
          return
        }
        if (powerInfo.vm_state === 6) { // 开机中
          this.stepMsg = this.step.open
          if (this.type !== 3) { // 不加这个判断会导致进度条往回走
            this.progress = 50
          }
          
          resolve(false)
          return
        }
        if (powerInfo.agent_state === 0) { // 注册中
          this.stepMsg = this.step.register
          this.progress = 75
          resolve(false)
          return
        }
        if (powerInfo.vm_state === 3) {
          this.progress = 100
          this.stepMsg = this.step.success
          resolve(true)
          return
        }
        
        resolve(false)
      })
    },

    async checkPowerStatus() {
      // let statusParams = {
      //   machineKey: this.user_name,
      // }
      // const vmStatus = await getVmStatus(statusParams);
      // if(vmStatus.code == 200) {
      //   let msg = this.type === 3 ? '重启成功' : '还原成功'
      //   this.$message.success(msg)
      //   clearInterval(this.vmStatusTimer)
      //   clearTimeout(this.errTipTimmer)
      //   clearInterval(this.imageTimer)
      //   this.vmStatusTimer = -1
      //   this.errTipTimmer = -1
      //   this.imageTimer = -1
      //   setTimeout(() => {
      //     this.$router.push({path: "/mall/my_vm"})
      //   }, 2000)
      // }
      let pass = await this.getVmPoswerInfo()
      this.powerCount--
      if (!pass) {
        if (this.powerCount > 0) {
          this.checkPowerStatus()
        }
        return
      }
      
      let msg = this.type === 3 ? '重启成功' : '还原成功'
      this.$message.success(msg)
      window.clearInterval(this.powerTimer)
      window.clearTimeout(this.errTipTimmer)
      window.clearInterval(this.imageTimer)
      this.powerTimer = -1
      this.errTipTimmer = -1
      this.imageTimer = -1
      if (this.agentConnect) {
        this.restartConnect()
        return
      }
      setTimeout(() => {
        this.$router.push({path: "/mall/my_vm"})
      }, 2000)
    },
    sleep (t = 3000) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(true)
        }, t)
      })
    },
    async checkVmConnectStatus () {
      // 此处逻辑。不用管是否开机，下载ICA会自动开发。循环调用下载ica接口，下载成功就清除定时器
      const param = {
        deviceNo: this.$store.state.deviceNo,
        machineKey: this.user_name
      }
      if (this.connectCount === 0) {
        const res = await getVmPoswer(param)
        let vm_state = res.data&&res.data.data ? res.data.data.vm_state : -1;
        if (vm_state === 5) {
          this.isShowOpenMsg = true
        }
      }

      // this.connectCount = this.connectCount + 1
      // this.progress = Math.min((this.connectCount / this.maxTryCount).toFixed(2) * 100, 100)

      // 一开始如果是开机。就多下载一次
      if (this.connectCount === this.maxTryCount + (this.isShowOpenMsg ? 1 : 0)) {
        this.visible = true
        window.clearInterval(this.vmStatusTimer)
        this.vmStatusTimer = -1
        window.clearTimeout(this.errTipTimmer)
        this.errTipTimmer = -1
        return
      }

      // console.log('connectCount: ', this.connectCount)
      // return

      // if (vm_state * 1 === 3) {
        let vmRes = await getICA({machineKey: this.user_name})
        this.icaCount--
        // console.log('ica 下载ica返回；', vmRes)
        if (!vmRes.data || typeof vmRes.data.code !== 'undefined'|| (vmRes.data.type && vmRes.data.type === 'application/json')) { // 返回内容可能为空
          if (this.icaCount > 0) {
            this.checkVmConnectStatus()
          }
          return
        }

        // if(agent_state === 1 && res.data.data.maintenance === 0) {
          window.clearTimeout(this.errTipTimmer)
          window.clearInterval(this.vmStatusTimer)
          this.vmStatusTimer = -1
          
          window.clearInterval(this.imageTimer)
          this.done()
          let prefix = process.env.VUE_APP_BUILD_ENV === 'test' ? 'http://192.168.7.245:8080' : 'https://yunnyweb.yunzhiqu.com'
          window.location.href = `${prefix}/h5connect/index.html?machineKey=${this.user_name}&token=${this.$store.state.token}`
          // const backroute = this.$route.query.backroute || '/mall/my_vm'
          // 15秒是为了防止太快退回
          // if (this.type === 5) {
          //   downloadFile(vmRes, this)
          //     setTimeout(() => {
          //       this.$router.push(backroute)
          //     }, 15 * 1000)
          // } else {
          //   downloadFile(vmRes, this)
          //   setTimeout(() => {
          //     this.$router.push(backroute) // 免密用了这个
          //   }, 15 * 1000)
          // }
          
        // }
      // }
    },
    handlerManualOrderFail () {
      this.$message.error(`手工订单激活失败，请重启${this.$store.state.yunnyName}再次激活`)
      window.setTimeout(() => {
        this.$router.push('/mall/my_vm');
      },2000)
    },
    async checkVmDistributionStatus() {
      const response = await vmListPaging({
        deviceNo: this.$store.state.deviceNo,
        productName: '',
      });

      if (response.code === 104100004) {
        // 串号分配中，弃用。服务器不会给这个状态了
        return
      }
      if (response.code === 200) {
        if (response.data.dataList.length === 0) {
          this.$message.error("云主机分配失败，请稍后重试或联系客服");
          setTimeout(() => {
            window.clearInterval(this.loopTimmer)
            this.$router.push('/mall/my_vm')
          }, 2000)
          return
        }
        let isDistribution = false // 是否在分配中
        response.data.dataList.forEach(item => {
          if (item.durationOrderVO.state === 3) {
            isDistribution = true
          }
        })
        if (isDistribution) {
          this.progress = 25
          this.stepMsg = this.step.open
          return
        }
        this.user_name = response.data.dataList[0].durationOrderVO.machineKey
        if (!await this.getVmPoswerInfo()) {
          return
        }
        this.done()
        window.clearInterval(this.loopTimmer)
        if (this.type === 6) {
          getBoxList(this)
          return
        }
        this.$router.push("/mall/my_vm")
        return
      }

      if (this.type === 7) {
        this.handlerManualOrderFail()
        return
      }

      if (this.type === 6) {
        this.$message.error("免密机器分配失败，请联系管理员");
        this.$router.push('/anyUser')
        return
      }

      this.$message.error("机器分配失败，请稍后再试");
      setTimeout(() => {
        window.clearInterval(this.loopTimmer)
        this.$router.push('/mall/my_vm')
      }, 2000)
    },
  },
  beforeDestroy() {
    window.clearInterval(this.timmer);
    window.clearInterval(this.loopTimmer);
    window.clearTimeout(this.errTipTimmer)
    window.clearInterval(this.vmStatusTimer);
    window.clearInterval(this.powerTimer)
    window.clearInterval(this.imageTimer)
  },
  computed: {
    progressShow() {
      return parseInt(this.progress);
    },
    vmCover () {
      return this.$store.state.vmCover
    }
  },
  watch: {
    // vmCover () {
    //   this.getCover()
    // }
  }
}
</script>

<style lang="less" scoped>
.ratio43 {
  padding-bottom: 150px;
}
.loading-cont {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  max-width: 1920px;
  max-height: 1080px;
  overflow-y: hidden;
  // background-color: #192846;
  background-image: url('../../../assets/images/loading/loading_02.jpg');
  background-size: cover;
  background-position: center center;
}
.bg-img-c {
  position: absolute;
  left: 11%;
  bottom: 37%;
  // width: 500px;
  // height: 280px;
  width: 36.6%;
  height: 36.6%;
  overflow: hidden;
}
.bg-img {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}
.loading{
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  // background-repeat: no-repeat;
  // background-position: center center;
  // background-size: 100% 100%;
  // background-color: #192846;
  // background-image: url('../../assets/images/loading/loading_01.jpg');
}
.progress-area{
  width: 100%;
  height: 12.5%;
  background: #192846;
  position: fixed;
  bottom: 0;
  left: 0;
  padding-top: 25px;
  .progress-bg{
    width: 87.65%;
    height: 8.14%;
    min-height: 8px;
    background: #000000;
    margin: 0 auto;
    .fill{
      height: 100%;
      width: 50%;
      background:linear-gradient(360deg,rgba(6,122,188,1) 0%,rgba(67,190,243,1) 100%); // eslint-disable-line
      transition: all 0.3s linear;
    }
  }
  .tip{
    width: 87.65%;
    color: #fff;
    font-size:18px;
    // font-family:STHeitiSC-Medium,STHeitiSC;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
}
.loading-kefu {
    position: fixed;
    right: 60px;
    top: 60px;
    width: 130px;
    height: 40px;
    z-index: 3;
    // margin-top: 52px;
    // margin-right: 97px;
    background: linear-gradient(90deg,rgba(42,161,223,1) 0%,rgba(148,213,243,1) 100%);
    overflow: hidden;
    color: #fff;
    border-radius:32px;
    display: inline-flex!important;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    cursor: pointer;
    .img{
      width: 18px;
      margin-right: 8px;
    }
    .text{
      font-size:16px;
      font-weight:500;
      color:rgba(255,255,255,1);
    }
    &:hover {
      background: linear-gradient(90deg, #2BB0F5 0%, #AAE4FF 100%); // eslint-disable-line
    }
  }
  .error-dialog {
    .text {
      font-size: 18px;
      color: #474747;
      letter-spacing: 0;
      line-height: 27px;
      text-align: center;
      -webkit-box-flex: 1;
      -ms-flex-positive: 1;
      flex-grow: 1;
      -ms-flex-negative: 1;
      flex-shrink: 1;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      min-height: 106px;
      box-sizing: border-box;
      padding: 24px 0;
    }
    .button-area {
      height: 64px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-grow: 0;
      flex-shrink: 0;
      button{
        display: block;
        width: 166px;
        height: 64px;
        border-radius: 32px;
        font-size: 20px;
        cursor: pointer;
        color: #fff;
        line-height: 64px;
        text-align: center;
      }
      .cancel-botton{
        background-image: linear-gradient(90deg, #BEBEBE 0%, #EAEAEA 100%); // eslint-disable-line
      }
      .confirm-botton{
        background-image: linear-gradient(90deg, #2AA1DF 0%, #94D5F3 100%); // eslint-disable-line
      }
    }
  }
</style>