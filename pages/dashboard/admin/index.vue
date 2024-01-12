<script>
export default {
    asyncData({ redirect }) {
        redirect("/dashboard/admin/settings");
    },

    head() {
        return {
            title: "Admin Dashboard -  NMBBS",
        };
    },
};
</script>