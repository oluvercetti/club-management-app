
export const state = () => ({
    userInfo: {},
    authToken: null,
    isAuthenticated: false,
    roleList: null
});

export const getters = ({
    getUserInfo: state => state.userInfo,

    getAuthToken: state => state.authToken,

    getIsAuthenticated: state => state.isAuthenticated,

    getRoleList: state => state.roleList,

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

    setRoleList(state, value) {
        state.roleList = value;
    },

});

export const actions = ({
    // Admin actions
    loginAdminUser({ commit, dispatch }, payload) {
        return this.$axios.post("/api/admin/login", payload).then((response) => {
            commit("setAuthToken", response.data.token);
            commit("setUserInfo", response.data.data);
            dispatch("getRoleList")
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


    getAllUsers(_, params) {
        return this.$axios.get("/api/admin/users", { params }).then((response) => {
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

    resetPassword(_, { payload }) {
        return this.$axios.patch(`/api/admin/resetpassword`, payload).then((response) => {
            return response.data;
        });
    },

    getAllTransactions(_, params) {
        return this.$axios.get("/api/admin/transactions", { params }).then((response) => {
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

    fetchSingleLodgement(_, id) {
        return this.$axios.get(`/api/admin/lodgements/${id}`).then((response) => {
            return response.data;
        });
    },

    cancelSingleLodgement(_, { id }) {
        return this.$axios.patch(`/api/admin/lodgements/${id}/void`).then((response) => {
            return response.data;
        });
    },

    // Purchase Actions
    createNewPurchase(_, payload) {
        return this.$axios.post("/api/admin/purchases", payload).then((response) => {
            return response.data;
        });
    },

    fetchPurchaseList(_, params) {
        return this.$axios.get("/api/admin/purchases", { params }).then((response) => {
            return response.data;
        });
    },

    fetchSinglePurchase(_, id) {
        return this.$axios.get(`/api/admin/purchases/${id}`).then((response) => {
            return response.data;
        });
    },
        
    updateSinglePurchase(_, { id, payload }) {
        return this.$axios.patch(`/api/admin/purchases/${id}`, payload).then((response) => {
            return response.data;
        });
    },

    cancelSinglePurchase(_, { id }) {
        return this.$axios.patch(`/api/admin/purchases/${id}/void`).then((response) => {
            return response.data;
        });
    },

    //Roles actions
    createNewRole(_, payload) {
        return this.$axios.post("/api/roles", payload).then((response) => {
            return response.data;
        });
    },

    getRoleList({ commit }) {
        return this.$axios.get("/api/roles").then((response) => {
            commit("setRoleList", response.data.data);
            return response.data;
        });
    },

    // Services actions

    createNewService(_, payload) {
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

    sendToPrinter(_, payload){
        return this.$axios.post("/api/admin/print", payload).then((response) => {
            return response.data;
        });
    },

    getReport(_, params) {
        return this.$axios.get("/api/admin/endofdayreport", { params }).then((response) => {
            return response.data;
        });
    },

    async nuxtServerInit({ commit, dispatch }) {

        const authTokenCookie = this.$cookies.get("sftoken");
        if (!authTokenCookie) {
            return;
        }

        commit("setAuthToken", authTokenCookie);
        await dispatch("getAdminUserProfile").then(() => {
            return dispatch("getRoleList")
        }).catch((err) => {
            this.$router.push("/login");
        });


    },

});