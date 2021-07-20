<template>
    <div class="notice">
      <div class="title">
        <span>消息中心</span>
        <div class="btns">
          <div class="btn delete" v-if="checkedList.length > 0" @click="deleteNotice">删除</div>
          <div :class="['btn read-all', checkedList.length > 0 ? 'active' : '' ]" @click="readAll">全部已读</div>
        </div>
      </div>
      <div class="cont">
      <el-table
        :data="list"
        class="mine-transparent-table"
        max-height="520"
        @selection-change="handleSelectionChange"
        @row-click="rowClick"
        >
        <el-table-column
        type="selection"
        width="55">
        </el-table-column>
        <el-table-column
          label="消息内容"
          prop="title"
          :min-width="is1366 ? 300: 600">
          <template #default="scope">
            <span class="red-circle" v-if="scope.row.state === 0"></span>
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="时间"
          :min-width="is1366 ? 300: 600"
          prop="createTime"
          >
        </el-table-column>
        <el-table-column
          label="类型"
          prop="createTime"
          >
          <template #default="scope">
            {{scope.row.type === 1 ? '站内消息' : '邀请消息'}}
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

    <el-dialog
      :title="null"
      width="700px"
      v-model="isShowDetail"
      :show-close="false"
      :before-close="handleClose">
      <template #title>
        <div class="dialog-title">
          {{info.title}}
        </div>
      </template>
      <div class="dialog-cnt">
        <img class="close" src="@/assets/image/mine/icon-23@2x.webp" @click="handleClose" />
        <div class="text">{{info.content}}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, getCurrentInstance, computed } from 'vue'
import api from '@/config/api.js'
import { ElButton, ElTable, ElTableColumn, ElPagination, ElSelect, ElOption, ElCheckbox, ElDialog, ElMessage, ElMessageBox } from 'element-plus'
export default {
  components: {
    ElButton,
    ElTable,
    ElTableColumn,
    ElPagination,
    ElSelect,
    ElOption,
    ElCheckbox,
    ElDialog
  },
  setup() {
    const { ctx } = getCurrentInstance()
    let list = ref([])
    let checkedList = ref([])
    let currentPage = ref(1)
    let pageSize = ref(5)
    let totalPage = ref(0)
    let isShowDetail = ref(false)
    let info = ref({})
    function handleSizeChange (size) {
      pageSize.value = size
      currentPage.value = 1
      getList()
    }

    let is1366 = computed(() => {
      return ctx.$store.state.is1366
    })

    function handleCurrentChange (page) {
      currentPage.value = page
      getList()
    }

    async function getList () {
      let res = await ctx.$axios.post(api.getNotice, {
        currentPage: currentPage.value,
        pageSize: pageSize.value,
      })
      if (res.code !== 200) {
        return
      }
      // res.data.dataList.forEach(item => {
      //   item.state = 0
      // })
      // res.data.dataList.push(res.data.dataList[0])
      // res.data.dataList.push(res.data.dataList[0])
      // res.data.dataList.push(res.data.dataList[0])
      // res.data.dataList.push(res.data.dataList[0])
      list.value = res.data.dataList
      totalPage.value = res.data.page.totalPage
    }
    getList()
    return { list, currentPage, pageSize, info, totalPage, handleSizeChange, getList, handleCurrentChange, isShowDetail, checkedList, is1366,
      handleSelectionChange (list) {
        checkedList.value = list
      },
      async rowClick (data) {
        info.value = data
        isShowDetail.value = true
        if (data.state === 0) {
          let res = await ctx.$axios.post(api.noticeSignRead, {
            flag: false,
            noticeList: [{
              noticeNo: data.noticeNo,
              noticeSign: data.noticeSign
            }]
          })
          if (res.code !== 200) {
            return
          }
          let nlist = JSON.parse(JSON.stringify(list.value))
          nlist.forEach(item => {
            item.state = 1
          })
          list.value = nlist
        }
      },
      handleClose () {
        isShowDetail.value = false
      },
      async deleteNotice () {
        if (checkedList.value.length === 0) {
          ElMessage.warning('请选择需要删除的消息')
          return
        }
        let confirm = await new Promise(resolve => {
          ElMessageBox.confirm('确认删除？', '温馨提示').then(() => {
            resolve(true)
          }).catch(() => {
            resolve(false)
          })
        })
        if (!confirm) {
          return
        }
        let res = await ctx.$axios.post(api.noticeSignDelete, {
          flag: false,
          noticeList: checkedList.value.map(item => {
            return {
              noticeNo: item.noticeNo,
              noticeSign: item.noticeSign
            }
          })
        })
        if (res.code !== 200) {
          ElMessage.error(res.message)
          return
        }
        ElMessage.success('删除成功')
        checkedList.value = []
        getList()
      },
      async readAll () {
        if (checkedList.value.length === 0) {
          ElMessage.warning('请选择需要操作的消息')
          return
        }
        let confirm = await new Promise(resolve => {
          ElMessageBox.confirm('确认设置已读？', '温馨提示').then(() => {
            resolve(true)
          }).catch(() => {
            resolve(false)
          })
        })
        if (!confirm) {
          return
        }
        let res = await ctx.$axios.post(api.noticeSignRead, {
          flag: false,
          noticeList: checkedList.value.map(item => {
            return {
              noticeNo: item.noticeNo,
              noticeSign: item.noticeSign
            }
          })
        })
        if (res.code !== 200) {
          ElMessage.error(res.message)
          return
        }
        ElMessage.success('操作成功')
        checkedList.value = []
        getList()
      },
    }
  }
}
</script>

