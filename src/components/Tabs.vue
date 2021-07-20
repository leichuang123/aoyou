<template>
  <div class="tabs">
    <div class="items"  v-for="(item, index) of list" :key="index">
      <div class="inner cursor" :class="{'actived' : isActived(item)}" :style="{background: item.color}"  @click="itemClick(item)">
        <img class="icon" :src="item.icon" :alt="item.name">
        <span>{{item.name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import icon1 from "../assets/image/icon/icon-t2@2x.webp"
import icon2 from "../assets/image/icon/icon-t4@2x.webp"
import icon3 from "../assets/image/icon/icon-t5@2x.webp"
import icon4 from "../assets/image/icon/icon-t6@2x.webp"
import icon5 from "../assets/image/icon/icon-t7@2x.webp"
import icon6 from "../assets/image/icon/icon-t9@2x.webp"
export default {
  name: "Tabs",
  props: {
    actived: {
      type: Number,
      default: 1,
    }
  },
  data() {
    return {
      activedItem: null,
      list: [
        {
          id: 1,
          name: '个人中心',
          color: "#A3274C",
          url: '/mine',
          icon: icon1
        },
        {
          id: 2,
          name: '应用中心',
          color: "#90219A",
          url: '/2',
          icon: icon2
        },
        {
          id: 3,
          name: '常见问题',
          color: "#332EAC",
          url: '/question',
          icon: icon3
        },
        {
          id: 4,
          name: '我的主机',
          color: "#3B81AB",
          url: '/my_vm',
          icon: icon4
        },
        {
          id: 5,
          name: '消息',
          color: "#277A0B",
          url: '/notice',
          icon: icon5
        },
        {
          id: 6,
          name: '商城',
          color: "#AB8514",
          url: '/mall',
          icon: icon6
        }
      ],
    }
  },
  mounted() {
  },
  methods: {
    
    itemClick(item) {
      this.activedItem = item;
      this.$emit('onChange', {"actived": item.id})
      // 路由跳转
      this.$router.push({path: item.url})
    }
  },
  watch: {
    '$route': function(val) {
      const activedItem = this.list.filter((item) => {
        return item.url === val.path
      }) || null;
      if(activedItem) {
        this.activedItem = activedItem[0];
      }
    }
  },
  computed: {
    isActived() {
      return (item) => {
        if(this.activedItem) {
          return item.id === this.activedItem.id
        } else {
          return false
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs{
  color: $color-l1-l;
  font-size: $fontsize-l5;
  width: 100%;
  display: flex;
  justify-content: center;
  .items{
    width: 177px;
    height: 116px;
    
    margin: 0 6px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.inner{
  transition: all 0.2s;
  width: 100%;
  height: 100%;
  transform: scale(1);
  opacity: 0.6;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.actived{
  transform: scale(1.12);
  opacity: 1;
  border: 2px solid #fff;
}
.icon{
  height: 28px;
  margin-bottom: 17px;
}
</style>