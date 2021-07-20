
<template>
  <el-dialog
    custom-class="mine-reboot-dialog"
    :title="null"
    :width="is1366 ? '314px' : '440px'"
    v-model="showDialog"
    :show-close="false"
    :before-close="handleClose">
    <template #title v-if="list.length > 1">
      <div class="title">
        选择重启的主机
      </div>
    </template>
    <div :class="['dialog-cnt', list.length === 1 ? 'list-1' : '']">
      <img class="close" src="@/assets/image/mine/icon-23@2x.webp" @click="handleClose" />
      <div v-if="list.length === 1" class="tip-1">
        如有未保存的数据，请保存后再重启 <br />以免造成数据丢失
      </div>
      <el-select class="select" v-model="selectIndex" placeholder="" v-if="list.length > 1">
        <el-option :value="0" label="请选择"></el-option>
        <el-option v-for="(item, index) in list" :key="index + 1" :value="index + 1" :label="item.durationOrderVO.remarks || item.productName"></el-option>
      </el-select>
      <el-button :class="['save', selectIndex !== 0 ? '' : 'disable']" type="primary" @click="sure">确认重启</el-button>
      <div class="tip" v-if="list.length > 1">(如有未保存的数据,请保存后再重启,以免造成数据丢失)</div>
    </div>
  </el-dialog>
</template>

<script>
import { ref, getCurrentInstance, computed } from 'vue';
import api from '@/config/api.js'
import { ElDialog, ElInput, ElButton, ElSelect, ElOption, ElMessage } from 'element-plus'

export default {
  components: {
    ElDialog,
    ElInput,
    ElButton,
    ElSelect,
    ElOption
  },
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  setup (props, context) {
    const { ctx } = getCurrentInstance()
    const is1366 = computed(() => {
      return ctx.$store.state.is1366
    })
    let showDialog = ref(true)
    let list = ref(props.list)
    let name = ref('')
    let selectIndex = ref(list.value.length === 1 ? 1 : 0)
    function handleClose () {
      context.emit('close')
    }
    return { 
      showDialog, name, handleClose, selectIndex, list, is1366,
      async sure () {
        if (selectIndex.value * 1 === 0) {
          return
        }
        let res = await ctx.$axios.post(api.vmRestart, {
          machineKey: list.value[selectIndex.value - 1].durationOrderVO.machineKey,
          oprMode: 'hard',
        })
        if (res.code !== 200) {
          if (res.code === 10710010 || res.code === 10710011) {
            ElMessage.error(`云主机正在${res.code === 10710010 ? '重启' : '重置'}中，请稍后再试`)
            return
          }
          ElMessage.error(res.message)
          return
        }
        ElMessage.success('重启指令已发送')
        context.emit('close')
      }
    }
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
    .select {
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
        line-height: 30px;
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
    .tip {
      margin-top: 14px;
      font-size: $fontsize-l7;
      color: #999;
    }
    .tip-1{
      text-align: center;
      font-size: $fontsize-l4;
      color: $color-l1-d;
      margin-top: 10px;
      line-height: 34px;
      @media screen and (max-width: $media-max) {
        font-size: $fontsize-l6;
        line-height: 24px;
      }
    }
  }
  .list-1 {
    .save {
      margin-top: 40px;
      margin-bottom: 10px;
    }
  }
</style>



