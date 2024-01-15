
export const state = () => ({
    userInfo: {},
    authToken: null,
    isAuthenticated: false,
});

export const getters = ({
    getUserInfo: state => state.userInfo,

    getAuthToken: state => state.authToken,

    getIsAuthenticated: state => state.isAuthenticated,

});

export const mutations = ({
    setUserInfo(state, value) {
        state.userInfo = value;
    },

    setAuthToken(state, value) {
        state.authToken = value;
    },

    setIsAuthenticated(state, value) {
        state.isAuthenticated = value;
    },

});

export const actions = ({
    // Admin actions
    loginAdminUser({ commit }, payload) {
         return this.$axios.post("/api/admin/login", payload).then((response) => {
            this.$cookies.set("sftoken", JSON.stringify(response.data.token), {
                path: "/"
            });
            commit("setAuthToken", response.data.token);
            commit("setUserInfo", response.data.data);
            return response.data.data;
        });
    },

    logoutAdminUser({ commit }) {
        return this.$axios.post("/api/admin/logoutAll").then((response) => {
            this.$cookies.removeAll();
            commit("setIsAuthenticated", false);
            commit("setAuthToken", null);
            return response.data;
        });
    },

    getAdminUserProfile({ commit }) {
        return this.$axios.get("/api/admin/me").then((response) => {
            commit("setUserInfo", response.data.data);
            commit("setIsAuthenticated", true);
            return response.data;
        });
    },

    // User actions
    createNewUser(_, payload) {
        return this.$axios.post("/api/admin", payload).then((response) => {
            return response.data;
        });
    },


    getAllUsers(_, payload) {
        return this.$axios.get("/api/admin/users", payload).then((response) => {
            return response.data;
        });
    },

    updateUser(_, { id, payload }) {
        return this.$axios.patch(`/api/updateuser/${id}`, payload).then((response) => {
            return response.data;
        });
    },


    changePassword(_, { payload }) {
        return this.$axios.patch(`/api/admin/changepassword`, payload).then((response) => {
            return response.data;
        });
    },

    //Fees actions

    getFees() {
        return this.$axios.get("/api/fees").then((response) => {
            return response.data;
        });
    },

    deleteLocation(_, id) {
        return this.$axios.delete(`/api/admin/locations/${id}`).then((response) => {
            return response.data;
        });
    },

    // Route Actions
    createRoute(_, payload) {
        return this.$axios.post("/api/admin/trips/create", payload).then((response) => {
            return response.data;
        });
    },

    updateRoute(_, { id, payload }) {
        return this.$axios.patch(`/api/admin/trips/${id}`, payload).then((response) => {
            return response.data;
        });
    },

    fetchSingleRoute(_, payload) {
        return this.$axios.post("/api/admin/trips/getTrip", payload).then((response) => {
            return response.data;
        });
    },

    fetchRouteList() {
        return this.$axios.get("/api/admin/trips/getAllTrips").then((response) => {
            return response.data;
        });
    },

    // Ticket actions

    createTicket(_, payload) {
        return this.$axios.post("/api/admin/tickets/create", payload).then((response) => {
            return response.data;
        });
    },

    updateTicket(_, { id, payload }) {
        return this.$axios.patch(`/api/admin/tickets/${id}`, payload).then((response) => {
            return response.data;
        });
    },

    fetchTicketList() {
        return this.$axios.get("/api/admin/tickets/getAlltickets").then((response) => {
            return response.data;
        });
    },

    //Roles actions
    fetchRouteList() {
        return this.$axios.get("/api/roles").then((response) => {
            return response.data;
        });
    },

    async nuxtServerInit({ commit, dispatch }) {
    
            const authTokenCookie = this.$cookies.get("sftoken");
            if (!authTokenCookie) {
                return;
            }

            commit("setAuthToken", authTokenCookie);
            await dispatch("getAdminUserProfile").catch((err) => {
                this.$router.push("/login");
            });
        

    },

});