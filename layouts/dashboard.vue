<template>
    <div>
        <ErrorBoundary>
            <div>
                <b-row>
                    <b-col md="12">
                        <div class="main-container">
                            <Nuxt />
                        </div>
                    </b-col>
                </b-row>
            </div>
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
    align-items: center;
    color: #444;
    height: 95vh;
    overflow: scroll;
}
</style>