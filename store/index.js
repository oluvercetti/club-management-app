
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


    getAllUsers() {
        return this.$axios.get("/api/admin/users").then((response) => {
            return response.data;
        });
    },

    updateSingleUser(_, { id, payload }) {
        return this.$axios.patch(`/api/updateuser/${id}`, payload).then((response) => {
            return response.data;
        });
    },


    changePassword(_, { payload }) {
        return this.$axios.patch(`/api/admin/changepassword`, payload).then((response) => {
            return response.data;
        });
    },

    getAllTransactions() {
        return this.$axios.get("/api/admin/transactions").then((response) => {
            return response.data;
        });
    },

    //Fees actions
    createNewFee(_, payload) {
        return this.$axios.post("/api/fees", payload).then((response) => {
            return response.data;
        });
    },

    getFees() {
        return this.$axios.get("/api/fees").then((response) => {
            return response.data;
        });
    },

    updateFee(_, { id, payload }) {
        return this.$axios.patch(`/api/fees/${id}`, payload).then((response) => {
            return response.data;
        });
    },

    // Lodgement Actions
    createNewLodgement(_, payload) {
        return this.$axios.post("/api/admin/lodgements", payload).then((response) => {
            return response.data;
        });
    },

    fetchLodgementList() {
        return this.$axios.get("/api/admin/lodgements").then((response) => {
            return response.data;
        });
    },

    fetchSingleLodgement(_, { id }) {
        return this.$axios.get(`/api/admin/lodgements/${id}`, payload).then((response) => {
            return response.data;
        });
    },

    // Purchase Actions
    createNewPurchase(_, payload) {
        return this.$axios.post("/api/admin/purchases", payload).then((response) => {
            return response.data;
        });
    },

    fetchPurchaseList() {
        return this.$axios.get("/api/admin/purchases").then((response) => {
            return response.data;
        });
    },

    fetchSinglePurchase(_, { id }) {
        return this.$axios.get(`/api/admin/purchases/${id}`, payload).then((response) => {
            return response.data;
        });
    },

    //Roles actions
    createNewRole(_, payload) {
        return this.$axios.post("/api/roles", payload).then((response) => {
            return response.data;
        });
    },

    getRoleList() {
        return this.$axios.get("/api/roles").then((response) => {
            return response.data;
        });
    },

    // Services actions

    createService(_, payload) {
        return this.$axios.post("/api/services", payload).then((response) => {
            return response.data;
        });
    },

    updateService(_, { id, payload }) {
        return this.$axios.patch(`/api/services/${id}`, payload).then((response) => {
            return response.data;
        });
    },

    getServiceList() {
        return this.$axios.get("/api/services").then((response) => {
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