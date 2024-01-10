<template>
    <div>
        <ErrorBoundary>
            <div class="default-container">
                <div class="main-container">
                    <Nuxt />
                </div>
                <AppFooter />
            </div>
        </ErrorBoundary>
    </div>
</template>

<script>
export default {

};
</script>
<style>
.default-container {

    /* Apply padding on screens that are larger than 840px */
  @media screen and (min-width: 840px) {
    padding: 0 40px;
  }
}

.main-container {
    display: flex;
    min-width: 100%;
    align-items: center;
    color: #444;
    min-height: 80vh;
}
</style>