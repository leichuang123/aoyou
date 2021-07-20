<template>
  <div class="vm-list">
    <template v-if="vmList.length > 0">
      <MyVM v-for="(item, index) of vmList" :key="index" :info="item" @refreshList="getVmInfoList"/>
    </template>
    <template v-if="vmList.length === 0">
      <Empty :type="1" :height="500" />
    </template>
  </div>
</template>

<script>
import { getVmInfoList, queryDicList } from  "@/server/api.js"
import MyVM from "./MyVM.vue"
import Empty from "./Empty.vue"
import {
  // SYSEM_DISK_ID,
  // HARD_DISK_ID,
  GRAPHIC_MEMORY_ID,
  OPERATE_SYSTEM_ID,
  // IMAGE_PREFIX,
  TIME_UNIT_LIST,
} from '@/config/public_config'
export default {
  name: "Machine",
  data() {
    return {
      vmList: [],
       graphicList: [],
      operateSystemList: [],
    }
  },
  components: {
    MyVM,
    Empty,
  },
  async mounted() {
    await this.getDicList(GRAPHIC_MEMORY_ID)
    await this.getDicList(OPERATE_SYSTEM_ID)
    this.getVmInfoList();
  },
  methods: {
    async getDicList (codeTypeNo) {
      let res = await queryDicList({
        codeTypeNo,
        pageSize: 9999,
      })
      if (res.code !== 200) {
        this.$message.error(res.message)
        return
      }
      switch (codeTypeNo) {
        // case SYSEM_DISK_ID:
        //   this.systemDiskList = res.data.dataList
        //   break;
        // case HARD_DISK_ID:
        //   this.hardList = res.data.dataList
        //   break;
        case GRAPHIC_MEMORY_ID:
          this.graphicList = res.data.dataList
          break;
        case OPERATE_SYSTEM_ID:
          this.operateSystemList = res.data.dataList
          break;
        default:
          break;
      }
    },
    async getVmInfoList() {
      let params = {
        currentPage: 1,
        pageSize: 9999,
        productName: "",
        deviceNo: ""
      }
      let response = await getVmInfoList(params);
      if(response.code !== 200) {
        this.$message.error(response.message);
        return false
      }
      response.data.dataList.forEach(info => {
        this.graphicList.forEach(item => {
          if (item.serialNo === +info.vmInfoVO.graphicsMemory) {
            info.vmInfoVO.graphicsMemoryName = item.name
          }
        })
        this.operateSystemList.forEach(item => {
          if (item.serialNo === +info.vmInfoVO.operateSystem) {
            info.vmInfoVO.operateSystemName = item.name
          }
        })
        info.productInfoVO.shortcutDurationVOList.forEach(element => {
          element.durationUnitName = typeof TIME_UNIT_LIST[element.durationUnit] !== 'undefined' ? TIME_UNIT_LIST[element.durationUnit].name : ''
        })
      })
      this.vmList = response.data.dataList;
    }
  }
}
</script>

<style lang="less" scoped>
.vm-list{
  display: flex;
  flex-wrap: wrap;
}
</style>