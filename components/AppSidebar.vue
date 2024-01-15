<template>
    <aside class="sidebar-container">
        <div class="sidebar-container__logo">
            <AppHeader />
        </div>
        <div class="sidebar-container__menu">
            <b-nav vertical>

                <b-nav-item to="/dashboard/admin/lodgement" exact exact-active-class="active">
                    <b-icon icon="cash" aria-hidden="true" class="mr-3"></b-icon> Cash Logdement
                </b-nav-item>
                <b-nav-item to="/dashboard/admin/purchase" active-class="active">
                    <b-icon icon="cash" aria-hidden="true" class="mr-3"></b-icon> Cash Purchase
                </b-nav-item>
                <b-nav-item to="/dashboard/admin/settings" active-class="active">
                    <b-icon icon="gear-fill" aria-hidden="true" class="mr-3"></b-icon> Settings
                </b-nav-item>
                <b-nav-item to="/dashboard/admin/audit" active-class="active">
                    <b-icon icon="gear-fill" aria-hidden="true" class="mr-3"></b-icon> Audit Log
                </b-nav-item>
            </b-nav>
        </div>
        <div class="sidebar-container__logout">
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
  