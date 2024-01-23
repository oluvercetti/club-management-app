<template>
    <div>
        <ErrorBoundary>
            <div>
                <b-row>
                    <b-col md="2" sm="2" xs="2">
                        <AppSidebar />
                    </b-col>
                    <b-col md="10" sm="10" xs="10">
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