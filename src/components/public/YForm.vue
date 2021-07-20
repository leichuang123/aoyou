<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "YForm",
  methods: {
    check(fun = null,nameList = []) {
      const children = this.$children
      let valObj = {};
      let state = true;
      let nameListObj = {};
      let itemCheck
      if(nameList.length > 0) {
        for(let nameitem of nameList) {
          nameListObj[nameitem] = true
        }
      }
      if(children.length > 0) {
        children.forEach((item) => {
          // 如果指定校验的列表不为空，则选择指定的校验，否则全部校验
          if(nameList.length > 0) {
            if(nameListObj[item.name]) {
              itemCheck = item.checkVal();
            } else {
              itemCheck = item.getVal()
            }
          } else {
            itemCheck = item.checkVal();
          }
          if(itemCheck.state === false) {
            state = false;
          }
          valObj[itemCheck.name] = itemCheck
        })
      }
      if(typeof fun === 'function') {
        fun(state,valObj);
      }
    }
  }
}
</script>