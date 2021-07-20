<template>
  <el-dialog
    :title="null"
    :width="is1366 ? '314px' : '440px'"
    title="提示"
    v-model="showDialog"
    :show-close="false"
    :before-close="handleClose">
    <template #title>
      <div class="title">
        修改昵称
      </div>
    </template>
    <div class="dialog-cnt">
      <img class="close" src="@/assets/image/mine/icon-23@2x.webp" @click="handleClose" />
      <el-input class="name" v-model="name" maxlength="15" type="text" placeholder="请输入您要修改的昵称"/>
      <el-button :class="['save', name.length > 0 ? '' : 'disable']" type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { ref, getCurrentInstance, computed, watch } from 'vue';
import api from '@/config/api.js'
import { ElDialog, ElInput, ElButton, ElMessage } from 'element-plus'
export default {
  components: {
    ElDialog,
    ElInput,
    ElButton
  },
  setup (props, context) {
    const { ctx } = getCurrentInstance()
    let showDialog = ref(true)
    let name = ref(ctx.$store.state.user.userNickName)
    const is1366 = computed(() => {
      return ctx.$store.state.is1366
    })
    function handleClose () {
      context.emit('close')
    }

    async function save () {
      if (name.value.trim() === '') {
        ElMessage.error('昵称不能为空')
        return
      }

      let res = await ctx.$axios.post(api.userInfoUpdate, {
        userName: ctx.$store.state.user.userName || "",
        userPicture: ctx.$store.state.user.userPicture || "",
        userEmail: ctx.$store.state.user.userEmail || "",
        userNickName: name.value.trim(),
      })
      if (res.code !== 200) {
        ElMessage.error(res.message)
        return
      }
      ElMessage.success('修改成功')
      ctx.$emit('editName', name.value.trim())
      context.emit('close')
    }

    return { showDialog, name, save, handleClose, is1366 }
  }
}
</script>

<style lang="scss" scoped>
  .title {
    color: $color-primary;
    font-size: $fontsize-l2;
    padding-top: 10px;
    padding-bottom: 35px;
    @media screen and (max-width: $media-max) {
      font-size: $fontsize-l3;
      padding-bottom: 0;
    }
  }
  .close {
    position: absolute;
    right: 16px;
    top: 16px;
    width: 15px;
    cursor: pointer;
  }
  .dialog-cnt {
    text-align: center;
    .name {
      width: 340px;
      font-size: $fontsize-l5;
      @media screen and (max-width: $media-max) {
        width: 242px;
      }
    }
    .save {
      width: 124px;
      height: 40px;
      margin: 0 auto;
      margin-top: 120px;
      color: $color-l1-l;
      font-size: $fontsize-l5;
      background-color: $color-primary;
      cursor: pointer;
      border-radius: 25px;
      @media screen and (max-width: $media-max) { 
        margin-top: 72px;
        width: 88px;
        height: 30px;
        min-height: 30px!important;
        padding: 0!important;
        font-size: $fontsize-l6;
      }
    }
    .disable {
      cursor: not-allowed;
      border: none;
      background-color: #ddd!important;
    }
  }
</style>



