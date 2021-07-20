<template>
  <div class="question">
    <div class="left">
      <div class="search">
        <el-input class="transparent-input question-input " placeholder="输入您的问题找寻答案" v-model="search" @keyup.enter="toSearch"/>
        <img class="icon" src="@/assets/image/mine/icon-107@2x.webp" @click="toSearch"/>
      </div>
      <div class="category-list">
        <div 
          :class="['category-item', index === activeTab ? 'active' : '']" 
          v-for="(item, index) in categoryList" 
          :key="index"
          @click="changeTab(index)">
            {{item.name}}
          </div>
      </div>
    </div>
    <div class="content qustion-scroll">
      <div class="overview" v-if="activeTab === categoryList.length - 1">
        <p class="title">云之本主机列表页面功能总览：</p>
        <p class="item">· 连    接：连接云电脑远程桌面，操作使用云电脑。</p>
        <p class="item">· 重    启：如果遇到连接等问题可尝试进行重启云电脑进行解决。</p>
        <p class="item">· 一键还原：将对云主机进行还原操作，并且会清除除了云盘内的所有资料。</p>
        <p class="item">· 主机续费：云主机快要到期，点击续费按钮，选择需要续费使用的时间进行续费。</p>
        <p class="item">· 主机列表：点击后会跳转至主机列表页面。</p>
        <p class="item">· 商    城：点击后跳转至商城页面，可以在商城购买需要的主机。</p>
        <p class="item">· 消    息：点击后进入消息列表，可以查看所有收到的消息。</p>
        <p class="item">· 客    服：如果使用有困难可以点击客服，联系客服解决困难。</p>
        <p class="item">· 个人中心：查看卡券消费记录，以及修改密码，修改绑定手机号。</p>
        <p class="item">· 退出登录：退出当前账号。</p>
        <p class="item">· 刷    新：如页面显示问题，可以尝试刷新解决。</p>
        <p class="item">· 声    音：点击后可以对云本的声音进行设置。</p>
        <p class="item">· 设    置：进入设置页面设置网络，更新版本及云本基本信息。</p>
        <p class="item">· 重    启：重启云之本。</p>
        <p class="item">· 关    机：关机。</p>
        <img preview="overview" @click="previewOverview" preview-text="" :src="overviewImg" class="img" />
      </div>
      <div class="question-item" v-for="(info, index) in list" :key="index" :id="info.contentNo">
        <div class="question-title" @click="expandChange(info.index)">
          <div class="index">
            {{info.index}}
          </div>
          <div class="title">{{info.title}}</div>
          <img src="@/assets/image/mine/icon-108@2x.webp" class="arrow" v-if="!info.expand" />
          <img src="@/assets/image/mine/icon-109@2x.webp" class="arrow" v-else/>
        </div>
        <div class="question-answer" v-show="info.expand">
          <div class="answer-item" v-for="(answer, idx) in info.content" :key="idx">
            <span class="a">
              <template  v-if="idx === 0">A:</template>
            </span>
            <div class="answer-value" >
              <template v-if="answer.type === 'text'">{{answer.value}}</template>
              <img class="answer-img" @click="preview(info.content, answer.value)" v-if="answer.type === 'image'" :src="answer.value" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="intro-place-holder">
      <div class="intro-nav flex" v-if="activeTab === categoryList.length - 1 && list.length > 0">
        <div class="line"></div>
        <div class="nav-list">
          <div class="nav-item flex pointer" :class="currentNav === item.contentNo ? 'actived' : ''" v-for="(item, index) in list" :key="index" @click="navChange(item)">
            <span class="text">{{item.title}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

 <script>
import { ref, getCurrentInstance } from 'vue'
import api from '@/config/api.js'
import { ElInput, ElMessage } from 'element-plus'
import PreviewPic from 'vue-preview-pictures'
import { useRouter } from 'vue-router'
// https://github.com/kailong321200875/vue-preview-pictures
import { 
  QUESTION_ARTIEL_TYPE,
  INTRO_ARTIEL_TYPE_VALUE,
  QUESTION_ARTIEL_TYPE_VALUE } from "@/config/const.js"
export default {
  components: {
    ElInput
  },
  setup () {
    const { ctx } = getCurrentInstance()
    const router = useRouter()
    const search = ref('')
    const overviewImg = ref('https://static.yunzhiqu.com/2020-07-15/15948025517237852.png')
    const categoryList = ref([])
    const activeTab = ref(0)
    const list = ref([])
    const currentNav = ref('')
    async function getCategory() {
      let res = await ctx.$axios.post(api.queryDicList, {
        codeTypeNo: QUESTION_ARTIEL_TYPE,
        pageSize: 9999
      })
      if (res.code !== 200) {
        ElMessage.error(res.message)
        return
      }
      res.data.dataList = res.data.dataList.filter(item => {
        return item.state === 1
      })

      res.data.dataList.push({
        name: '使用说明',
        serialNo: -1,
      })
      categoryList.value = res.data.dataList
      if (!res.data || res.data.dataList.length === 0) {
        return
      }
      // activeTab.value = res.data.dataList.length - 1
      getList()
    }

    async function getList () {
      let param = {
        currentPage: 1,
        pageSize: 9999,
        type: activeTab.value < categoryList.value.length - 1 ? QUESTION_ARTIEL_TYPE_VALUE : INTRO_ARTIEL_TYPE_VALUE
      }
      if (activeTab.value < categoryList.value.length - 1) {
        param.categories = categoryList.value[activeTab.value * 1].serialNo
      }
      let res = await ctx.$axios.post(api.getQuestionList, param)
      if (res.code !== 200) {
        ElMessage.error(res.message)
        return
      }
      if (!res.data) {
        return
      }
     
      res.data.dataList.forEach((item, index) => {
        item.index = index + 1
        item.expand = false
        item.content = JSON.parse(item.content)
      })

      if (activeTab.value === categoryList.value.length - 1 && res.data.dataList.length > 0) {
        currentNav.value = res.data.dataList[0].contentNo
      }

      list.value = res.data.dataList
    }

    getCategory()
    return { search, categoryList, activeTab, list, getList, currentNav, overviewImg,
      changeTab (index) {
        activeTab.value = index
        list.value = []
        getList()
      },
      expandChange (index) {
        const nlist = JSON.parse(JSON.stringify(list.value))
        nlist[index - 1].expand = !nlist[index - 1].expand
        list.value = nlist
      },
      preview (content, currentUrl) {
        let list = content.filter(item => {
          return item.type === 'image'
        }).map(item => {
          return item.value
        })
        PreviewPic({
          index: list.indexOf(currentUrl),
          list
        })
      },
      previewOverview () {
        PreviewPic({
          list: [overviewImg.value]
        })
      },
      navChange (item) {
        currentNav.value = item.contentNo
        document.getElementsByClassName('qustion-scroll')[0].scrollTop = document.getElementById(item.contentNo).offsetTop - 100
      },
      toSearch () {
        if (search.value.trim() === '') {
          ElMessage.warning('请输入内容')
          return
        }
        router.push(`/search_question?title=${encodeURIComponent(search.value)}`)
      }
    }
  }
}
</script>



<style lang="scss" scoped>
.question {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  .left {
    width: 350px;
    color: $color-l1-l;
    min-height: 600px;
    .search {
      background: rgba(255, 255, 255, .28);
      border-radius: 9px;
      font-size: $fontsize-l6;
      display: flex;
      align-items: center;
      height: 25px;
      .question-input {
        @media screen and (max-width: $media-max) {
          font-size: $fontsize-l7;
        }
      }
      .icon {
        width: 18px;
        margin-right: 20px;
        cursor: pointer;
        @media screen and (max-width: $media-max) {
          width: 13px;
        }
      }
    }
    .category-list {
      margin-top: 10px;
      .category-item {
        margin-top: 20px;
        height: 60px;
        line-height: 60px;
        background: rgba(255, 255, 255, .28);
        border-radius: 10px;
        box-sizing: border-box;
        padding: 0 32px;
        cursor: pointer;
        @media screen and (max-width: $media-max) {
          height: 42px;
          margin-top: 15px;
          line-height: 42px;
          padding: 0 20px;
        }
      }
      .active {
        background: $color-primary;
      }
    }
  }
  .content {
    max-height: 650px;
    width: 700px;
    overflow-x: hidden;
    margin-bottom: 20px;
    overflow-y: auto;
    padding-top: 45px;
    margin-left: 50px;
    @media screen and (max-width: $media-max) {
      width: 500px;
      max-height: 500px;
    }
    .question-item {
      padding: 20px;
      border-radius: 10px;
      background: rgba(255, 255, 255, .18);
      margin-bottom: 16px;
      cursor: pointer;
      @media screen and (max-width: $media-max) {
        padding: 15px;
        margin-bottom: 12px;
      }
      .question-title {
        display: flex;
        align-items: center;
        color: $color-l1-l;
       
        .index {
          width: 18px;
          height: 18px;
          line-height: 18px;
          text-align: center;
          border-radius: 50%;
          font-size: 12px;
          background: $color-primary;
          @media screen and (max-width: $media-max) {
            width: 16px;
            height: 16px;
            line-height: 16px;
          }
        }
        .title {
          flex: 1;
          margin: 0 18px;
          font-size: $fontsize-l3;
          @media screen and (max-width: $media-max) {
            font-size: $fontsize-l5;
            margin: 0 4px;
          }
        }
        .arrow {
          width: 14px;
          vertical-align: top;
          @media screen and (max-width: $media-max) {
            width: 10px;
          }
        }
      }
      .question-answer {
        margin-top: 20px;
        .answer-item {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          font-size: $fontsize-l5;
          color: $color-l1-l;
          @media screen and (max-width: $media-max) {
            font-size: 13px;
          }
          .a {
            display: inline-block;
            width: 26px;
            color: #FF0000;
            margin-left: 14px;
            @media screen and (max-width: $media-max) {
              font-size: 13px;
              width: 20px;
              margin-left: 14px;
            }
          }
          .answer-value {
            flex: 1;
            .answer-img {
              max-width: 100%;
              vertical-align: top;
            }
          }
        }
      }
    }
  }
}

.intro-place-holder {
  margin-left: 20px;
  min-width: 134px;
}

.intro-nav {
  align-items: center;
  
  position: relative;
  .line {
    width: 2px;
    background: #D8D8D8;
    height: 100%;
    position: absolute;
    left: 1px;;
    bottom: 15px;
    top: 15px;
    // min-height: 368px;
  }
  .nav-list {
    .nav-item {
      align-items: center;
      .text {
        font-size: 12px;
        line-height: 22px;
        margin-top: 4px;
        color: #999999;
        margin-left: 6px;
        position: relative;
        padding-left: 8px;
        cursor: pointer;
        &::before {
          content: ' ';
          position: absolute;
          left: -9px;
          top: 4px;
          display: inline-block;
          width: 8px;
          height: 8px;
          border: 1px solid #CECECE;
          border-radius: 50%;
          background: white;
        }
      }
    }
    .actived {
      .text {
        color: #00CCFF;
        &::before { 
          width: 10px;
          height: 10px;
          left: -10px;
          top: 3px;
          background: #00CCFF;
          border: 1px solid #00CCFF;
        }
      }
    }
  }
  
  .actived {
    color: #11A0FE;
  }
}

.overview {
  .title {
    font-size: 20px;
    color: $color-l1-l;
    padding-bottom: 20px;
  }
  .item {
    font-size: 16px;
    color: $color-l1-l;
    line-height: 33px;
    display: flex;
    align-items: center;
  }
  .img {
    max-width: 600px;
    margin-top: 10px;
  }
}
</style>

<style lang="scss">
.question-input {
  line-height: 35px!important;
 .el-input__inner {
   height: 35px!important;
   line-height: 35px!important;
 } 
}
.qustion-scroll {
  padding-right: 10px;
  &::-webkit-scrollbar {
    background: rgba(255, 255, 255, .25);
    width: 10px;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    width: 6px!important;
    height: 43px;
    opacity: 1;
    background: #bbbbbb;
    border-radius: 4px;
  }
}
</style>


