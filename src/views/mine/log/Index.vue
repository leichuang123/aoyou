<template>
    <div class="title">
      <span>操作日志</span>
      <div class="filter">
        <el-checkbox class="checkbox" v-model="checked" @change="checkChange">
          <span class="checkbox-label">仅查询操作失败日志</span>
        </el-checkbox>
        <el-select class="select transparent-select" v-model="action" placeholder="请选择" @change="getList">
          <el-option
            v-for="(item, index) in acionList"
            :key="index"
            :label="item"
            :value="index">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="cont">
    <el-table
      :data="list"
      class="mine-transparent-table"
      max-height="520">
      <el-table-column
        label="操作类型"
        prop="createTime"
        :width="is1366 ? 200 : 200">
        <template #default="scope">
          {{acionList[scope.row.action]}}
        </template>
      </el-table-column>
      <el-table-column
        label="结 果"
        :width="is1366 ? 200 : 200">
        <template #default="scope">
          {{scope.row.apiResultCode * 1 === 200 ? '成功' : '失败'}}
        </template>
      </el-table-column>
      <el-table-column
        label="时 间"
        prop="createTime"
        :width="is1366 ? 200 : 200">
      </el-table-column>
      <el-table-column
        label="备 注"
        prop="remarks"
        :width="is1366 ? 270 : 400">
        <template #default="scope">
          <template v-if="scope.row.action === 1">
            {{scope.row.remarks === 'hard' ? '硬重启' : '软重启'}}
          </template>
          <template>{{scope.row.remarks}}</template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="mine-el-pagin"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      v-model:currentPage="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage">
    </el-pagination>
  </div>
</template>

