<template>
  <div class="nav">
    <section class="nav-content">
      <div class="left">
        <div class="logo">
          <img src="../../assets/images/public/logo-normal.png" alt="" class="logo-pic">
        </div>
        <ul class="tabs-list">
          <template v-for="(item, index) in tabs">
            <li :class="['tab', item.path === currentPath ? 'active' : '']" v-if="!item.child" @click="navClick(item)"
              :key="index">
              {{item.name}}
            </li>
            <li class="tab" v-if="item.child" @click="showToggle = true" :key="index">
              {{item.name}}
              <em class="arrow"></em>
              <div class="toggle-box" v-if="showToggle">
                <p v-for="(citem,cindex) of item.child" :key="cindex" @click.stop="navClick(citem)" class="toggle-item">
                  {{citem.name}}</p>
              </div>
            </li>
          </template>
        </ul>
      </div>
      <div class="right">
        <div class="right-contain" v-if="!getUserInfo" @blur="test">
          <button class="login-btn" @click="showSelect = true">登录/注册
            <img class="icon" src="../../assets/images/service_support/icon-78.png" alt="">
          </button>
          <div class="nav-select" v-if="showSelect">
            <ul>
              <li class="nav-optitem" @click="pageJumpFix('/login','/mall/my_vm', 1)">电信用户</li>
              <li class="nav-optitem" @click="pageJumpFix('/login','/mall/my_vm', 2)">移动用户</li>
            </ul>
          </div>
        </div>

        <div class="user-options" v-if="getUserInfo">
          <div class="part cursor" @click="pageJump('/mine/message')">
            <img src="@/assets/images/public/icon-81.png" alt="消息" class="icon">
          </div>
          <div class="part cursor" @click="pageJump('/mine')">
            <img src="@/assets/images/public/icon-83.png" alt="用户信息" class="icon">
            <v-tooltip bottom="">
              <template v-slot:activator="{ on, attrs }">
                <p v-bind="attrs" v-on="on">{{getUserInfo.userNickName | nickNameFilter}} {{getPhoneNumber}}</p>
                <!-- <v-btn
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >Left</v-btn> -->
              </template>
              <span>{{getUserInfo.userNickName}}</span>
            </v-tooltip>

          </div>
          <!-- <div class="part" v-if="getUserBalance">
            <img src="@/assets/images/public/icon-82.png" alt="水晶余额" class="icon">
            <p>{{getUserBalance.crystalBalance}}</p>
          </div> -->
          <img @click="logoutConfirm" src="@/assets/images/public/icon-84.png" alt="退出登录" class="icon">
        </div>
      </div>
    </section>
    <!-- <v-app style="width:0;height:0;"> -->
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">退出登录？</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="dialog = false">
            取消
          </v-btn>

          <v-btn color="green darken-1" text @click="logout">
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- </v-app> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Nav',
  computed: {
    ...mapGetters(['getUserBalance', 'getUserInfo']),
    currentPath() {
      return this.$route.path
    },
    getPhoneNumber() {
      let phoneNumber = this.getUserInfo.mobile
      const reg = phoneNumber.substr(3, 4)
      return phoneNumber ? phoneNumber.replace(reg, '****') : "";
    },

  },
  filters: {
    nickNameFilter(val) {
      let name = ""
      if (val) {
        name = val.length > 3 ? val.substr(0, 5) : val
      }
      return name;
    }
  },
  data() {
    return {
      dialog: false,
      showToggle: false,
      tabs: [
        {
          name: '首页',
          path: '/'
        },
        {
          name: '我的主机',
          path: '/mall/my_vm',
          // type: "_blank"
        },
        {
          name: '商城',
          path: '/mall',
          // type: "_blank"
        },
        {
          name: '下载',
          path: '/download'
        },
        {
          name: '产品',
          path: '/product'
        },
        {
          name: '企业管理',
          path: '/enterprise'
        },
        {
          name: '解决方案',
          path: '/resolve'
        },
        {
          name: '代理商招募',
          path: '/proxy'
        },
        {
          name: '更多内容',
          child: [
            {
              name: '服务支持',
              path: '/service_support'
            },
            {
              name: '关于我们',
              path: '/about'
            },
            {
              name: '联系我们',
              path: '/contact'
            }
          ]
        },
      ],
      showSelect: false
    }
  },
  methods: {
    test() {
      console.log(111)
    },
    navClick(item) {
      this.showToggle = false;
      if (item.type === '_blank') {
        let routeData = this.$router.resolve({
          path: item.path,
        });
        window.open(routeData.href, '_blank');
      } else if(item.name == "企业管理"){
        // window.location.href = "https://yunny.yunzhiqu.cn/pc/strategy/index.html";
        window.open("https://yunny.yunzhiqu.com/pc/strategy/index.html"); 
      }else {
        this.$router.push(item.path || '/')
      }
    },
    logoutConfirm() {
      this.dialog = true;
    },
    logout() {
      this.$store.dispatch('logout')
      this.dialog = false;
    },
    pageJump(path = "/") {
      if (this.$route.path !== path) {
        this.$router.push(path)
      }

    },
    pageJumpFix(path = "/", fixPath, type = 1) {
      const encodePath = encodeURIComponent(`${fixPath}`)
      if (type == 1) {

        this.$router.push(`${path}?from=${encodePath}&fromType=1`)
      } else {
        console.log(`https://yunzhiqu.cn/#${path}?from=${encodePath}&fromType=1`)
        window.location.href = `https://yunzhiqu.cn/#${path}?from=${encodePath}&fromType=1`
      }

    }
  },
  mounted() {
    document.addEventListener('click', (e) => {
      // console.log(e.target.className)
      if (!(e.target.className == 'toggle-item' || e.target.className == 'tab')) {
        this.showToggle = false;
      }
      if (!(e.target.className == 'nav-optitem' || e.target.className == 'login-btn')) {
        this.showSelect = false;
      }
    })
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/style/common.less";
.nav {
  width: 100%;
  background: @color-dark-2;
  color: @color-white;
  font-size: 13px;
  min-width: 1200px;
  .nav-content {
    width: 1260px;
    height: 80px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      .logo {
        width: 119px;
        margin-right: 50px;
        .logo-pic {
          width: 100%;
        }
      }
      .tabs-list {
        display: flex;
        .tab {
          cursor: pointer;
          margin-right: 50px;
          position: relative;
        }
        .active {
          &::after {
            content: " ";
            position: absolute;
            left: 0;
            right: 0;
            bottom: -14px;
            background: white;
            height: 2px;
            border-radius: 4px;
          }
        }
      }
    }
    .right {
      .login-btn {
        cursor: pointer;
        background: @color-white;
        color: @color-dark;
        font-size: 14px;
        width: 115px;
        height: 32px;
        border-radius: 9px;
        .icon {
          display: inline-block;
          width: 10px;
          height: 6px;
        }
      }
    }
  }
}
.user-options {
  display: flex;

  .part {
    height: 20px;
    display: flex;
    justify-content: center;
    line-height: 20px;
    margin-right: 20px;
    p {
      margin-left: 5px;
    }
  }
  .icon {
    height: 20px;
    cursor: pointer;
  }
}
.tab {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.arrow {
  display: block;
  width: 9px;
  height: 5px;
  background: url("../../assets/images/public/icon-1.png");
  background-size: 100%;
  margin-left: 6px;
}
.toggle-box {
  position: absolute;
  top: 48px;
  left: -25px;
  width: 101px;
  z-index: 99;
  // margin-left: -25px;
  .toggle-item {
    background: #2c2d3b;
    height: 33px;
    line-height: 33px;
    text-align: center;

    &:hover {
      background: #19a5fe;
    }
  }
}
.right-contain {
  position: relative;
}
.nav-select {
  position: absolute;
  width: 110px;
  padding-top: 24px;
  z-index: 90;
  ul {
    background: #2c2d3b;
    padding-left: 0;
    li {
      width: 100%;
      height: 33px;
      line-height: 33px;
      text-align: center;
      font-size: 13px;
      cursor: pointer;
      &:hover {
        background: #19a5fe;
      }
    }
  }
}
</style>