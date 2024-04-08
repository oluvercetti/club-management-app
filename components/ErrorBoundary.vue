<template>
    <div class="error-container">
        <slot />
    </div>
</template>

<script>
export default {
    errorCaptured() {
        this.$router.replace({ path: "/error" });
    },
};
</script>
<style lang="scss" scoped>
.error-container {
    display: flex;
    flex-flow: column;
    min-height: 100vh;
}
</style>