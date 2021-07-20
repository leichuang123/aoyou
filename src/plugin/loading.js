import { ElLoading } from 'element-plus';

let myLoading = {
  loading: null,
  show() {
    this.loading = ElLoading.service({});
  },
  hide() {
    this.loading.close();
  }
}

export default {
  install: (app, options) => {
    app.config.globalProperties.$myLoading = myLoading
  }
}