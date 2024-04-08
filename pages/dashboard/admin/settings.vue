<template>
    <b-container fluid class="mt-3" w-75>
        <h2 class="mb-3"><b-icon icon="gear-fill" aria-hidden="true" /> Admin Settings</h2>
        <b-nav tabs justified>
            <b-nav-item to="/dashboard/admin/settings/transactions" exact exact-active-class="active">
                Transactions
            </b-nav-item>
            <b-nav-item v-if="!isAuditor" to="/dashboard/admin/settings/users" exact exact-active-class="active">
                Users
            </b-nav-item>
            <b-nav-item v-if="!isAuditor" to="/dashboard/admin/settings/services" exact exact-active-class="active">
                Fees and Services
            </b-nav-item>
        </b-nav>
        <NuxtChild />
    </b-container>
</template>

<script>
export default {
    layout: "admin",
    computed: {
        isAuditor() {
            return this.$store.getters.getUserInfo.role === 6;
        }
    },
};
</script>

<style lang="scss" scoped></style>