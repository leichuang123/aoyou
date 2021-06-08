<template>
    <div>
        <div class="u-icon">
            <img src="images/error.png" alt="" width="200px">
        </div>
        <div class="u-text">哎呀...您访问的页面不存在</div>
    </div>
</template>
<script>
export default {
    created() {
        setTimeout(function () {
            router.go(-1);
        }, 1500);
    },
};
</script>

<style scoped>
.u-icon {
    font-size: 80px;
    text-align: center;
    padding-top: 100px;
    color: grey;
}

.u-text {
    text-align: center;
    font-size: 16px;
    color: grey;
    padding-top: 20px;
}
</style>
