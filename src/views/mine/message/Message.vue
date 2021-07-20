<template>
  <div class="message">
    <div class="title">
      <p>消息中心</p>
      <template v-if="desserts.length > 0">
         <div class="btns">
          <button v-if="selected.length > 0" class="red-btn" @click="deleteCheck">删 除</button>
          <button v-if="selected.length > 0" class="blue-btn" @click="setAllRed">全部已读</button>
          <button v-if="selected.length <= 0" class="blue-btn disable-btn">全部已读</button>
        </div>
      </template>
     
    </div>
    <!-- 表格 -->
    <template v-if="desserts.length > 0">
      <v-data-table
        v-model="selected"
        :headers="headers"
        :disable-pagination="true"
        hide-default-footer
        :items="desserts"
        :single-select="false"
        item-key="noticeNo"
        show-select
        disable-sort
        show-expand
        @item-expanded="noticeSignRead"
        no-data-text="暂无数据"
        class="elevation-1"
      >
        <!-- <template v-slot:top>
          <v-switch v-model="singleSelect" label="Single select" class="pa-3"></v-switch>
        </template> -->
        <template v-slot:item.title="{ item }">
          <div>
            <p class="circle" :class="{'circle-show' : item.state === 0}"></p>
            {{item.title}}
          </div>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">{{item.content}}</td>
        </template>
        <template v-slot:item.type="{ item }">
          <span>{{item.type === 1 ? '站内消息' : '邀请消息'}}</span>
        </template>
      </v-data-table>
      <v-pagination
        v-if="totalPage > 0"
        v-model="currentPage"
        :length="totalPage"
      ></v-pagination>
    </template>
    <Empty :type="4" :height="800"  v-if="desserts.length === 0" />
  </div>
</template>

<script>
// unReadCount
import { getNotice, noticeSignRead, noticeSignDelete  } from "@/server/api.js"
import { PAGE_SIZE } from "@/config/public_config.js"
import Empty from "@/components/mine/Empty"
export default {
  name: "Message",
  data() {
    return {
      currentPage: 1,
      pagesize: PAGE_SIZE,
      totalPage: 1,
      selected: [],
      headers: [
        { text: '消息标题', value: 'title',},
        { text: '时间', value: 'createTime' },
        { text: '类型', value: 'type' },
        { text: '', value: 'data-table-expand' },
      ],
      desserts: [],
    }
  },
  mounted() {
    this.getNotice();
  },
  components: {
    Empty
  },
  methods: {
    async noticeSignRead(obj) {
      let item = obj.item;
      // 如果是未读消息，则执行已读接口
      if(item.state === 0) {
        let params = {
          flag: false,
          deviceNo: "",
          noticeList: [{
            noticeNo: item.noticeNo,
            noticeSign: item.noticeSign
          }]
        }
        
        const response = await noticeSignRead(params);
        if(response.code === 200) {
          this.getNotice();
        }
      }
    },
    async getNotice() {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pagesize,
        type: 1,
        deviceNo: "",
      }
      let response = await getNotice(params);
      if (response.code !== 200) {
        this.$message.error(response.message);
        return false;
      }
      this.desserts = response.data.dataList;
      this.totalPage = response.data.page.totalPage
    },
    async setAllRed () {
      if (this.selected.length === 0) {
        return
      }
      let noticeList = this.getSelectItem()
      let response = await noticeSignRead({
        flag: false,
        noticeList
      })
      if (response.code !== 200) {
        this.$message.error(response.message);
        return
      }
      this.selected = []
      this.$message.success("操作成功");
      this.currentPage = 1;
      this.getNotice()
      // this.unReadCount()
    },
    async deleteCheck () {
      
      let noticeList = this.getSelectItem()
      let response = await noticeSignDelete({
        flag: false,
        noticeList
      })
      if (response.code !== 200) {
        this.$message.error(response.message);
        return
      }
      this.selected = []
      this.$message.success('删除成功')
      this.getNotice()
      // this.unReadCount()
    },
    getSelectItem () {
      return this.desserts.filter(() => {
        return true
        // return this.selected.indexOf(index) !== -1
      }).map(item => {
        return {
          noticeNo: item.noticeNo,
          noticeSign: item.noticeSign
        }
      })
    },
  },
  watch: {
    currentPage() {
      this.getNotice();
    }
  }
}
</script>

<style lang="less" scoped>
.message{
  width: 1200px;
  min-height: 813px;
  background: #FFFFFF;
  box-shadow: 0 2px 9px 0 rgba(0,0,0,0.10);
  border-radius: 5px;
  margin: 20px auto;
  padding: 20px 30px;
  .title{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .name{
      font-size: 20px;
      color: rgba(0,0,0,0.85);
      line-height: 28px;
    }
    .btns{
      display: flex;
      button{
        display: block;
        padding: 0 14px;
        height: 24px;
        line-height: 24px;
        border-radius: 12px;
        margin: 0 15px;
        font-size: 14px;
      }
      .red-btn{
        color: #FF5435;
        border: 1px solid #FF5435;
      }
      .blue-btn{
        color: #11A0FE;
        border: 1px solid #11A0FE;
      }
      .disable-btn{
        filter: grayscale(100%);
        filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
        cursor: auto;
      }
    }
  }
}
.circle {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #FF5435;
  border-radius: 50%;
  margin-right: 10px;
  flex-shrink: 0;
  opacity: 0;
}
.circle-show{
  opacity: 1;
}
</style>