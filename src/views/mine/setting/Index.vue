<template>
  <div class="setting-content">
    <el-row class="row" >
      <el-col class="item" :span="12">
        <div class="item-content">
          <img class="icon" src="@/assets/image/mine/icon-99@2x.webp" />
          <div class="info">
            <div class="name">昵称</div>
            <div class="desc-list">
              <div class="desc-item">天王盖地虎</div>
            </div>
          </div>
          <span class="btn" @click="showEditName">修 改</span>
        </div>
      </el-col>
      <el-col class="item" :span="12">
        <div class="item-content">
          <img class="icon" src="@/assets/image/mine/icon-100@2x.webp" />
          <div class="info">
            <div class="name">更换绑定手机号</div>
            <div class="desc-list">
              <div class="desc-item">绑定手机可以用于登录云之趣帐号</div>
              <div class="desc-item">重置密码或其他安全验证</div>
            </div>
          </div>
          <span type="primary" class="btn" @click="jump('/mine/change_mobile')">修 改</span>
        </div>
      </el-col>
    </el-row>
    <el-row class="row" >
      <el-col class="item" :span="12">
        <div class="item-content">
          <img class="icon" src="@/assets/image/mine/icon-101@2x.webp" />
          <div class="info">
            <div class="name">账号密码</div>
            <div class="desc-list">
              <div class="desc-item">用于保护帐号信息和登录安全</div>
            </div>
          </div>
          <span type="primary" class="btn" @click="jump('/mine/change_password')">修 改</span>
        </div>
      </el-col>
      <el-col class="item" :span="12">
        <div class="item-content">
          <img class="icon" src="@/assets/image/mine/icon-102@2x.webp" />
          <div class="info">
            <div class="name">主机重启</div>
            <div class="desc-list">
              <div class="desc-item">当出现问题时可以点击进行一键</div>
              <div class="desc-item">重启操作</div>
            </div>
          </div>
          <span type="primary" class="btn" @click="showRebootDialog">重 启</span>
        </div>
      </el-col>
    </el-row>
    <EditName v-if="isShowEditNameDialog" @close="closeEditNameDialog" />
    <Reboot v-if="isShowRebootDialog" @close="closeRebootDialog" :list="vmList"/>
  </div>
</template>


<script>
import { ElRow, ElCol, ElButton, ElMessage } from 'element-plus'
import EditName from './component/EditName.vue'
import Reboot from './component/Reboot.vue'
import api from '@/config/api.js'
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
export default {
  components: {
    ElRow,
    ElCol,
    EditName,
    ElButton,
    Reboot,
  },
  setup () {
    const { ctx } = getCurrentInstance()
    const router = useRouter()
    const vmList = ref([])
    let isShowEditNameDialog = ref(false)
    let isShowRebootDialog = ref(false)
    function closeEditNameDialog () {
      isShowEditNameDialog.value = false
    }
    function showEditName () {
      isShowEditNameDialog.value = true
    }
    function closeRebootDialog() {
      isShowRebootDialog.value = false
    }
    async function showRebootDialog() {
      let res = await ctx.$axios.post(api.vmListPaging, {
        productName: '',
        currentPage: 1,
        pageSize: 9999
      })
      if (res.code !== 200) {
        ElMessage.error(res.message)
        return
      }
      if (res.data.dataList.length === 0) {
        ElMessage.error('暂无可重启云主机')
        return
      }
      res.data.dataList.push(res.data.dataList[0])
      vmList.value = res.data.dataList
      isShowRebootDialog.value = true
    }
    function jump(path) {
      router.push(path)
    }

    return { isShowEditNameDialog, closeEditNameDialog, showEditName, jump, isShowRebootDialog, showRebootDialog, closeRebootDialog, vmList }
  }
}
</script>

<style lang="scss">
  .setting-content {
    padding-top: 60px;
    padding-right: 30px;
    .row {
      margin-bottom: 40px;
      .item {
       padding-left: 64px;
       box-sizing: border-box;
       @media screen and (max-width: $media-max) {
         padding-left: 30px;
       }
       .item-content {
        height: 130px;
        box-sizing: border-box;
        padding: 0 30px;
        background: rgba(251,251,251,0.22);
        border: 1px solid #0091ff;
        border-radius: 13px;
        display: flex;
        align-items: center;
        // filter: blur(26px);
        @media screen and (max-width: $media-max) {
          height: 92px;
          padding: 0 20px;
        }
       }
       .icon {
         height: 66px;
         @media screen and (max-width: $media-max) {
          height: 47px;
        }
       }
        .info {
         flex: 1;
         margin-left: 20px;
          .name {
            font-size: $fontsize-l3;
            color: $color-l1-l;
            text-align: left;
            @media screen and (max-width: $media-max) {
              font-size: $fontsize-l5;
            }
          }
          .desc-list {
            margin-top: 8px;
            .desc-item {
              font-size: $fontsize-l5;
              color: $color-l1-l;
              line-height: 18px;
              text-align: left;
              @media screen and (max-width: $media-max) {
                font-size: $fontsize-l7;
              }
            }
          }
        }
        .btn {
          display: inline-block;
          width: 66px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          font-size: $fontsize-l5;
          color: $color-l1-l;
          background-color: $color-primary;
          border-radius: 15px;
          cursor: pointer;
          @media screen and (max-width: $media-max) {
            font-size: $fontsize-l6;
            width: 50px;
            height: 22px;
            line-height: 22px;
          }
        }
      }
    }
  }
</style>

