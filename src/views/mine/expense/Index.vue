<template>
    <div class="title">
      <template v-if="isShowDetail">
        <img src="@/assets/image/mine/icon-91@2x.webp" class="back-icon" @click="hideDetail" >
        <span class="detail-title">消费详情-主机购买</span>
      </template>
      <span v-else>消费记录</span>
    </div>
    <div class="cont">
    <el-table
      :data="list"
      class="mine-transparent-table"
      v-show="!isShowDetail && list.length > 0"
      max-height="520">
      <el-table-column
        label="消费时间"
        prop="createTime"
        :width="is1366 ? 170 : 185">
      </el-table-column>
      <el-table-column
        label="到期时间"
        prop="renewDueTime"
        :width="is1366 ? 170 : 185">
      </el-table-column>
      <el-table-column
        label="商品名称"
        prop="productInfoAndVmInfoVO.productName"
        :width="is1366 ? 140 : 200">
      </el-table-column>
      <el-table-column
        label="收费方式"
        :width="is1366 ? 100 : 100">
        <template #default="scope">
          {{['支付宝', '微信', '水晶支付'][scope.row.payType]}}
        </template>
      </el-table-column>
      <el-table-column
        label="消费金额"
        :width="is1366 ? 110 : 150"
        >
        <template #default="scope">
          {{scope.row.payType === 2 ? (scope.row.handle + '水晶') : (scope.row.handle / 1000 + '元')}}
        </template>
      </el-table-column>
      <el-table-column
        label="订单状态"
        :width="is1366 ? 100 : 125"
        >
        <template #default="scope">
          {{['待支付', '支付成功', '支付失败'][scope.row.state]}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        :width="is1366 ? 100 : 150">
        <template #default="scope">
          <el-button
            v-if="scope.row.productInfoAndVmInfoVO"
            class="operate-btn to-detail"
            type="primary"
            @click="showDetail(scope.row.productInfoAndVmInfoVO)" 
            size="small">
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="!isShowDetail && list.length > 0"
      class="mine-el-pagin"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      v-model:currentPage="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage">
    </el-pagination>
    <Detail v-if="isShowDetail" :info="info" />
    <div class="empty" v-if="!isShowDetail && list.length === 0">
      <img src="@/assets/image/mine/empty_expense@2x.webp" />
      <div class="text">暂无消费记录！</div>
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance, computed } from 'vue'
import api from '@/config/api.js'
import { 
  TIME_UNIT_LIST,
  SYSEM_DISK_ID,
  HARD_DISK_ID,
  GRAPHIC_MEMORY_ID,
  OPERATE_SYSTEM_ID
  } from "@/config/const.js"
import { ElButton, ElTable, ElTableColumn, ElPagination } from 'element-plus'
import Detail from './component/Detail.vue'

