<template>
  <div class="vminfo reflect">
    <Comtain width="355px" height="417px">
      <VmInfo @onChange="showConfigChange" />
    </Comtain>
    <div class="vm-config" v-if="isShowConfig">
      <Blur width="150px" height="417px">
        <VmConfig  @onChange="showConfigChange" />
      </Blur>
    </div>
  </div>
</template>

<script>
import Comtain from '../../../components/Contain.vue'
import Blur from '../../../components/Blur.vue'
import VmConfig from './VmConfig.vue'
import VmInfo from './VmInfo.vue'
export default {
  name: "Vm",
  components: {
    Comtain,
    VmConfig,
    VmInfo,
    Blur
  },
  data() {
    return {
      isShowConfig: false, // 是否显示虚机配置
    }
  },
  methods: {
    showConfigChange(val) {
      this.isShowConfig = val;
    }
  }
}
</script>

<style lang="scss" scoped>
.vminfo{
  position: relative;
  width: 357px;
  // width: 100%;
  .vm-config{
    width: 150px;
    position: absolute;
    right: -150px;
    top: 0;
    // z-index: -1;
    bottom: 0;
    overflow: hidden;
    border-radius: 0 13px 13px 0;
  }
}
</style>