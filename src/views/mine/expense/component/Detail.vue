<template>
  <el-row class="row">
    <el-col :span="12" class="col">
      <el-row type="flex" class="item border-bottom-opacity-4-line">
        <span class="label">主机类型：</span>
        <span class="value">{{info.productTypeName}}</span>
      </el-row>
    </el-col>
    <el-col :span="12" class="col">
      <el-row type="flex" class="item border-bottom-opacity-4-line">
        <span class="label">主机配置：</span>
        <span class="value">{{info.cpu}}vcpu/{{info.memory}}/{{info.operateSystemName}}/{{info.systemDiskName}}/{{info.hardDiskName}}/{{info.graphicsMemoryName}}</span>
      </el-row>
    </el-col>
  </el-row>
  <el-row class="row">
    <el-col :span="12" class="col">
      <el-row type="flex" class="item border-bottom-opacity-4-line">
        <span class="label">购买时长：</span>
        <span class="value">{{info.duration}}{{info.durationUnitName}}</span>
      </el-row>
    </el-col>
    <el-col :span="12" class="col">
      <el-row type="flex" class="item border-bottom-opacity-4-line">
        <span class="label">价格：</span>
        <span class="value">
          <template v-if="+info.payType === 2">{{info.handle}}水晶</template>
          <template v-else>￥{{info.handle / 1000}}</template>
        </span>
      </el-row>
    </el-col>
  </el-row>
  <el-row class="row">
    <el-col :span="12" class="col">
      <el-row type="flex" class="item border-bottom-opacity-4-line">
        <span class="label">优惠券：</span>
        <span class="value">{{info.userCardId === -1 ? '未使用' : info.userCardId}}</span>
      </el-row>
    </el-col>
    <el-col :span="12" class="col">
      <el-row type="flex" class="item border-bottom-opacity-4-line">
        <span class="label">实付金额：</span>
        <span class="value">
          <template v-if="+info.payType === 2">{{info.actuallyPay}}水晶</template>
          <template v-else>￥{{info.actuallyPay / 1000}}</template>
        </span>
      </el-row>
    </el-col>
  </el-row>
  <el-row class="row">
    <el-col :span="12" class="col">
      <el-row type="flex" class="item border-bottom-opacity-4-line">
        <span class="label">支付方式：</span>
        <span class="value">{{['支付宝', '微信', '水晶支付'][+info.payType]}}</span>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { ElRow, ElCol } from 'element-plus'
import { ref } from 'vue'
export default {
  components: {
    ElRow,
    ElCol,
  },
  props: {
    info: {
      type: Object,
      default: {}
    }
  },
  setup (props, context) {
    console.log(props.info)
    let info = ref(props.info)
    return { info }
  }
}
</script>

<style lang="scss" scoped>
  .row {
    width: 100%;
    .col {
      box-sizing: border-box;
      &:nth-child(2n-1) {
        padding-right: 40px;
      }
      &:nth-child(2n) {
        padding-left: 40px;
      }
    }
  }
  .item {
    box-sizing: border-box;
    padding: 22px 10px;
    color: $color-l1-l;
    font-size: $fontsize-l5;
    @media screen and (max-width: $media-max) { 
      padding: 14px 10px;
      font-size: $fontsize-l6;
    }
    .label {
      width: 100px;
      text-align: left;
    }
    .value {
      flex: 1;
      text-align: right;
    }
  }
</style>


