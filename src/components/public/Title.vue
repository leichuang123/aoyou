<template>
  <div class="title">
    <div>{{title}}</div>
    <div class=dot></div>
  </div>
</template>

<script>
export default {
  name: "Title",
  props: {
    title: {
      type: String,
      default: "标题"
    }
  }
}
</script>
<style lang="less" scoped>
.title{
  font-size: 26px;
  color: #444444;
  letter-spacing: 0.87px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}
.dot{
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #19A5FE;
  margin-top: 10px;
  position: relative;
  &:before,&:after{
    display: block;
    content: ' ';
    width: 60px;
    height: 2px;
    background: #E0E1E2;
    position: absolute;
    top:3px;
  }
  &:before{
    left: -68px;
  }
  &:after{
    left: 18px;
  }
}
</style>