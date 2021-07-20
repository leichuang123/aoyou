<template>
  <div class="service_support">
    <div class="top">
      <img class="bg" src="../../../assets/images/service_support/picture-24.png" />
      <div class="search-info">
        <div class="search">
          <input class="input" v-model="searchKey" placeholder="输入您的问题找寻答案" v-on:keyup.enter="search"/>
          <img class="icon" :src="searchKey === '' ? searchIconNormal : searchIconSelect" @click="search"/>
        </div>
      </div>
    </div>
    <div class="service">
      <v-tabs slider-color="#11A0FE" background-color="#ffffff" class="tabs" @change="tabChange">
        <v-tab  v-for="(item, index) in categoryList" :key="index" active-class="tab-active">
          <span class="text">{{item.name}}</span>
        </v-tab>
      </v-tabs>
      <v-expansion-panels class="panels kcy-service-panels" :flat="true">
        <v-expansion-panel
          class="panel"
          v-for="(item, index) in list"
          :key="index"
          @change="panelChange"
        >
          <v-expansion-panel-header>
            <div class="question-title">
              <span class="index">{{index + 1}}</span>
              {{item.title}}
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="panel-content">
              <div v-for="(obj, idx) in item.content" :key="idx">
                <div class="text" v-if="obj.type === 'text'">
                  <span class="a" v-if="idx === 0">A:</span>
                  {{obj.value}}
                </div>
                <img 
                  class="img" 
                  :src="obj.value" 
                  v-if="obj.type === 'image'" 
                  preview-text="" 
                  :preview="item.contentNo" 
                  :large="obj.value"
                  alt="点击查看大图"
                 />
              </div>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <div class="empty" v-if="list.length === 0">
        <img src="../../../assets/images/service_support/picture-25.png" class="img" />
        <div class="text">抱歉暂未匹配到相关问题！</div>
      </div>
      
      <div class="text-center pagin" v-if="paginLength > 0">
        <v-pagination
          :length="paginLength"
          v-model="currentPage"
          :total-visible="6"
          @input="pageChange"
          color="#19A5FE"
        ></v-pagination>
      </div>
    </div>
    <QiMoService />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getQuestionCategory, getQuestionList } from '@/server/api'
import QiMoService from '@/components/public/QiMoService.vue'
export default {
  name: 'ServiceSupport',
  computed: {
    ...mapGetters([
      'getCount'
    ])
  },
  components: {
    QiMoService,
  },
  data () {
    return {
      searchKey: '',
      searchIconNormal: require('../../../assets/images/service_support/icon-75.png'),
      searchIconSelect: require('../../../assets/images/service_support/icon-80.png'),
      currentPage: 1,
      pageSize: 10,
      categoryList: [],
      actveIndex: 0,
      total: 0,
      paginLength: 0,
      list: []
    }
  },
  mounted () {
    this.getCategoryList()
  },
  methods: {
    panelChange () {
      this.$previewRefresh()
      
    },
    tabChange (index) {
      this.actveIndex = index
      this.currentPage = 1;
      this.getList()
    },
    pageChange () {
      this.getList()
    },
    async getCategoryList () {
      let res = await getQuestionCategory({
        currentPage: 1,
        pageSize: 9999
      })
      if (res.code !== 200) {

        return
      }
      this.categoryList = res.data.dataList
      this.getList()
    },
    async getList () {
      let res = await getQuestionList({
        categories: this.categoryList[this.actveIndex].serialNo,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        title: this.searchKey,
        type: 2
      })
      if (res.code !== 200) {

        return
      }
      res.data.dataList.forEach(item => {
        item.content = JSON.parse(item.content)
      })
      this.list = res.data.dataList
      this.total = res.data.page.totalCount
      this.paginLength = parseInt(this.total / this.pageSize) + (this.total % this.pageSize === 0 ? 0 : 1)
      
    },
    add() {
      this.$store.dispatch('editCount',{count:122})
    },
    search () {
      this.currentPage = 1;
      this.getCategoryList()
    }
  }
}
</script>
<style lang="less" scoped>
  .service_support {
    .top{
      height: 230px;
      background-image: linear-gradient(225deg, #EBF6FF 0%, #FEFEFF 100%);
      position: relative;
      .bg {
        width: 987px;
        position: absolute;
        top: 0;
        right: 112px;
      }
      .search-info{
        width: 1200px;
        position: absolute;
        bottom: 0;
        left: 50%;
        margin-left: -600px;
        padding-bottom: 32px;
        padding-left: 60px;
        z-index: 2;
        .search {
          width: 440px;
          display: flex;
          align-items: center;
          border: solid 1px #E1E1E1;
          border-radius: 10px;
          height: 40px;
          line-height: 40px;
          padding: 0 16px;
          background: white;
          box-sizing: border-box;
          .input {
            flex: 1;
            font-size: 14px;
            line-height: 14px;
            border: none;
            outline: none;
            &::-webkit-input-placeholder {
              color: #999;
            }
          }
          .icon {
            width: 16px;
            margin-left: 16px;
            font-size: 14px;
            cursor: pointer;
          }
        }
      }
    }
    .service {
      width: 1200px;
      margin: 0 auto;
      background: white;
      min-height: 700px;
    }
    .tabs {
      border-bottom: solid 1px #E8E8E8;
      padding-left: 60px;
      .text {
        color: #666;
      }
      .tab-active {
        background: white;
        .text {
          color: #11A0FE;
        }
      }
    }
    .panels {
      padding-left: 60px;
      
      .panel {
        border-bottom: solid 1px #E8E8E8;
      }
      .question-title {
        padding: 24px 0;
        font-size: 20px;
        line-height: 20px;
        color: #2C2D3B;
        text-align: left;
        
        .index {
          display: inline-block;
          position: relative;
          top: -3px;
          width: 18px;
          height: 18px;
          text-align: center;
          line-height: 18px;
          color: white;
          font-size: 12px;
          border-radius: 50%;
          background: #11A0FE;
        }
      }
      .panel-content {
        background: #F3F9FF;
        padding: 24px 88px;
        .img {
          width: 480px;
          margin-top: 24px;
          display: block;
          cursor: pointer;
        }
        .text {
          font-size: 16px;
          color: #252525;
          line-height: 35px;
          .a {
            color: #FE1919;
          }
        }
        
      }
    }
    .pagin {
      padding: 32px 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .empty {
      text-align: center;
      padding-top: 96px;
      .img {
        width: 430px;
        margin: 0 auto;
      }
      .text {
        margin-top: 60px;
        font-size: 16px;
        color: #999999;
      }
    }
  }
</style>

