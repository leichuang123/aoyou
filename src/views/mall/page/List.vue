
<template>
  <div class="mall-list">
    <img class="top-ad" src='@/assets/images/mall/index-banner.png' />
    <div class="content">
      <div class="bread">
        <span class="mall" @click="toMall()" >商城 </span>
        <span class="diver">&nbsp;&nbsp;/&nbsp;&nbsp;</span>
        <span class="current">{{name}}</span>
      </div>
      <div class="title">
        <div class="en">{{en.split('').join('  ')}}</div>
        <div class="name">{{name}}</div>
      </div>
      <div class="list">
        <MallListItem v-for="(obj, idx) in list" :key="idx" :obj="obj" @buy="buy" />
      </div>
      <div class="pagin" v-if="paginLength > 0">
        <v-pagination
          :length="paginLength"
          v-model="currentPage"
          :total-visible="6"
          @input="pageChange"
          color="#19A5FE"
        ></v-pagination>
      </div>
    </div>
    <QiMoService />
  </div>
</template>

<script>
import {
  SYSEM_DISK_ID,
  HARD_DISK_ID,
  GRAPHIC_MEMORY_ID,
  OPERATE_SYSTEM_ID,
  IMAGE_PREFIX,
} from '@/config/public_config'

import {
  queryDicList,
  getProductList,
} from '@/server/api.js'

import QiMoService from '@/components/public/QiMoService.vue'
import MallListItem from '../components/MallListItem.vue'

export default {
  name: 'MallList',
  components: {
    QiMoService,
    MallListItem,
  },
  data () {
    return {
      systemDiskList: [],
      hardList: [],
      graphicList: [],
      operateSystemList: [],
      sectionList: [],
      typeNo: '',
      name: '',
      en: '',
      currentPage: 1,
      pageSize: 8,
      total: 0,
      list: [],
      paginLength: 0,

    }
  },
  async mounted () {
    this.typeNo = this.$route.query.typeNo
    this.name = decodeURIComponent(this.$route.query.name)
    this.en = decodeURIComponent(this.$route.query.en).toUpperCase()
    await this.getDicList(SYSEM_DISK_ID)
    await this.getDicList(HARD_DISK_ID)
    await this.getDicList(GRAPHIC_MEMORY_ID)
    await this.getDicList(OPERATE_SYSTEM_ID)
    this.getList()
  },
  methods: {
    toMall () {
      this.$router.push('/mall')
    },
    buy (productNo) {
      this.$router.push(`/mall/detail?productNo=${productNo}&typeNo=${this.typeNo}&name=${encodeURIComponent(this.name)}&en=${encodeURIComponent(this.en)}`)
    },
     pageChange () {
      this.getList()
    },
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
        case SYSEM_DISK_ID:
          this.systemDiskList = res.data.dataList
          break;
        case HARD_DISK_ID:
          this.hardList = res.data.dataList
          break;
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
    
    async getList () {
      let res = await getProductList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        typeNo: this.typeNo,
      })
      if (res.code !== 200) {
        this.$message.error(res.message)
        return
      }
      res.data.dataList.forEach(item => {
        item.cover = ''
        item.productPictureVOS.forEach(picture => {
          picture.url = picture.url.indexOf('http') === 0 ? picture.url : (IMAGE_PREFIX + picture.url)
          if (picture.type === 1) {
            item.cover = picture.url
          }
        })
        this.systemDiskList.forEach(obj => {
          if (obj.serialNo === +item.systemDisk) {
            item.systemDiskName = obj.name
          }
        })
        this.hardList.forEach(obj => {
          if (obj.serialNo === +item.hardDisk) {
            item.hardDiskName = obj.name
          }
        })
        this.graphicList.forEach(obj => {
          if (obj.serialNo === +item.graphicsMemory) {
            item.graphicsMemoryName = obj.name
          }
        })
        this.operateSystemList.forEach(obj => {
          if (obj.serialNo === +item.operateSystem) {
            item.operateSystemName = obj.name
          }
        })
      })
      this.list = res.data.dataList
      this.total = res.data.page.totalCount
      this.paginLength = parseInt(this.total / this.pageSize) + (this.total % this.pageSize === 0 ? 0 : 1)
    }
  }
}
</script>

<style lang="less" scoped>
.mall-list {
  text-align: center;
  .top-ad {
    width: 100%;
    vertical-align: top;
  }
  .content {
    width: 1200px;
    margin: 0 auto;
    padding-bottom: 40px;
    .bread {
      font-size: 18px;
      color: #666666;
      padding-top: 16px;
      text-align: left;
      .mall {
        cursor: pointer;
      }
    }
    .title {
      text-align: center;
      padding-top: 30px;
      .en {
        padding-bottom: 12px;
        position: relative;
        font-size: 20px;
        color: #444444;
        font-weight: bold;
        &::after {
          content: ' ';
          display: block;
          width: 126px;
          height: 2px;
          background: #19A5FE;
          position: absolute;
          left: 50%;
          bottom: 0;
          margin-left: -63px;
        }
      }
      .name {
        font-size: 18px;
        color: #666666;
        padding-top: 8px;
      }
    }
    .list {
      text-align: left;
      min-height: 460px;
    }
    .pagin {
      text-align: right;
      padding-top: 50px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
</style>