<style lang="scss" scoped>
.notice {
  max-width: 1578px;
  margin: 0 auto;
  background: rgba(251,251,251,0.27);
  border-radius: 12px;
  backdrop-filter: blur(26px);
  margin-bottom: 30px;
  @media screen and (max-width: $media-max) {
    max-width: 1120px;
  }
  .mine-transparent-table {
    width: 100%;
  }
  .red-circle {
    &::after {
      content: ' ';
      width: 8px;
      height: 8px;
      margin-right: 10px;
      display: inline-block;
      background: #ff5435;
      border-radius: 50%;
    }
  }
}
.checkbox-label {
  color: $color-l1-l;
}
.title {
  padding: 40px 0 30px 30px;
  font-size: $fontsize-l2;
  color: $color-l1-l;
  text-align: left;
  border-bottom: solid 1px rgba(255, 255, 255, .4);
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  @media screen and (max-width: $media-max) {
    padding: 35px 0 20px 30px;
    font-size: $fontsize-l4;
  }
  .btns {
    display: flex;
    justify-content: center;
    .btn {
      border-radius: 15px;
      font-size: $fontsize-l6;
      margin-right: 40px;
      box-sizing: border-box;
      cursor: pointer;
      height: 28px;
      line-height: 28px;
    }
    .delete {
      color: #ff5435;
      width: 62px;
      text-align: center;
      background: #ffffff;
      border: solid #ff5435 1px;
      border-radius: 15px;
    }
    .read-all {
      width: 88px;
      text-align: center;
      background: #ffffff;
      color: $color-l2;
      border: solid transparent 1px;
    }

    .active {
      border: solid $color-primary 1px;
      color: $color-primary;
    }
  }
}
.cont {
  padding: 30px;
  min-height: 650px;
  @media screen and (max-width: $media-max) {
    min-height: 400px;
  }
}

.dialog-title {
  text-align: left;
  font-weight: 500;
  color: $color-l1-d;
  font-size: 22px;
}

.dialog-cnt {
  padding: 0 20px 20px 20px;
  .close {
    position: absolute;
    right: 16px;
    top: 16px;
    width: 15px;
    cursor: pointer;
  }
  .text {
    color: $color-l2;
    font-size: $fontsize-l6;
    line-height: 36px;
    text-indent: 2em;
    min-height: 260px;
  }
}

</style>



