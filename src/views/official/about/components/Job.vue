<template>
  <div class="job">
    <div class="item" v-for="(item, index) in list" :key="index">
      <div class="base-info">
        <div class="label">{{item.label}}</div>
        <img class="job-icon" :src="item.icon">
        <div class="diver"></div>
        <div class="job-info">
          <div class="title">{{item.name}}</div>
          <div class="desc">
            <div>工作地点：{{item.address}}</div>
            <div class="people">招聘人数：{{item.people}}</div>
            <div>更新时间：{{nowDate}}</div>
          </div>
        </div>
        <div class="arrow-info" @click="switchExpand(index)">
          岗位要求 <img :src="!item.expand ? arrowDown : arrowUp" class="arrow-icon" />
        </div>
      </div>
      <div class="work-info" v-show="item.expand" >
        <div v-if="item.require.length > 0">岗位要求：</div>
        <div v-for="(obj, idx) in item.require" :key="idx">
          {{obj}}
        </div>
        <div v-if="item.work.length > 0">工作内容：</div>
        <div v-for="(obj, idx) in item.work" :key="`2${idx}`">
          {{obj}}
        </div>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  name: 'Job',
  components: {
  },
  data () {
    return {
      nowDate: '',
      arrowUp: require('../../../../assets/images/about/icon-59.png'),
      arrowDown: require('../../../../assets/images/about/icon-60.png'),
      list: [{
        name: 'c++开发工程师',
        label: '技术开发',
        icon: require('../../../../assets/images/about/icon-56.png'),
        address: '杭州',
        people: 3,
        require: [
          '1、计算机、通信、应用数学等相关专业本科以上；',
          '2、软件开发相关经验3年以上；',
          '3、精通C/C++开发语言，熟悉windows/linux/ios/mac/android两种以上操作系统；',
          '4、精通TCP/IP协议，熟悉socket编程；',
          '5、精通多线程机制，深刻理解线程同步原理；',
          '6、熟悉至少两种以上主流开源代码；',
          '7、能熟练应用vc开发工具；',
          '8、熟悉mfc框架，能够理解常用类型的继承关系；',
          '9、熟悉windows消息机制，理解消息传递过程；',
          '10、熟悉windows设备驱动开发流程，理解工作原理；',
          '11、有usb重定向，虚拟鼠标键盘驱动开发经验者优先；',
          '12、学习能力强，适应能力好，有耐心。',
          '13、热爱钻研新技术，具有良好的编程习惯和代码风格；'
        ],
        work: [],
        expand: false
      },{
        name: '运维工程师',
        label: '技术开发',
        address: '杭州',
        people: 3,
        icon: require('../../../../assets/images/about/icon-57.png'),
        require: [
          '1、熟悉Windows10，报表整理',
          '2、熟悉Windowsserver2016、linux以及windows10系统',
          '3、精通CitrixVDI、VMwareVDI',
          '4、有CitrixVDI产品开发经验'
        ],
        work: [
          '1、机房组建',
          '2、系统架构管理',
          '3、使用Citrix,VMware开发产品',
          '4、客户端操作系统定制'
        ],
        expand: false
      },{
        name: 'Java开发工程师',
        label: '技术开发',
        address: '杭州',
        people: 3,
        icon: require('../../../../assets/images/about/icon-58.png'),
        require: [
          '1、3年以上互联网平台相关开发经验；',
          '2、年龄在25-35周岁之间；',
          '3、JAVA基础扎实，理解IO、多线程、集合等基础框架，对JVM原理有自己的理解。',
          '4、理解一种以上开源框架的原理和机制；',
          '5、熟悉Spring\\ibatis\\struts等一种以上开源框架。',
          '6、要求有javaweb开发、发布经验，熟悉web服务器配置、搭建。',
          '7、熟悉分布式系统的设计和应用，熟悉分布式、缓存、消息等机制，能对分布式常用技术进行合理应用，解决问题。',
          '8、掌握多线程及高性能的设计与编码及性能调优，有高并发应用开发经验。',
          '9、掌握Linux操作系统和MySQL，对sql优化有一定的经验。',
          '10、熟悉web前端开发优先！',
          '11、学习能力强，适应能力好，有耐心。'
        ],
        work: [
          '1、负责公司云平台、业务平台开发；',
          '2、负责相关系统的设计与模块开发；',
          '3、负责系统核心代码编写；',
          '4、参与解决开发过程中出现的各类技术问题；',
          '5、负责项目需求沟通、设计文档、项目部署文档、修改日志文档的编写、维护等工作；'
        ],
        expand: false
      }]
    }
  },
  mounted () {
    let date = new Date()
    this.nowDate = `${date.getFullYear()}/${this.zero(date.getMonth() + 1)}/${this.zero(date.getDate())}`
  },
  methods: {
    zero (n) {
      return n < 10 ? '0' + n : n
    },
    switchExpand (index) {
      let list = JSON.parse(JSON.stringify(this.list))
      list[index].expand = !list[index].expand
      this.list = list
    },
  }
}
</script>

<style lang="less" scoped>
  .job {
    width: 1000px;
    margin: 0 auto;
    padding-bottom: 80px;
    .item {
      background: #FFFFFF;
      box-shadow: 0 4px 14px 0 rgba(0,0,0,0.08);
      margin-top: 40px;
      &:first-child {
        margin-top: 0;
      }
      .base-info {
        position: relative;
        display: flex;
        align-items: center;
        padding: 50px 0;
        .label {
          position: absolute;
          left: 0;
          top: 0;
          width: 104px;
          height: 36px;
          text-align: center;
          line-height: 36px;
          color: white;
          border-radius: 0 100px 100px 0;
          background: #19A5FE;
        }
        .job-icon {
          width: 46px;
          margin: 0 40px;
        }
        .diver {
          width: 2px;
          height: 114px;
          background: #EFEFEF;
        }
        .job-info {
          flex: 1;
          padding-left: 40px;
          padding-right: 20px;
          .title {
            font-size: 24px;
            color: #2C2D3B;
            font-weight: bold;
          }
          .desc {
            margin-top: 20px;
            font-size: 16px;
            color: #444444;
            display: flex;
            align-items: center;
            .people {
              padding: 0 40px;
            }
          }
        }
        .arrow-info {
          position: absolute;
          right: 20px;
          bottom: 30px;
          color: #19A5FE;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          .arrow-icon {
            width: 12px;
            margin-left: 4px;
          }
        }
      }
      .work-info {
        border-top: solid 1px #EFEFEF;
        margin-left: 128px;
        margin-right: 20px;
        box-sizing: border-box;
        padding-top: 20px;
        padding-left: 40px;
        font-size: 16px;
        color: #444444;
        line-height: 30px;
        padding-bottom: 30px;
      }
    }
  }
</style>

