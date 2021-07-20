import SpinTemp from './Spin.vue'
import Vue from 'vue'

const Spin = function (Vue) {//base-spin__wrap
  //不要重复加载dom
  if (document.getElementsByClassName('base-spin__wrap').length) return;
  //生成一个Vue构造器
  let SpinT = Vue.extend(SpinTemp);
  //实例化Vue
  let $vm = new SpinT();
  let tpl = $vm.$mount().$el;
  return {
    show: function () {
      document.body.appendChild(tpl);
      document.body.style.overflow = 'hidden';
    },
    hide: function () {
      document.body.removeChild(tpl);
      document.body.style.overflow = 'auto';
    }
  }
};

export default Spin(Vue);