<script>
import { ref, getCurrentInstance, computed } from 'vue'
import api from '@/config/api.js'
import { ElButton, ElTable, ElTableColumn, ElPagination, ElSelect, ElOption, ElCheckbox, } from 'element-plus'
export default {
  components: {
    ElButton,
    ElTable,
    ElTableColumn,
    ElPagination,
    ElSelect,
    ElOption,
    ElCheckbox
  },
  setup() {
    const { ctx } = getCurrentInstance()
    let list = ref([])
    let checked = ref(false)
    let action = ref(0)
    let acionList = ref(['全部', '重启', '重置', '分配'])
    // let tres = {"code":200,"message":"success","data":{"page":{"currentPage":1,"prePage":1,"nextPage":2,"pageSize":10,"totalPage":3,"totalCount":30},"dataList":[{"userNo":"C201904302311414977","action":3,"ip":"220.191.33.118","vmType":5,"productNo":"AYSP2020050004","orderNo":"AYSPSC202103040002","machineKey":"PRODVM202103040002","machineToken":"VpP34rpJqk3","machineId":"fbb29f3c-a288-41b2-be17-c5cbe37704f9","machineName":"5761C01TR040498","resetMachineId":"","resetMachineName":"","deviceNo":"","channelNo":1,"apiResultBody":"success","apiResultCode":"200","remarks":"分配虚机业务结束","createTime":"2021-03-04 17:09:53","updateTime":"2021-03-04 17:09:57","systemUserNo":"","upgradeNo":""},{"userNo":"C201904302311414977","action":3,"ip":"220.191.36.245","vmType":3,"productNo":"AYSP2020050003","orderNo":"AYSPSC202101280001","machineKey":"PRODVM202101280001","machineToken":"UyHayf8q83p","machineId":"","machineName":"","resetMachineId":"","resetMachineName":"","deviceNo":"","channelNo":1,"apiResultBody":"success","apiResultCode":"200","remarks":"分配虚机业务结束","createTime":"2021-01-28 14:47:23","updateTime":"2021-01-28 14:47:26","systemUserNo":"","upgradeNo":""},{"userNo":"C201904302311414977","action":3,"ip":"115.193.187.145","vmType":5,"productNo":"AYSP2020050004","orderNo":"AYSPSC202101250005","machineKey":"PRODVM202101250003","machineToken":"233Jpz3fmEa","machineId":"162621de-addc-4d1d-8078-f9c7e0c7663c","machineName":"5761C01TR030758","resetMachineId":"","resetMachineName":"","deviceNo":"","channelNo":1,"apiResultBody":"success","apiResultCode":"200","remarks":"分配虚机业务结束","createTime":"2021-01-25 16:01:23","updateTime":"2021-01-25 16:01:30","systemUserNo":"","upgradeNo":""},{"userNo":"C201904302311414977","action":3,"ip":"115.193.188.153","vmType":5,"productNo":"AYSP2020050004","orderNo":"AYSPSC202012220002","machineKey":"PRODVM202012220002","machineToken":"nCVs248n3y","machineId":"2e34a3bd-eb18-4dc7-aa80-d49191770bad","machineName":"5761C01TR030746","resetMachineId":"","resetMachineName":"","deviceNo":"","channelNo":1,"apiResultBody":"success","apiResultCode":"200","remarks":"分配虚机业务结束","createTime":"2020-12-22 11:12:17","updateTime":"2020-12-22 11:12:24","systemUserNo":"","upgradeNo":""},{"userNo":"C201904302311414977","action":3,"ip":"60.186.217.87","vmType":3,"productNo":"AYSP2020050003","orderNo":"AYSPSC202011270002","machineKey":"PRODVM202011270002","machineToken":"YWu2y55j3j","machineId":"","machineName":"","resetMachineId":"","resetMachineName":"","deviceNo":"","channelNo":1,"apiResultBody":"success","apiResultCode":"200","remarks":"分配虚机业务结束","createTime":"2020-11-27 12:08:09","updateTime":"2020-11-27 12:08:18","systemUserNo":"","upgradeNo":""},{"userNo":"C201904302311414977","action":3,"ip":"60.186.217.87","vmType":5,"productNo":"AYSP2020110002","orderNo":"AYSPSC202011260001","machineKey":"PRODVM202011260001","machineToken":"wxkW5W8cfK3","machineId":"6b8b67da-32b3-4ad8-b674-edaac3b4be90","machineName":"5761C01TR040448","resetMachineId":"","resetMachineName":"","deviceNo":"","channelNo":2,"apiResultBody":"success","apiResultCode":"200","remarks":"人民币购买虚机业务结束","createTime":"2020-11-26 14:24:33","updateTime":"2020-11-26 14:25:16","systemUserNo":"","upgradeNo":""},{"userNo":"C201904302311414977","action":3,"ip":"115.193.170.142","vmType":5,"productNo":"AYSP2020110002","orderNo":"AYSPSC20201105000a","machineKey":"PRODVM20201105000a","machineToken":"zWdpy4e3c44X","machineId":"c919b98c-4928-4499-b162-de4b829de91b","machineName":"5761C01TR030712","resetMachineId":"","resetMachineName":"","deviceNo":"","channelNo":1,"apiResultBody":"success","apiResultCode":"200","remarks":"分配虚机业务结束","createTime":"2020-11-05 19:53:26","updateTime":"2020-11-05 19:53:28","systemUserNo":"","upgradeNo":""},{"userNo":"C201904302311414977","action":2,"ip":"115.205.65.157","vmType":5,"productNo":"AYSP2020050004","orderNo":"AYSPSC202009270005","machineKey":"PRODVM202009270003","machineToken":"2RmpqkW7G74","machineId":"ed6941b3-bde3-4fd0-966b-3555d94285db","machineName":"5761C01TR040372","resetMachineId":"732d5330-169e-4b6b-867e-3e8b56eba6db","resetMachineName":"5761C01TR040387","deviceNo":"","channelNo":1,"apiResultBody":"success","apiResultCode":"200","remarks":"","createTime":"2020-10-09 16:38:50","updateTime":"2020-10-09 16:38:50","systemUserNo":"","upgradeNo":""},{"userNo":"C201904302311414977","action":2,"ip":"115.205.65.157","vmType":5,"productNo":"AYSP2020050004","orderNo":"AYSPSC202009270005","machineKey":"PRODVM202009270003","machineToken":"2RmpqkW7G74","machineId":"ed6941b3-bde3-4fd0-966b-3555d94285db","machineName":"5761C01TR040372","resetMachineId":"1e882ebb-1c0e-42a9-a14c-f7ddb3cd5f6e","resetMachineName":"5761C01TR040386","deviceNo":"","channelNo":1,"apiResultBody":"success","apiResultCode":"200","remarks":"","createTime":"2020-10-09 16:38:50","updateTime":"2020-10-09 16:38:50","systemUserNo":"","upgradeNo":""},{"userNo":"C201904302311414977","action":2,"ip":"115.205.65.157","vmType":5,"productNo":"AYSP2020050004","orderNo":"AYSPSC202009270006","machineKey":"PRODVM202009270004","machineToken":"aj3j5p2tAQB","machineId":"7904d6ba-7106-4125-a34b-f072e7e91142","machineName":"5761C01TR030640","resetMachineId":"3f88712d-7605-4211-8d20-ab936c0b3b84","resetMachineName":"5761C01TR040385","deviceNo":"","channelNo":1,"apiResultBody":"success","apiResultCode":"200","remarks":"","createTime":"2020-10-09 16:37:32","updateTime":"2020-10-09 16:37:32","systemUserNo":"","upgradeNo":""}]}}
    // list = tres.data.dataList
    // console.log(list)
    let currentPage = ref(1)
    let pageSize = ref(5)
    let totalPage = ref(0)
    let isShowDetail = ref(false)
    let info = ref(null)
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
      isShowDetail.value = true
    }

    function hideDetail () {
      isShowDetail.value = false
    }

    function actionChange () {
      getList()
    }

    function checkChange () {
      getList()
    }

    async function getList () {
      let res = await ctx.$axios.post(api.vmOperateLog, {
        action: action.value,
        currentPage: currentPage.value,
        pageSize: pageSize.value,
        userNo: ctx.$store.state.user.userNo,
        isError: checked.value
      })
      if (res.code !== 200) {
        return
      }
      list.value = res.data.dataList
      totalPage.value = res.data.page.totalPage
    }
    getList()
    return { list, currentPage, pageSize, totalPage, handleSizeChange, getList, checkChange, is1366,
    handleCurrentChange, showDetail, isShowDetail, hideDetail, checked, action, acionList, actionChange  }
  }
}
</script>

<style lang="scss" scoped>
.checkbox-label {
  color: $color-l1-l;
}
.title {
  padding: 80px 30px 22px 30px;
  font-size: $fontsize-l2;
  color: $color-l1-l;
  text-align: left;
  border-bottom: solid 1px rgba(255, 255, 255, .4);
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  @media screen and (max-width: $media-max){
    padding: 40px 30px 10px 20px;
    font-size: $fontsize-l4;
  }
  .select {
    margin-left: 16px;
    width: 120px;
  }
}
.cont {
  padding-left: 30px;
}
</style>



