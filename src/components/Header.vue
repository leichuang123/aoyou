<template>
    <div>
        <van-nav-bar :border="border" :title="title" :left-arrow="leftArrow" @click-left="back" right-text="" @click-right="onClickRight" />
    </div>
</template>

<script>
import { NavBar } from 'vant';
export default {
    name: 'Header',
    components: {
        [NavBar.name]: NavBar,
    },
    props: {
        title: {
            type: String,
            default: '',
        },
        border: {
            type: Boolean,
            default: false,
        },
        leftArrow: {
            type: Boolean,
            default: true,
        },
        goback: {
            type: Function,
        },
        rightClick: {
            type: Function,
        },
    },
    data() {
        return {};
    },
    methods: {
        back() {
            if (typeof this.goback == 'function') {
                this.goback();
            } else {
                router.go(-1);
            }
        },
        onClickRight() {
            if (typeof this.rightClick == 'function') {
                this.rightClick();
            }
        },
    },
};
</script>

