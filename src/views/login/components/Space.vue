<template>
  <div :style="{width:w,height:h}"></div>
</template>

<script>
export default {
  name: "Space",
  props: {
    w:{
      type:String,
      default: '100%'
    },
    h:{
      type:String,
      default: '10px'
    }
  }
}
</script>