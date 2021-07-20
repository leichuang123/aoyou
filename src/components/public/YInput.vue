<template>
  <div class="input">
    <slot name="head" />
    <input @blur="blur" v-model="inputVal" class="full-input" :placeholder="placeholder" @keyup.enter="keyEnter" :type="type">
    <slot name="foot" />
    <slot name="err">
      <div class="err-tip">
        {{tip}}
      </div>
    </slot>
    
  </div>
</template>

<script>
export default {
  name: 'LoginInput',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    rules: {
      default:() => {return []},
    },
    picList: {
      default:() => {return []},
    },
    name: {
      type: String,
      required: true,
      default: ''
    },
    defaultVal: {
      type: String,
      default: "",
    },
    blurCheck: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      inputVal: '',
      tip:'',
      state: false,
      img1: null,
      img2: null,
    }
  },
  mounted() {
    this.inputVal = this.defaultVal || ""
  },
  methods: {
    checkVal() {
      let errTip = '';
      let state = true;
      let inputVal = this.inputVal;
      for (const iterator of this.rules) {
        let val = this.inputVal;
        if(
          (iterator.required && val === '') ||
          (iterator.maxLen && val.length > iterator.maxLen) ||
          (iterator.minLen && val.length < iterator.minLen) ||
          (iterator.len && val.length !== iterator.len) ||
          (iterator.reg && !val.match(iterator.reg))
          ) {
          errTip = iterator.msg;
          state = false;
          break;
        }
      }
      this.tip = errTip;
      this.state = state;
      this.$emit('onChange', {
        value: inputVal,
        state: state
      });
      return {
        name: this.name,
        value: inputVal,
        state: state,
      }
    },
    getVal() {
      return {
        name: this.name,
        value: this.inputVal,
        state: true,
      }
    },
    blur() {
      this.blurCheck && this.checkVal();
    },
    keyEnter() {
      this.$emit('onEnter');
    }
  },
  watch: {
    defaultVal(val) {
      this.inputVal = val
    }
  }
}
</script>

<style lang="less" scoped>
.input{
  // background: #fcfbf9;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  position: relative;
  color: #444444;
  .full-input{
    width: 100%;
    // padding: 0 20px;
  }
  .err-tip{
    position: absolute;
    bottom: -25px;
    font-size: 12px;
    color: rgba(255,33,18,1);
  }
  .icon{
    height: 22px;
    display: block;
    margin: 0 auto;
  }
}
</style>