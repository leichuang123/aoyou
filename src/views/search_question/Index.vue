<template>
  <div class="search-question">
    <div class="search">
      <el-input class="transparent-input question-input" placeholder="输入您的问题找寻答案" v-model="search" @keyup.enter="getList" />
      <img class="icon" src="@/assets/image/mine/icon-107@2x.webp" @click="getList" />
    </div>
    <div class="content qustion-scroll">
      <div class="content-info">
        <img class="back" @click="back" src="@/assets/image/mine/icon-91@2x.webp" />
        <div class="tab-c">
          <el-tabs class="mine-tabs question-tabs" @tab-click="tabClick">
            <el-tab-pane v-for="(tab, index) in categoryList" :key="tab.serialNo" >
              <template #label>
                <div class="tab-pane-name">{{tab.name}}</div>
              </template>
              <div class="tabs-content">
                <div class="item" v-for="info in list" :key="info.contentNo">
                  <div class="question-title">
                    <span class="q">Q:</span>
                    <span>{{info.title}}</span>
                  </div>
                  <div class="question-answer">
                    <div class="answer-item" v-for="(answer, idx) in info.content" :key="idx">
                      <span class="a">
                        <template  v-if="idx === 0">A:</template>
                      </span>
                      <div :class="['answer-value']" >
                        <template v-if="answer.type === 'text'">{{answer.value}}</template>
                        <img class="answer-img" @click="preview(info.content, answer.value)" v-if="answer.type === 'image'" :src="answer.value" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <span class="result-label">搜索结果：</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance } from 'vue'
import api from '@/config/api.js'
import { useRouter, useRoute } from 'vue-router'
import { ElTabs, ElTabPane, ElInput } from "element-plus"
import PreviewPic from 'vue-preview-pictures'
import { 
  QUESTION_ARTIEL_TYPE,
  INTRO_ARTIEL_TYPE_VALUE,
  QUESTION_ARTIEL_TYPE_VALUE } from "@/config/const.js"
export default {
  components: {
    ElTabs,
    ElTabPane,
    ElInput
  },
  setup () {
    const { ctx } = getCurrentInstance()
    let router = useRouter()
    const route = useRoute()
    let categoryList = ref([])
    const activeTab = ref('0')
    const search = ref(decodeURIComponent(route.query.title || ''))
    const list = ref([])
    async function getList () {
      let param = {
        currentPage: 1,
        pageSize: 9999,
        type: activeTab.value * 1 < categoryList.value.length - 1 ? QUESTION_ARTIEL_TYPE_VALUE : INTRO_ARTIEL_TYPE_VALUE,
        title: search.value,
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
        item.content = JSON.parse(item.content)
      })
      list.value = res.data.dataList
    }
    async function getTabs () {
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
      getList()
    }
    getTabs()
    return {
      categoryList, search, list, activeTab, getList,
      back () {
        router.back()
      },
      tabClick (tab) {
        activeTab.value = tab.index + ''
        list.value = []
        getList()
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
      }
    }
  }
}
</script>




<style lang="scss" scoped>
.inline-block {
  display: inline-block!important;
}
.back {
  width: 40px;
  margin-top: 20px;
  margin-left: 20px;
  cursor: pointer;
  @media screen and (max-width: $media-max) {
    width: 29px;
  }
}
.search-question {
  width: 1100px;
  margin: 0 auto;
  padding-bottom: 40px;
  .content {
    width: 100%;
    box-sizing: border-box;
    margin: 0 auto;
    height: 656px;
    margin-top: 10px;
    overflow: auto;
    @media screen and (max-width: $media-max) {
      height: 500px;
    }
    .content-info {
      background: rgba(255, 255, 255, .18);
      border-radius: 10px;
    }
    .tabs-content {
      box-sizing: border-box;
      padding: 33px 22px;
      .item {
        margin-bottom: 60px;
        @media screen and (max-width: $media-max) {
          margin-bottom: 30px;
        }
      }
    }
  }
}
.tab-c {
  position: relative;
  margin-top: 20px;
  .result-label {
    font-size: $fontsize-l3;
    color: $color-l1-l;
    position: absolute;
    left: 22px;
    top: 8px;
    z-index: 2;
    @media screen and (max-width: $media-max) {
      font-size: $fontsize-l5;
      top: 4px;
    }
  }
}
.search {
  width: 350px;
  background: rgba(255, 255, 255, .28);
  border-radius: 9px;
  font-size: $fontsize-l6;
  display: flex;
  align-items: center;
  @media screen and (max-width: $media-max) {
    width: 300px;
    .question-input {
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
.question-title {
  font-size: $fontsize-l3;
  color: $color-l1-l;
  @media screen and (max-width: $media-max) {
    font-size: $fontsize-l5;
  }
  .q {
    color: $color-primary;
    margin-right: 10px;
  }
}
.question-answer {
  margin-top: 20px;
  padding-left: 60px;
  @media screen and (max-width: $media-max) {
    margin-top: 10px;
    padding-left: 20px;
  }
  .answer-item {
    margin-bottom: 16px;
    display: flex;
    align-items: flex-start;
    font-size: $fontsize-l5;
    color: $color-l1-l;
    @media screen and (max-width: $media-max) {
      font-size: 13px;
    }
    .a {
      display: inline-block;
      width: 26px;
      color: #FF0000;
      @media screen and (max-width: $media-max) {
        width: 20px;
      }
    }
    .answer-value {
      flex: 1;
      .answer-img {
        max-width: 60%;
        display: inline-block;
        vertical-align: top;
      }
    }
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

.question-tabs {
  .el-tabs__nav-wrap {
    padding-left: 90px;
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


