<template>
  <Comtain width="360px" height="410px">
    <div class="empty">
      <img class="empty-img" src="../../../assets/image/icon/icon-114@2x.webp" alt="空">
      <slot>
        <span>
          暂无数据
        </span>
      </slot>
    </div>
    
  </Comtain>
</template>

<script>
import Comtain from '../../../components/Contain.vue'
export default {
  name: 'Empty',
  components: {
    Comtain,
  }
}
</script>

<style lang="scss" scoped>
.empty{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .empty-img{
    width: 200px;
  }
  span {
    color: $color-l1-l;
    font-size: $fontsize-l7;
  }
}
</style>