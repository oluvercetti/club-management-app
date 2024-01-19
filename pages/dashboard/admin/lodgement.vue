<template>
    <div class="mt-3">
        <h2 class="mb-3"><b-icon icon="cash" class="mr-3" aria-hidden="true" /> Cash Lodgement</h2>
        <b-button variant="primary" @click="showNewLodgementModal = !showNewLodgementModal">
            New Cash Lodgement
        </b-button>
        <b-table ref="transactions" :items="transactionList" :fields="fields" :busy="isLoading" class="mt-4 small-font"
            striped hover outlined sort-icon-left>
            <template #cell(actions)="row">
                <div class="d-flex justify-content-around">
                    <b-button variant="primary" @click="handleSelectedTransaction(row.item)">
                        <b-icon icon="pencil"></b-icon>
                    </b-button>
                    <!-- <b-button variant="danger" @click="printTransactionReceipt(row.item)">
                        <b-icon icon="printer"></b-icon>
                    </b-button> -->
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
                    <b-form-select v-model="newLodgement.trans_type" required>
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
                name: null,
                amount: null,
                coordinator: null,
                service_type: null,
                trans_type: null,
            },
            selectedLodgement: {
                id: null,
                name: null,
                amount: null,
                trans_type: null,
                coordinator: null,
                service_type: null,
            },
            usersList: [],
            serviceTypeList: [],
            showNewLodgementModal: false,
            showViewExistingTransaction: false,
            isLoading: false,
        };
    },

    fetch() {
        this.handleGetAllTransactions();
        this.handleGetAllUsers();
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
            return this.usersList.map((data) => {
                if (data.role === 4) {
                    return data;
                }
            });
        },

        coordinatorsList() {
            return this.usersList.map((data) => {
                if (data.role === 2) {
                    return data;
                }
            });
        },

        computedServiceTypeList() {
            return this.serviceTypeList.map((data) => {
                return { value: data.name, text: data.name.toUpperCase() };
            }
            )
        },
    },

    methods: {
        handleGetAllTransactions() {
            this.isLoading = true;
            return this.$store.dispatch("gettransactionList").then((response) => {
                this.isLoading = false;
                this.transactionList = response.data;
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
                location: this.newLodgement.location,
                shortcode: this.newLodgement.shortcode?.toUpperCase(),
            };
            this.isLoading = true;
            return this.$store.dispatch("createNewTransaction", payload).then(() => {
                this.$bvToast.toast("Transaction completed", {
                    title: "Success",
                    variant: "success",
                    delay: 300,
                });
                this.showNewLodgementModal = false;
                this.resetLocationValues();
                this.isLoading = false;
                this.handleGetAllTransactions();
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
            this.selectedLodgement.id = data.id;
            this.selectedLodgement.name = data.name;
            this.selectedLodgement.amount = data.amount;
            this.selectedLodgement.trans_type = data.trans_type;
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
                        this.handleGetAllTransactions();
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

        resetLocationValues() {
            this.newLodgement.location = "";
            this.newLodgement.shortcode = "";
        },

        handleGetAllUsers() {
            this.isLoading = true;
            return this.$store.dispatch("getAllUsers").then((response) => {
                this.isLoading = false;
                this.handleGetRouteList();
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
    },
};
</script>

<style lang="scss" scoped></style>