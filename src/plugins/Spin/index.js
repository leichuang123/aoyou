import Spin from './Spin.js'

const install = function (Vue) {
  Vue.prototype.$Spin = Spin;
};
export default install;