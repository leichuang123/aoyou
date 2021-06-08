<template>
    <div>
    </div>
</template>
<script>
export default {
    created() {
        if (this.$route.query.path) {
            this.$router.replace({ path: this.$route.query.path });
        } else {
            this.$router.replace({ name: 'error' });
        }
    }
}
</script>
