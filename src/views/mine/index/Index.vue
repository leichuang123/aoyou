<template>
  <div class="mine">
    <UserInfo/>
    <router-view></router-view>
    <div class="context">
      <v-tabs v-model="tab" color="#11A0FE">
        <v-tab v-for="item in tabList"
          :key="item.key">{{item.name}}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="item in tabList"
          :key="item.key"
        >
          <v-card flat>
            <!-- <v-card-text>{{ item.component }}</v-card-text> -->
            <v-card-text>
              <component :is="item.component"></component>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import UserInfo from "@/components/mine/UserInfo.vue"
import Consume from "@/components/mine/Consume.vue"
import Tickets from "@/components/mine/Tickets.vue"
import MyVM from "@/components/mine/MyVM.vue"
import Machine from "@/components/mine/Machine.vue"
// import Coupon from ''

export default {
  name: "Mine",
  data() {
    return {
      tab: 0,
      tabList: [
        {
          name: '到期主机',
          key: 0,
          component:"machine"
        },
        {
          name: '消费记录',
          key: 1,
          component:"consume"
        },
        {
          name: '我的卡券',
          key: 2,
          component:"tickets"
        }
      ]
    }
  },
  components: {
    UserInfo,
    Consume,
    Tickets,
    MyVM,
    Machine,
  }
}
</script>

<style lang="less" scoped>
.mine{
  width: 1200px;
  margin: 0 auto;
  padding-top: 10px;
  // overflow: hidden;
  .context{
    background: #fff;
  }
}

</style>