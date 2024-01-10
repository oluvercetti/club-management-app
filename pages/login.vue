<template>
    <b-container fluid>
        <b-row class="justify-content-md-center text-center my-4">
            <b-col md="12">
                <h2><b-icon icon="key" aria-hidden="true" /> User Login</h2>
            </b-col>
        </b-row>
        <b-row class="justify-content-md-center">
            <b-col md="3">
                <b-form @submit.prevent="login">
                    <b-form-group label="Username:" label-for="username">
                        <b-form-input id="username" v-model="form.username" type="text" required placeholder="Enter username" />
                    </b-form-group>

                    <b-form-group label="Password:" label-for="password">
                        <b-form-input
                            id="password"
                            v-model="form.password"
                            type="password"
                            required
                            placeholder="Enter password"
                        />
                    </b-form-group>
                    <div class="text-center mt-4">
                        <b-button
                            v-if="isLoading"
                            block
                            type="submit"
                            variant="primary"
                            class="d-flex align-items-center justify-content-center"
                            size="lg"
                            disabled
                        >
                            <span class="mr-2">Please wait...</span>
                            <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                        </b-button>
                        <b-button
                            v-else
                            block
                            type="submit"
                            variant="primary"
                            size="lg"
                            :disabled="loginDisabled"
                        >
                            Login
                        </b-button>
                    </div>
                </b-form>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>

export default {
    asyncData({ $cookies }) {
        $cookies.removeAll();
    },

    data() {
        return {
            form: {
                username: "",
                password: "",
            },
            isLoading: false,
        };
    },

    head() {
        return {
            title: "Login -  Management Portal",
        };
    },

    computed: {
        loginDisabled() {
            return this.form.username === "" || this.form.password === "";
        },
    },
    methods: {
        login() {
            const f = this.form;
            const payload = {
                username: f.username,
                password: f.password,
            };
            this.isLoading = true;

            return this.$store.dispatch("loginAdminUser", payload).then(() => {
                this.$store.commit("setIsAuthenticated", true);
                this.$router.push("/admin");
            }).catch((err) => {
                this.$bvToast.toast(err.response.data.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                this.isLoading = false;
            });
        },
    },
};
</script>