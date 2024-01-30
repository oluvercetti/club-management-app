<template>
    <div>
        <b-navbar-brand to="https://www.instagram.com/silverfox_nigeria" target="_blank">
            <AppLogo width="150" height="150" />
        </b-navbar-brand>
    </div>
</template>

<script>
import AppLogo from './AppLogo.vue';

export default {
    computed: {
        isAuthenticated() {
            return this.$store.getters.getIsAuthenticated;
        },
    },
    methods: {
        handleAdminLogout() {
            return this.$store.dispatch("logoutAdminUser").then(() => {
                return this.$router.push("/login");
            }).catch(() => {
                return this.$router.push("/login");
            });
        },
    },
    components: { AppLogo }
};
</script>

<style lang="scss" scoped>

</style>