export default {
  components: {
    ElButton,
    ElTable,
    ElTableColumn,
    ElPagination,
    Detail
  },
  setup() {
    const { ctx } = getCurrentInstance()
    let list = ref([])
    let systemList = ref([])
    let hardDiskList = ref([])
    let graphicsMemoryList = ref([])
    let operateSystemList = ref([])
    // list = [{"productInfoAndVmInfoVO":{"productName":"办公标准版","productTypeName":"商务专区","id":2,"name":"运营商专用云电脑","cpu":"4","memory":"4.0","operateSystem":"1","systemDisk":"2","hardDisk":"1","graphicsMemory":"1","state":1},"orderNo":"AYSPSC202103040002","userCardId":-1,"productNo":"AYSP2020050004","vmId":2,"duration":1,"durationUnit":2,"handle":80000,"actuallyPay":80000,"payType":2,"state":1,"renewDueTime":"2021-04-04 17:09:47","createTime":"2021-03-04 17:09:48"},{"productInfoAndVmInfoVO":{"productName":"云游戏","productTypeName":"游戏专区","id":3,"name":"云游戏","cpu":"6","memory":"12.0","operateSystem":"1","systemDisk":"1","hardDisk":"3","graphicsMemory":"3","state":1},"orderNo":"AYSPSC202101280001","userCardId":-1,"productNo":"AYSP2020050003","vmId":3,"duration":1,"durationUnit":2,"handle":499000,"actuallyPay":499000,"payType":2,"state":1,"renewDueTime":"2021-02-28 14:47:22","createTime":"2021-01-28 14:47:22"},{"productInfoAndVmInfoVO":{"productName":"办公标准版","productTypeName":"商务专区","id":2,"name":"运营商专用云电脑","cpu":"4","memory":"4.0","operateSystem":"1","systemDisk":"2","hardDisk":"1","graphicsMemory":"1","state":1},"orderNo":"AYSPSC202101250005","userCardId":-1,"productNo":"AYSP2020050004","vmId":2,"duration":1,"durationUnit":2,"handle":80000,"actuallyPay":80000,"payType":2,"state":1,"renewDueTime":"2021-02-25 16:01:23","createTime":"2021-01-25 16:01:23"},{"productInfoAndVmInfoVO":{"productName":"办公标准版","productTypeName":"商务专区","id":2,"name":"运营商专用云电脑","cpu":"4","memory":"4.0","operateSystem":"1","systemDisk":"2","hardDisk":"1","graphicsMemory":"1","state":1},"orderNo":"AYSPSC202012220002","userCardId":-1,"productNo":"AYSP2020050004","vmId":2,"duration":1,"durationUnit":2,"handle":80000,"actuallyPay":80000,"payType":2,"state":1,"renewDueTime":"2021-01-22 11:12:17","createTime":"2020-12-22 11:12:17"},{"productInfoAndVmInfoVO":{"productName":"云游戏","productTypeName":"游戏专区","id":3,"name":"云游戏","cpu":"6","memory":"12.0","operateSystem":"1","systemDisk":"1","hardDisk":"3","graphicsMemory":"3","state":1},"orderNo":"AYSPSC202011270002","userCardId":-1,"productNo":"AYSP2020050003","vmId":3,"duration":1,"durationUnit":1,"handle":19000,"actuallyPay":19000,"payType":2,"state":1,"renewDueTime":"2020-11-28 12:08:09","createTime":"2020-11-27 12:08:09"},{"productInfoAndVmInfoVO":{"productName":"线上测试专用1","productTypeName":"商务专区","id":2,"name":"运营商专用云电脑","cpu":"4","memory":"4.0","operateSystem":"1","systemDisk":"2","hardDisk":"1","graphicsMemory":"1","state":1},"orderNo":"AYSPSC202011260001","userCardId":-1,"productNo":"AYSP2020110002","vmId":2,"duration":1,"durationUnit":1,"handle":100,"actuallyPay":100,"payType":0,"state":1,"renewDueTime":"2020-11-27 14:24:34","createTime":"2020-11-26 14:24:33"},{"productInfoAndVmInfoVO":{"productName":"云游戏","productTypeName":"游戏专区","id":3,"name":"云游戏","cpu":"6","memory":"12.0","operateSystem":"1","systemDisk":"1","hardDisk":"3","graphicsMemory":"3","state":1},"orderNo":"AYSPSC202009240008","userCardId":-1,"productNo":"AYSP2020050003","vmId":3,"duration":1,"durationUnit":2,"handle":499000,"actuallyPay":499000,"payType":2,"state":1,"renewDueTime":"2020-12-24 11:38:18","createTime":"2020-11-12 11:50:51"},{"productInfoAndVmInfoVO":{"productName":"线上测试专用1","productTypeName":"商务专区","id":2,"name":"运营商专用云电脑","cpu":"4","memory":"4.0","operateSystem":"1","systemDisk":"2","hardDisk":"1","graphicsMemory":"1","state":1},"orderNo":"AYSPSC20201105000a","userCardId":-1,"productNo":"AYSP2020110002","vmId":2,"duration":3,"durationUnit":1,"handle":3000,"actuallyPay":3000,"payType":2,"state":1,"renewDueTime":"2020-11-08 19:53:26","createTime":"2020-11-05 19:53:26"},{"productInfoAndVmInfoVO":{"productName":"云游戏","productTypeName":"游戏专区","id":3,"name":"云游戏","cpu":"6","memory":"12.0","operateSystem":"1","systemDisk":"1","hardDisk":"3","graphicsMemory":"3","state":1},"orderNo":"AYSPSC202009240008","userCardId":-1,"productNo":"AYSP2020050003","vmId":3,"duration":1,"durationUnit":2,"handle":499000,"actuallyPay":499000,"payType":2,"state":1,"renewDueTime":"2020-11-24 11:38:18","createTime":"2020-10-20 18:02:23"},{"productInfoAndVmInfoVO":{"productName":"办公标准版","productTypeName":"商务专区","id":2,"name":"运营商专用云电脑","cpu":"4","memory":"4.0","operateSystem":"1","systemDisk":"2","hardDisk":"1","graphicsMemory":"1","state":1},"orderNo":"AYSPSC202009270006","userCardId":-1,"productNo":"AYSP2020050004","vmId":2,"duration":1,"durationUnit":2,"handle":80000,"actuallyPay":80000,"payType":2,"state":1,"renewDueTime":"2020-11-27 15:12:39","createTime":"2020-09-27 15:27:06"}]
    // list.length = 5
    let currentPage = ref(1)
    let pageSize = ref(5)
    let totalPage = ref(0)
    let isShowDetail = ref(false)
    let info = ref({})
    let is1366 = computed(() => {
      return ctx.$store.state.is1366
    })

    function handleSizeChange (size) {
      pageSize.value = size
      currentPage.value = 1
      getList()
    }

    function handleCurrentChange (page) {
      currentPage.value = page
      getList()
    }

    function showDetail (data) {
      info.value = data
      console.log(info.value)
      isShowDetail.value = true
    }

    function hideDetail () {
      isShowDetail.value = false
    }

    async function queryDicList (codeTypeNo) {
      let res = await ctx.$axios.post(api.queryDicList, {
        codeTypeNo,
        pageSize: 9999,
      })
      return res.data.dataList
    }

    async function getVmConfig () {
      systemList.value = await queryDicList(SYSEM_DISK_ID)
      hardDiskList.value = await queryDicList(HARD_DISK_ID)
      graphicsMemoryList.value = await queryDicList(GRAPHIC_MEMORY_ID)
      operateSystemList.value = await queryDicList(OPERATE_SYSTEM_ID)
      getList()
    }

    async function getList () {
      let res = await ctx.$axios.post(api.queryExpensesRecord, { currentPage: currentPage.value, pageSize: pageSize.value })
      if (res.code !== 200 || !res.data) {
        return
      }
      res.data.dataList.forEach(item => {
        if (item.productInfoAndVmInfoVO) {
          systemList.value.forEach(obj => {
            if (obj.serialNo === +item.productInfoAndVmInfoVO.systemDisk) {
              item.productInfoAndVmInfoVO.systemDiskName = obj.name
            }
          })
          hardDiskList.value.forEach(obj => {
            if (obj.serialNo === +item.productInfoAndVmInfoVO.hardDisk) {
              item.productInfoAndVmInfoVO.hardDiskName = obj.name
            }
          })
          graphicsMemoryList.value.forEach(obj => {
            if (obj.serialNo === +item.productInfoAndVmInfoVO.graphicsMemory) {
              item.productInfoAndVmInfoVO.graphicsMemoryName = obj.name
            }
          })
          operateSystemList.value.forEach(obj => {
            if (obj.serialNo === +item.productInfoAndVmInfoVO.operateSystem) {
              item.productInfoAndVmInfoVO.operateSystemName = obj.name
            }
          })
          item.productInfoAndVmInfoVO.durationUnitName = TIME_UNIT_LIST[item.durationUnit].name
          item.productInfoAndVmInfoVO.duration = item.duration
          item.productInfoAndVmInfoVO.handle = item.handle
          item.productInfoAndVmInfoVO.userCardId = item.userCardId
          item.productInfoAndVmInfoVO.actuallyPay = item.actuallyPay
          item.productInfoAndVmInfoVO.payType = item.payType
        }
      })
      list.value = res.data.dataList
      totalPage.value = res.data.page.totalPage
    }
    getVmConfig()
    return { list, currentPage, pageSize, totalPage, handleSizeChange, handleCurrentChange, is1366, 
      showDetail, isShowDetail, hideDetail, info  }
  }
}
</script>

