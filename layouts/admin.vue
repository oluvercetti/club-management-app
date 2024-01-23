<template>
    <div>
        <ErrorBoundary>
            <div>
                <b-row>
                    <b-col cols="4" md="2" sm="2">
                        <AppSidebar />
                    </b-col>
                    <b-col cols="8" md="10" sm="10">
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
    middleware: "authenticate"
};
</script>
<style scoped>
.main-container {
    min-width: 100%;
    color: #444;
    min-height: 80vh;
    margin-top: 1.5rem;
}
</style>