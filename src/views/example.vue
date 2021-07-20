<template>
  <div>
      <swiper
        :slides-per-view="3"
        :space-between="50"
        style="width: 800px"
      >
        <swiper-slide style="width: 400px; height: 300px">Slide 1</swiper-slide>
        <swiper-slide style="width: 400px; height: 300px">Slide 2</swiper-slide>
        <swiper-slide style="width: 400px; height: 300px">Slide 3</swiper-slide>
        <swiper-slide style="width: 400px; height: 300px">Slide 4</swiper-slide>
        <swiper-slide style="width: 400px; height: 300px">Slide 5</swiper-slide>
        <swiper-slide style="width: 400px; height: 300px">Slide 6</swiper-slide>
        <swiper-slide style="width: 400px; height: 300px">Slide 7</swiper-slide>
        <swiper-slide style="width: 400px; height: 300px">Slide 8</swiper-slide>
      </swiper>
    {{msg}}<br />
    <button @click="toLogin">登录</button><br />
    <!-- <button @click="change">修改msg</button> -->
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { getCurrentInstance, ref, watch, computed, } from 'vue'
import api from '../config/api.js'
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper.scss';
export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup (props, context) {
    // context 一般用于context.comit('a', a) 向父组件传值
    const { ctx } = getCurrentInstance()
    // ctx.$store.commit('login', {a: 1})
    const route = useRoute()
    const router = useRouter()
    const msg = ref('hello world')
    const swiperOptions = ref({
      pagination: {
        el: '.swiper-pagination'
      },
    })
    function toLogin () { 
      ctx.$axios.post(api.login, {mobile: 111, password: 111}) // 网络请求
      router.push('/login')
    }
    function change () {
      msg.value = 'hello world' + new Date().getTime()
    }
    watch (msg, (newVal, oldVal) => {
      console.log(newVal)
    })
    return { toLogin, msg, change, swiperOptions }
  }
}
</script>



