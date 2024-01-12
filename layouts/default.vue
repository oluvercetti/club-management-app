<template>
    <div class="main-container">
        <ErrorBoundary>
                <div class="page-container">
                    <Nuxt />
                </div>
                <AppFooter />
        </ErrorBoundary>
    </div>
</template>

<script>
export default {

};
</script>
<style scoped>

.main-container {
    display: flex;
    min-width: 100%;
    color: #444;
    flex-flow: column;
}

.page-container {
  flex: 1 0 auto;
}
</style>