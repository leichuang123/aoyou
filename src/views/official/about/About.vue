<template>
  <div class="about">
   <div class="nav-info">
     <img class="cover-img" :src="tabs[tabIndex].cover" />
     <ul class="tabs">
       <li 
        :class="['tab', tabIndex === index ? 'active' : '']" 
        v-for="(item, index) in tabs" 
        @click="tabClick(index)"
        :key="index">
          {{item.name}}
        </li>
     </ul>
   </div>
    <div class="component">
      <Intro v-if="tabs[tabIndex].component === 'intro'" />
      <Industry v-if="tabs[tabIndex].component === 'industry'" />
      <Job v-if="tabs[tabIndex].component === 'job'" />
    </div>
    <QiMoService />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Intro from './components/Intro.vue'
import Job from './components/Job.vue'
import Industry from './components/Industry.vue'
import QiMoService from '@/components/public/QiMoService.vue'
export default {
  name: 'About',
  computed: {
    ...mapGetters([
      'getCount'
    ])
  },
  components: {
    Intro,
    Job,
    Industry,
    QiMoService
  },
  data () {
    return {
      tabs: [
        {
          name: '公司简介',
          component: 'intro',
          cover: require('../../../assets/images/about/picture-17.png'),
        },
        {
          name: '行业愿景',
          component: 'industry',
          cover: require('../../../assets/images/about/picture-18.png'),
        },
        {
          name: '人才招聘',
          component: 'job',
          cover: require('../../../assets/images/about/picture-19.png'),
        }
      ],
      tabIndex: 0,
    }
  },
  methods: {
    tabClick (index) {
      this.tabIndex = index
    }

  }
}
</script>
<style lang="less" scoped>
  .about {
    .nav-info {
      height: 230px;
      position: relative;
      background-image: linear-gradient(225deg, #EBF6FF 0%, #FEFEFF 100%);
      font-size: 0;
      .cover-img {
        width: 987px;
        position: absolute;
        top: 0;
        right: 112px;
      }
      .tabs {
        width: 1200px;
        position: absolute;
        left: 50%;
        bottom: 0;
        margin-left: -600px;
        padding-left: 80px;
        .tab {
          display: inline-block;
          width: 185px;
          height: 60px;
          line-height: 60px;
          cursor: pointer;
          font-size: 18px;
          color: #555555;
          text-align: center;
        }
        .active {
          background: #19A5FE;
          box-shadow: 0 -4px 10px 0 rgba(0,113,185,0.30);
          border-radius: 16px 16px 0 0;
          color: white;
        }
      }
    }
    .component {
      padding-top: 80px;
      width: 1200px;
      margin: 0 auto;
    }
  }
</style>

