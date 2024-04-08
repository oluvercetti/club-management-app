<script>
export default {
    asyncData({ redirect }) {
        redirect("/dashboard/admin/settings/users");
    },

    head() {
        return {
            title: "Admin Dashboard -  SF",
        };
    },
};
</script>