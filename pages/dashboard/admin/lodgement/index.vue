<template>
    <div class="mt-3">
        <h2 class="mb-3"><b-icon icon="cash" class="mr-3" aria-hidden="true" /> Cash Lodgement</h2>
        <b-button variant="primary" @click="showNewLodgementModal = !showNewLodgementModal">
            New Cash Lodgement
        </b-button>
        <b-table ref="transactions" :items="transactionList" :fields="fields" :busy="isLoading" class="mt-4 small-font"
            striped hover outlined sort-icon-left>
            <template #cell(createdAt)="createdAt">
                <p>{{ $moment(createdAt.value).format("DD-MM-YYYY, HH:mm:ss") }}</p>
            </template>
            <template #cell(amount)="amount">
                <p>{{ amount.value | format_amount }}</p>
            </template>
            <template #cell(mode_of_payment)="mode">
                <p class="text-capitalize">{{ mode.value }}</p>
            </template>
            <template #cell(actions)="row">
                <div class="d-flex justify-content-around">
                    <b-button variant="primary" :to="`/dashboard/admin/lodgement/${row.item.trans_id}`">
                        View Details
                    </b-button>
                </div>
            </template>
            <template #table-busy>
                <div class="text-center text-info my-2">
                    <b-spinner class="align-middle" />
                    <strong>Loading...</strong>
                </div>
            </template>
        </b-table>

        <b-modal v-model="showNewLodgementModal" hide-footer title="New Cash Lodgement">
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
                <b-button v-if="isLoading" class="d-flex align-items-center" type="submit" variant="primary" disabled>
                    <span class="mr-2">Please wait...</span>
                    <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                </b-button>
                <b-button v-else type="submit" variant="primary" class="mr-3">
                    Complete Transaction
                </b-button>
                <b-button type="button" @click="showNewLodgementModal = !showNewLodgementModal">
                    Cancel
                </b-button>
            </b-form>
        </b-modal>

        <b-modal v-model="showViewExistingTransaction" hide-footer title="View Lodgement">
            <b-form @submit.prevent="printTransactionReceipt(selectedLodgement)">
                <b-form-group label="Name" label-for="edit-name">
                    <b-form-input id="edit-name" v-model="selectedLodgement.location" required />
                </b-form-group>
                <b-form-group label="Shortcode" label-for="edit-shortcode">
                    <b-form-input id="edit-shortcode" v-model="selectedLodgement.shortcode" minlength="3" required />
                </b-form-group>
                <b-button v-if="isLoading" class="d-flex align-items-center" type="submit" variant="primary" disabled>
                    <span class="mr-2">Saving...</span>
                    <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                </b-button>
                <b-button v-else type="submit" variant="primary" class="mr-3">
                    Reprint receipt
                </b-button>
                <b-button type="button" @click="showViewExistingTransaction = !showViewExistingTransaction">
                    Cancel
                </b-button>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
export default {
    layout: "admin",
    data() {
        return {
            transactionList: [],
            fields: [
                { key: "createdAt", label: "Date", sortable: true },
                { key: "trans_id", label: "ID" },
                { key: "mode_of_payment", label: "Mode", sortable: true },
                { key: "username", label: "User", sortable: true },
                { key: "amount", label: "Amount", sortable: true },
                { key: "service_type", label: "Service", sortable: true },
                { key: "coordinator", label: "Coordinator", sortable: true },
                "Actions",
            ],
            newLodgement: {
                trans_id: null,
                mode_of_payment: null,
                username: null,
                amount: null,
                service_type: null,
                coordinator: null,
            },
            selectedLodgement: {
                trans_id: null,
                mode_of_payment: null,
                username: null,
                amount: null,
                service_type: null,
                coordinator: null,
            },
            usersList: [],
            serviceTypeList: [],
            showNewLodgementModal: false,
            showViewExistingTransaction: false,
            isLoading: false,
            trans_tag: this.$random_alpha_numeric(4),
        };
    },

    fetch() {
        this.handleGetAllLodgements();
        this.handleGetAllServices();
    },

    fetchOnServer: false,

    computed: {
        computedTransactionList() {
            return this.transactionList.map((data) => {
                return {
                    trans_id: data.trans_id,
                    mode_of_payment: data.mode_of_payment,
                    username: data.username,
                    amount: data.amount,
                    service_type: data.service_type,
                    coordinator: data.coordinator,
                    createdAt: this.$moment(data.createdAt).format("DD-MM-YYYY, HH:mm:ss"),
                };
            });
        },

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
        handleGetAllLodgements() {
            this.isLoading = true;
            return this.$store.dispatch("fetchLodgementList").then((response) => {
                this.transactionList = response.data;
                this.handleGetAllUsers();
            }).catch((error) => {
                this.isLoading = false;
                this.$bvToast.toast(error?.response?.data, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
            });
        },

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

        handleSelectedTransaction(data) {
            this.selectedLodgement.trans_id = data.trans_id;
            this.selectedLodgement.name = data.name;
            this.selectedLodgement.amount = data.amount;
            this.selectedLodgement.mode_of_payment = data.mode_of_payment;
            this.selectedLodgement.coordinator = data.coordinator;
            this.selectedLodgement.service_type = data.service_type;
            this.showViewExistingTransaction = true;
        },

        printTransactionReceipt(data) {
            this.$bvModal.msgBoxConfirm(`Please confirm that you want to delete ${data.location}.`, {
                title: "Delete Location",
                size: "md",
                buttonSize: "md",
                okVariant: "danger",
                okTitle: "YES",
                cancelTitle: "NO",
                footerClass: "p-2",
                hideHeaderClose: false,
                centered: true,
            }).then((value) => {
                if (value) {
                    this.$store.dispatch("printTransactionReceipt", data.id).then(() => {
                        this.$bvToast.toast("Location deleted successfully", {
                            title: "Success",
                            variant: "success",
                            delay: 300,
                        });
                        this.handleGetAllLodgements();
                    });
                }
            }).catch((err) => {
                this.$bvToast.toast(err?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
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
            this.selectedLodgement = {
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