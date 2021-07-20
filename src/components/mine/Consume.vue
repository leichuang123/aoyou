<template>
<div style="min-height: 500px;">
  <template  v-if="desserts.length > 0">
  <!-- 列表 -->
  <div v-if="!isShowDetail">
    <v-data-table
      :headers="headers"
      :items="desserts"
      :items-per-page="5"
      :disable-pagination="true"
      hide-default-footer
      disable-sort
    >
      <template v-slot:item.productName="{ item }">
        <div>{{item && item.productInfoAndVmInfoVO ? item.productInfoAndVmInfoVO.productName : ''}}</div>
      </template>
      <template v-slot:item.payType="{ item }">
        <div>{{payTypeList[item.payType]}}</div>
      </template>
      <template v-slot:item.state="{ item }">
        <div>{{payStateList[item.state]}}</div>
      </template>
      <template v-slot:item.handle="{ item }">
        <div>
          {{+item.payType === 2 ? item.handle : item.handle/1000}}
          {{+item.payType === 2 ? '水晶' : '元'}}
        </div>
      </template>
      <template v-slot:item.operate="{ item }">
        <div>
         <button class="show-detail" @click="showDetail(item)">查看详情</button>
         <!-- <button @click="showDetail(item)">致富</button> -->
        </div>
      </template>
    </v-data-table>
    
    <v-pagination
      v-model="currentPage"
      :length="totalPage"
    ></v-pagination>
   
  </div>
  <!-- 详情 -->
  <div class="detail" v-if="isShowDetail">
    <div class="detial-back" @click="isShowDetail = false"></div>
    <div class="detail-title">消费详情-主机购买</div>
    <ul class="detail-list" v-if="detialData">
      <li class="detail-item">
        <p class="name">主机类型：</p>
        <p class="content">{{detialData.productInfoAndVmInfoVO.productTypeName}}</p>
      </li>
      <li class="detail-item">
        <p class="name">主机配置：</p>
        <p class="content">
          {{detialData.productInfoAndVmInfoVO.cpu}}
          /{{detialData.productInfoAndVmInfoVO.memory}}
          /{{detialData.operateSystemName}}
          /{{detialData.systemDiskName}}
          /{{detialData.hardDiskName}}
        </p>
      </li>
      <li class="detail-item">
        <p class="name">购买时长：</p>
        <p class="content">{{detialData.duration}}{{detialData.durationUnitName}}</p>
      </li>
      <li class="detail-item">
        <p class="name">价格：</p>
        <p class="content" v-if="+detialData.payType === 2">{{detialData.handle}}水晶</p>
        <p class="content" v-if="+detialData.payType !== 2">￥{{detialData.handle / 1000}}</p>
      </li>
      <li class="detail-item">
        <p class="name">优惠券：</p>
        <p class="content">{{getCouponInfo}}</p>
      </li>
      <li class="detail-item">
        <p class="name">实付金额：</p>
        <p class="content" v-if="+detialData.payType === 2">{{detialData.actuallyPay}}水晶</p>
        <p class="content" v-if="+detialData.payType !== 2">￥{{detialData.actuallyPay / 1000}}</p>
      </li>
      <li class="detail-item">
        <p class="name">支付方式：</p>
        <p class="content">{{payTypeList[detialData.payType]}}</p>
      </li>
    </ul>
  </div>
  </template>
  <Empty :type="3" v-if="desserts.length === 0" />
</div>
</template>

<script>
import { queryExpensesRecord, queryDicList } from '@/server/api'
import { PAGE_SIZE, TIME_UNIT_LIST,SYSEM_DISK_ID, HARD_DISK_ID, GRAPHIC_MEMORY_ID, OPERATE_SYSTEM_ID } from '@/config/public_config.js'
import Empty from "./Empty"

