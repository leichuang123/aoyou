
<template>
  <div class="mall-index">
    <img class="top-ad" src='@/assets/images/mall/index-banner.png' />
    <div class="content">
      <div class="section" v-for="(item, index) in sectionList" :key="index">
        <div class="head">
          <div class="left">
            <div class="name">{{item.name}}</div>
            <div class="en">{{item.en}}</div>
          </div>
          <button class="more" v-if="item.total > 4" @click="more(item)">
            更多 &gt;&gt;
          </button>
        </div>
        <div class="list">
          <MallListItem v-for="(obj, idx) in item.list" :key="idx" :obj="obj" @buy="buy"/>
        </div>
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

import QiMoService from '@/components/public/QiMoService.vue'
import MallListItem from '../components/MallListItem.vue'

import {
  queryDicList,
  getProductTypeList,
  getProductList,
} from '@/server/api.js'

export default {
  name: 'MallIndex',
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
    }
  },
  async mounted () {
    await this.getDicList(SYSEM_DISK_ID)
    await this.getDicList(HARD_DISK_ID)
    await this.getDicList(GRAPHIC_MEMORY_ID)
    await this.getDicList(OPERATE_SYSTEM_ID)
    this.getCategory()
  },
  methods: {
    more (info) {
      this.$router.push(`/mall/list?typeNo=${info.id}&en=${encodeURIComponent(info.en)}&name=${encodeURIComponent(info.name)}`)
    },
    buy (productNo) {
      this.$router.push(`/mall/detail?productNo=${productNo}`)
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
    async getCategory () {
      let res = await getProductTypeList({name: '', currentPages: 1, pageSize: 9999})
      if (res.code !== 200) {
        this.$message.error(res.message)
        return
      }
      
      const parentList = res.data.dataList.filter(item => {
        return +item.parentId === 0 && +item.state === 1
      })
      if (parentList.length === 0) {
        this.$message.error('商品一级分类异常')
        return
      }

      let sectionList = []
      let promiseList = []
      parentList.forEach(item => {
        res.data.dataList.forEach(obj => {
           if (obj.parentId === item.id && obj.state === 1) {
              obj.en = ''
              if (obj.name === '商务专区') {
               obj.en = 'business'
               
              } else if (obj.name === '娱乐游戏') {
                obj.en = 'entertainment'
              }
              sectionList.push(obj)
              promiseList.push(this.getList(obj.id))
           }
        })
      })
      
      Promise.all(promiseList).then(list => {

        sectionList.forEach(item => {
          list.forEach(obj => {
            if (item.id === obj.id) {
              Object.assign(item, obj)
            }
          })
        })
        this.sectionList = sectionList
      })
      // this.tabs = res.data.dataList.filter(item => {
      //   return item.parentId === parentList[0].id && item.state === 1;
      // })
      // this.currentPage = new Array(this.tabs.length).fill(1)
      // this.list = new Array(this.tabs.length).fill([])
      // this.toatal = new Array(this.tabs.length).fill(0)
      // this.pageSize = new Array(this.tabs.length).fill(4)
      // this.getList()
    },
    getList (id) {
      return new Promise(resolve => {
        getProductList({
          currentPage: 1,
          pageSize: 4,
          typeNo: id,
        }).then(res => {
          if (res.code !== 200) {
            resolve({
              id,
              total: 0,
              list: []
            })
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
          resolve({
            id,
            total: res.data.page.totalCount,
            list: res.data.dataList
          })
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.mall-index {
  text-align: center;
  .top-ad {
    width: 100%;
    vertical-align: top;
  }
  .content {
    width: 1200px;
    margin: 0 auto;
    padding-bottom: 60px;
    .section {
      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 40px 0;
        padding-bottom: 0;
        min-height: 50px;
        .left {
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: space-between;
          border-left: solid 4px #19A5FE;
          padding-left: 16px;
          
          .name {
            font-size: 22px;
            color: #666666;
            text-align: left;
          }
          .en {
            font-size: 11px;
            color: #999999;
            text-align: left;
            display: block;
            width: 100%;
          }
        }
        .more {
          border: 2px solid #19A5FE;
          border-radius: 2px;
          width: 74px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #19A5FE;
        }
      }
      .list {
        text-align: left;
        min-height: 460px;
      }
    }
  }
}
</style>
