<script>
export default {
    asyncData({ redirect }) {
        redirect("/login");
    },

    head() {
        return {
            title: "Admin Dashboard -  NMBBS",
        };
    },
};
</script>