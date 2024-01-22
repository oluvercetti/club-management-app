<template>
    <div class="mt-3">
        <h2 class="mb-3"><b-icon icon="cash" class="mr-3" aria-hidden="true" /> All Transactions</h2>
        <b-table ref="transactions" :items="transactionList" :fields="fields" :busy="isLoading" class="mt-4 small-font"
            striped hover outlined sort-icon-left>
            <template #cell(actions)="row">
                <div class="d-flex justify-content-around">
                    <b-button variant="primary" @click="handleSelectedTransaction(row.item)">
                        <b-icon icon="pencil"></b-icon>
                    </b-button>
                    <b-button variant="danger" @click="printTransactionReceipt(row.item)">
                        <b-icon icon="printer"></b-icon>
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

        <b-modal v-model="showViewExistingTransaction" hide-footer title="View Transaction">
            <b-form @submit.prevent="printTransactionReceipt(selectedTransaction)">
                <b-form-group label="Name" label-for="edit-name">
                    <b-form-input id="edit-name" v-model="selectedTransaction.location" required />
                </b-form-group>
                <b-form-group label="Shortcode" label-for="edit-shortcode">
                    <b-form-input id="edit-shortcode" v-model="selectedTransaction.shortcode" minlength="3" required />
                </b-form-group>
                <b-button v-if="isLoading" class="d-flex align-items-center" type="submit" variant="primary" disabled>
                    <span class="mr-2">Saving...</span>
                    <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                </b-button>
                <b-button v-else type="submit" variant="primary" class="mr-3">
                    Print
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
            selectedTransaction: {
                id: null,
                name: null,
                amount: null,
                trans_type: null,
                coordinator: null,
                service_type: null,
            },
            serviceTypeList: [],
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

        handleSelectedTransaction(data) {
            this.selectedTransaction.id = data.id;
            this.selectedTransaction.name = data.name;
            this.selectedTransaction.amount = data.amount;
            this.selectedTransaction.trans_type = data.trans_type;
            this.selectedTransaction.coordinator = data.coordinator;
            this.selectedTransaction.service_type = data.service_type;
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
    },
};
</script>

<style lang="scss" scoped></style>