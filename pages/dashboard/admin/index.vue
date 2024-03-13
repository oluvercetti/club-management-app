<script>
export default {
    asyncData({ redirect, store }) {
        if(store.getters.getUserInfo.role <= 2) {
            redirect("/dashboard/admin/settings");
        } else if(store.getters.getUserInfo.role === 3) {
            redirect("/dashboard/admin/lodgement");
        } else if(store.getters.getUserInfo.role === 5) {
            redirect("/dashboard/admin/purchase");
        } else if(store.getters.getUserInfo.role === 6) {
            redirect("/dashboard/admin/settings/transactions");
        } else {
            redirect("/login");
        }
    },

    head() {
        return {
            title: "Admin Dashboard -  NMBBS",
        };
    },
};
</script>