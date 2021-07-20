<template>
  <div class="input" :class="getInputStyle">
    <slot name="head" />
    <input @blur="blur" v-model="inputVal" class="full-input" :placeholder="placeholder" @keyup.enter="keyEnter" :type="typeVaule">
    <slot name="foot" />
    
    <div class="icon2" v-if="type === 'password'" @click="togglePwd()">
      <img v-if="typeVaule === 'password'" src="../assets/image/icon/icon-43@2x.webp" alt="切换密码">
      <img v-if="typeVaule === 'text'" src="../assets/image/icon/icon-1000@2x.webp" alt="切换密码">
    </div>
    
    <slot name="err" v-if="tip">
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
      typeVaule: '',
    }
  },
  mounted() {
    this.inputVal = this.defaultVal || ""
    this.typeVaule = this.type
  },
  computed: {
    getInputStyle() {
      return this.tip ?  'err-class' : ''
    }
  },
  methods: {
    togglePwd() {
      this.typeVaule = this.typeVaule === 'password' ? 'text' : 'password';
    },
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
    },
  }
}
</script>

<style lang="scss" scoped>
.input{
  // background: #fcfbf9;
  width: 100%;
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: $fontsize-l6;
  position: relative;
  color: $color-l1-l;
  
  border-bottom: 1px solid $color-line;
  .full-input{
    width: 100%;
    height: 100%;
    padding: 0 20px;
    color: $color-l1-l;
  }
  .err-tip{
    position: absolute;
    bottom: -18px;
    font-size: $fontsize-l7;
    color: $color-primary2;
  }
  .icon{
    height: 22px;
    display: block;
    margin: 0 auto;
  }
}
::placeholder {
  color: $color-l1-l;
  font-size: $fontsize-l7;
}
.icon2{
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  flex-grow: 0;
  flex-shrink: 0;
  img{
    width: 13px;
  }
}
.err-class{
  border-bottom: 1px solid $color-primary2;
}
</style>