<style lang="scss" scoped>
.title {
  padding: 80px 0 22px 30px;
  font-size: $fontsize-l2;
  color: $color-l1-l;
  text-align: left;
  border-bottom: solid 1px rgba(255, 255, 255, .4);
  position: relative;
  @media screen and (max-width: $media-max){
    padding: 40px 0 10px 20px;
    font-size: $fontsize-l4;
    .detail-title {
      padding-top: 30px;
      display: block;
    }
  }
  .back-icon {
    position: absolute;
    left: 30px;
    top: 30px;
    width: 40px;
    cursor: pointer;
    @media screen and (max-width: $media-max) {
      top: 22px;
      width: 30px;
    }
  }
}
.cont {
  padding-left: 30px;
}
.operate-btn {
  width: 84px;
  height: 26px;
  line-height: 26px;
  min-height: 26px;
  padding: 0;
  border-radius: 13px;
  @media screen and (max-width: $media-max) {
    width: 60px;
    height: 18px;
    min-height: 18px;
    line-height: 18px;
  }
}
.empty {
  text-align: center;
  padding-top: 100px;
  img {
    width: 350px;
    margin: 0 auto;
  }
  .text {
    font-size: $fontsize-l5;
    margin-top: 27px;
    color: $color-l1-l;
  }
}
</style>



