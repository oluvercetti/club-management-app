<template>
    <div>
        <b-alert variant="danger" show dismissible @dismissed="goHome">
            An error occurred
            <template #dismiss-title>
            </template>
        </b-alert>
        <b-button size="sm" variant="outline-secondary" to="/user">
            Go Home
        </b-button>
    </div>
</template>

<script>
export default {
    methods: {
        goHome() {
            this.$router.push("/");
        },
    },

    head() {
        return {
            title: "Error -  Dashbaord",
        };
    },

};
</script>

<style lang="scss" scoped></style>