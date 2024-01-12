<template>
    <aside class="sidebar-container">
        <div class="sidebar-container__logo">
            <AppHeader />
        </div>
        <div class="sidebar-container__menu">
            <b-nav vertical>

                <b-nav-item to="/" exact exact-active-class="active">
                    Cash Logdement
                </b-nav-item>
                <b-nav-item to="/admin" active-class="active">
                    Cash Purchase
                </b-nav-item>
                <b-nav-item to="/admin" active-class="active">
                    Settings
                </b-nav-item>
            </b-nav>

            <b-button v-if="isAuthenticated" @click="handleAdminLogout()">
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
        flex: 1 0 auto
    }

    &__footer {
        >.footer {
            color: #FFF;
        }
    }
}
</style>
  