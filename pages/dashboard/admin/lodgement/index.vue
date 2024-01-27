<template>
    <div class="mt-3">
        <h2 class="mb-3"><b-icon icon="cash" class="mr-3" aria-hidden="true" /> Cash Lodgement</h2>
        <b-row>
            <b-col md="4">
                <b-form @submit.prevent="handleCreateNewLodgement()">
                    <b-form-group label="Name" label-for="name">
                        <b-form-select v-model="newLodgement.name" :options="dancersList" required>
                            <template #first>
                                <b-form-select-option value="" disabled>
                                    -- Please select a user --
                                </b-form-select-option>
                            </template>
                        </b-form-select>
                    </b-form-group>
                    <b-form-group label="Transaction Type" label-for="transtype">
                        <b-form-select v-model="newLodgement.mode_of_payment" required>
                            <template #first>
                                <b-form-select-option value="" disabled>
                                    -- Please select --
                                </b-form-select-option>
                            </template>
                            <b-form-select-option value="pos">POS</b-form-select-option>
                            <b-form-select-option value="cash">Cash</b-form-select-option>
                            <b-form-select-option value="transfer">Transfer</b-form-select-option>
                        </b-form-select>
                    </b-form-group>
                    <b-form-group label="Service Type" label-for="service_type">
                        <b-form-select v-model="newLodgement.service_type" :options="computedServiceTypeList" required>
                            <template #first>
                                <b-form-select-option value="" disabled>
                                    -- Please select --
                                </b-form-select-option>
                            </template>
                        </b-form-select>
                    </b-form-group>
                    <b-form-group label="Amount" label-for="amount">
                        <b-form-input id="amount" type="number" v-model="newLodgement.amount" required />
                    </b-form-group>
                    <b-form-group label="Coordinator" label-for="cord">
                        <b-form-select v-model="newLodgement.coordinator" :options="coordinatorsList" required>
                            <template #first>
                                <b-form-select-option value="" disabled>
                                    -- Please select --
                                </b-form-select-option>
                            </template>
                        </b-form-select>
                    </b-form-group>
                    <div class="form__button-container">
                        <b-button v-if="isLoading" class="d-flex align-items-center mr-3" type="submit" variant="primary"
                            disabled>
                            <span class="mr-2">Please wait...</span>
                            <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                        </b-button>
                        <b-button v-else type="submit" variant="primary" class="mr-3">
                            Proceed
                        </b-button>
                        <b-button type="button" @click="resetLodgementValues()">
                            Cancel
                        </b-button>
                    </div>
                </b-form>
            </b-col>
        </b-row>
    </div>
</template>

<script>
export default {
    layout: "admin",
    data() {
        return {
            newLodgement: {
                trans_id: null,
                mode_of_payment: null,
                username: null,
                amount: null,
                service_type: null,
                coordinator: null,
            },
            usersList: [],
            serviceTypeList: [],
            isLoading: false,
            trans_tag: this.$random_alpha_numeric(4),
        };
    },

    fetch() {
        this.handleGetAllUsers();
        this.handleGetAllServices();
    },

    fetchOnServer: false,

    computed: {

        dancersList() {
            return this.usersList
                .filter((data) => data.role === 4)
                .map((data) => ({ value: data.username, text: data.name }));
        },

        coordinatorsList() {
            return this.usersList
                .filter((data) => data.role === 5)
                .map((data) => ({ value: data.username, text: data.name }));
        },

        computedServiceTypeList() {
            return this.serviceTypeList.map((data) => {
                return { value: data.service_name, text: data.service_name.toUpperCase() };
            }
            )
        },
    },

    methods: {
        handleCreateNewLodgement() {
            const payload = {
                trans_id: this.trans_tag,
                mode_of_payment: this.newLodgement.mode_of_payment,
                username: this.newLodgement.name,
                amount: this.newLodgement.amount,
                service_type: this.newLodgement.service_type,
                coordinator: this.newLodgement.coordinator,
            };
            this.isLoading = true;
            return this.$store.dispatch("createNewLodgement", payload).then(() => {
                this.$bvToast.toast("Transaction completed", {
                    title: "Success",
                    variant: "success",
                    delay: 300,
                });
                this.showNewLodgementModal = false;
                this.resetLodgementValues();
                this.isLoading = false;
                this.handleGetAllLodgements();
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                this.isLoading = false;
            });
        },

        resetLodgementValues() {
            this.newLodgement = {
                trans_id: null,
                mode_of_payment: null,
                username: null,
                amount: null,
                service_type: null,
                coordinator: null,
            }
        },

        handleGetAllUsers() {
            this.isLoading = true;
            return this.$store.dispatch("getAllUsers").then((response) => {
                this.isLoading = false;
                this.usersList = response.data;
            }).catch((error) => {
                this.isLoading = false;
                this.$bvToast.toast(error?.response?.data, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
            });
        },

        handleGetAllServices() {
            return this.$store.dispatch("getServiceList").then((response) => {
                this.isLoading = false;
                this.serviceTypeList = response.data;
            }).catch((error) => {
                this.isLoading = false;
                this.$bvToast.toast(error?.response?.data, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>