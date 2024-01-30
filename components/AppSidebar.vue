<template>
    <aside class="sidebar-container">
        <div class="sidebar-container__logo">
            <AppHeader />
        </div>
        <div class="sidebar-container__menu">
            <b-nav vertical>

                <b-nav-item v-if="canSeeCashLodgement" to="/dashboard/admin/lodgement" exact exact-active-class="active">
                    <b-icon icon="cash" aria-hidden="true" class="mr-3"></b-icon> Cash Logdement
                </b-nav-item>
                <b-nav-item v-if="canSeeCashPurchase" to="/dashboard/admin/purchase" active-class="active">
                    <b-icon icon="cash" aria-hidden="true" class="mr-3"></b-icon> Cash Purchase
                </b-nav-item>
                <b-nav-item v-if="canSeeSettings" to="/dashboard/admin/settings" active-class="active">
                    <b-icon icon="gear-fill" aria-hidden="true" class="mr-3"></b-icon> Settings
                </b-nav-item>
                <b-nav-item v-if="canSeeCashAuditLog" to="/dashboard/admin/audit" active-class="active">
                    <b-icon icon="book" aria-hidden="true" class="mr-3"></b-icon> Audit Log
                </b-nav-item>
            </b-nav>

            <p class="sidebar-container__menu--role"><b-icon icon="person" aria-hidden="true" class="mr-3"></b-icon>{{ getUserRoleInfo }}</p>
        </div>
        <div class="sidebar-container__logout mt-3">
            <b-button variant="danger" size="lg" block v-if="isAuthenticated" @click="handleAdminLogout()">
                Logout
            </b-button>
        </div>
        <div class="sidebar-container__footer">
            <AppFooter />
        </div>
    </aside>
</template>
  
<script>

export default {
    computed: {
        isAuthenticated() {
            return this.$store.getters.getIsAuthenticated;
        },

        canSeeCashLodgement() {
            return this.$store.getters.getUserInfo.role === 1 || this.$store.getters.getUserInfo.role === 3;
        },

        canSeeCashPurchase() {
            return this.$store.getters.getUserInfo.role === 1 || this.$store.getters.getUserInfo.role === 5;
        },

        canSeeSettings() {
            return this.$store.getters.getUserInfo.role === 1 || this.$store.getters.getUserInfo.role === 2;
        },

        canSeeCashAuditLog() {
            return this.$store.getters.getUserInfo.role === 1;
        },

        getUserRoleInfo() {
            const roleId = this.$store.getters.getUserInfo.role;
            const role = this.$store.getters.getRoleList && this.$store.getters.getRoleList.find(item => item.role_id === roleId);
            return role?.role_name;
        }
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
};
</script>
  
<style lang="scss" scoped>
/* Add your custom styles for the sidebar if needed */
.sidebar-container {
    color: #dcdcdc;
    background: #2c343b;
    border-right: none !important;
    height: 100vh;
    display: flex;
    flex-flow: column;
    align-items: center;

    &__menu {
        margin-bottom: 1rem;

        & > ul > li > a {
            color: #FFF;
        }

        &--role {
            text-transform: capitalize;
            border-top: 1px solid #FFF;
            padding: 1rem;
            font-size: 1.2rem;
        }
    }

    &__logout {
        flex: 1 0 auto
    }

    &__footer {
        >.footer {
            color: #FFF;
        }
    }
}
</style>
  