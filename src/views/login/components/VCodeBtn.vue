<template>
  <div class="vcode cursor" :class="getClass" @click="btnClick">
    {{ getText }}
  </div>
</template>

<script>
const defaultTime = 10;
export default {
  name: "VCodeBtn",
  data() {
    return {
      time: defaultTime,
      timeId: 0,
      isCountDown: false
    }
  },
  props: {
    stdTime: {
      type: Number,
      default: defaultTime,
    }
  },
  beforeUnmount() {
    clearInterval(this.timeId)
  },
  mounted() {
    this.time = this.stdTime
  },
  methods: {
    btnClick() {
      if(+this.time !== +this.stdTime) {
        return false
      }
      this.countDown();
      this.isCountDown = true;
      this.timeId = setInterval(() => {
        if(this.time > 0) {
          this.countDown();
        } else {
          clearInterval(this.timeId)
          this.time = this.stdTime;
          this.isCountDown = false;
        }
      }, 1000);
    },
    countDown() {
      this.time -= 1;
    }
  },
  computed: {
    getText() {
      return this.time >= this.stdTime ? '发送验证码' : `${this.time}s后重试`
    },
    getClass() {
      return this.time >= this.stdTime ? '' : 'disable'
    }
  }
}
</script>

<style lang="scss" scoped>
.vcode{
  height: 17px;
  padding: 0 5px;
  line-height: 17px;
  text-align: center;
  font-size: $fontsize-l7;
  color: $color-l1-l;
  flex-grow: 0;
  flex-shrink: 0;
  border-radius: 12px;
  background: $color-primary;
  user-select: none;
}
.disable{
  background: $color-disable;
  cursor: wait;
}
</style>