export default {
  name: "Consume",
  data() {
    return {
      currentPage: 1,
      totalPage: 0,
      totalCount: 0,
      pageSize: PAGE_SIZE,
      isShowDetail: false, // 显示详情
      detialData: null,
      // pageSize: 1,
      payTypeList:['支付宝', '微信', '水晶支付'],
      payStateList: ['待支付', '支付成功', '支付失败'],
      headers: [
        { text: '消费时间', value: 'createTime',align: 'start', },
        { text: '商品名称', value: 'productName' },
        { text: '收费方式', value: 'payType' },
        { text: '消费金额', value: 'handle' },
        { text: '订单状态', value: 'state' },
        { text: '操作', value: 'operate' },
      ],
      desserts: [],
      systemDiskList: null,
      hardDiskList: null,
      graphicsMemoryList: null,
      operateSystemList: null,
    }
  },
  async mounted() {
    this.queryExpensesRecord();
    this.systemDiskList = await this.queryDicList(SYSEM_DISK_ID);
    this.hardDiskList = await this.queryDicList(HARD_DISK_ID);
    this.graphicsMemoryList = await this.queryDicList(GRAPHIC_MEMORY_ID);
    this.operateSystemList = await this.queryDicList(OPERATE_SYSTEM_ID);
  },
  methods: {
    computedConfig(list, key) {
      let name = '';
      list.forEach(obj => {
        if (obj.serialNo === +key) {
          name = obj.name
        }
      })
      return name;
    },
    async queryDicList(codeTypeNo) {
      let params = {
        codeTypeNo,
        pageSize: 9999,
      }
      let response = await queryDicList(params);
      if (response.code !== 200) {
        return null
      } else {
        return response.data.dataList
      }
    },
    async queryExpensesRecord() {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        userNo: this.$store.getters.getUserInfo.userNo,
      }
      let response = await queryExpensesRecord(params);
      
      if(response.code !== 200){
        this.$message.error(response.message);
      }
      this.currentPage = response.data.page.currentPage;
      this.totalCount = response.data.page.totalCount;
      this.desserts = response.data.dataList;
      this.totalPage = response.data.page.totalPage;
    },
    showDetail(item) {
      let { systemDisk, hardDisk, memory, operateSystem } = item.productInfoAndVmInfoVO;
      // let productInfoAndVmInfoVO = item.productInfoAndVmInfoVO;
      this.isShowDetail = true;
      item.durationUnitName = TIME_UNIT_LIST[+item.durationUnit].name
      item.systemDiskName = this.computedConfig(this.systemDiskList,systemDisk)
      item.hardDiskName = this.computedConfig(this.hardDiskList,hardDisk)
      item.graphicsMemoryName = this.computedConfig(this.graphicsMemoryList,memory)
      item.operateSystemName = this.computedConfig(this.operateSystemList,operateSystem)
      this.detialData = item;
    },
    hideDetail(){
      this.isShowDetail = false;
      this.detialData = null;
    }
  },
  watch: {
    currentPage() {
      this.queryExpensesRecord();
    }
  },
  components: {
    Empty,
  },
  computed: {
    getCouponInfo() {
      if(this.detialData) {
        if(this.detialData.userCardId === -1) {
          return '未使用'
        } else {
          return this.detialData.userCardId
        }
      } else {
        return '-'
      }
    },
    
  }
}
</script>

<style lang="less" scoped>
.show-detail{
  display: block;
  padding:  0 10px;
  height: 24px;
  border: 1px solid #11A0FE;
  border-radius: 12px;
  font-size: 14px;
  color: #11A0FE;
  line-height: 22px;
}
.detial{
  padding: 20px 40px;
}
.detial-back{
  width: 40px;
  height: 24px;
  border: 1px solid #EDEDED;
  border-radius: 4px;
  background: url("../../assets/images/icon/left.png") no-repeat center center;
  background-size: 8px 14px;
  cursor: pointer;
}
.detail-title{
  height: 92px;
  line-height: 92px;
  border-bottom: 1px solid #E8E8E8;
  font-size: 20px;
  color: #11A0FE;
}
.detail-list{
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .detail-item{
    width: 524px;
    border-bottom: 1px solid #E8E8E8;
    min-height: 62px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    .name{
      flex-grow: 0;
      flex-shrink: 0;
    }
  }
}
</style>