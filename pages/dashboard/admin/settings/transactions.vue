<template>
    <div class="mt-3">
        <b-container class="mb-4">
            <b-row>
                <b-col md="4">
                    <b-form-radio v-model="viewTable" name="viewTable" value="lodgement">
                        View Lodgements
                    </b-form-radio>
                </b-col>
                <b-col md="4">
                    <b-form-radio v-model="viewTable" name="viewTable" value="purchase">
                        View Purchases
                    </b-form-radio>
                </b-col>
            </b-row>
        </b-container>
        <b-row>
            <b-col md="12" sm="12" v-if="viewTable === 'lodgement'">
                <b-table ref="lodgement" :items="lodgementList" :fields="lFields" :busy="isLoading" class="mt-4 small-font"
                    striped hover outlined sort-icon-left>
                    <template #cell(actions)="row">
                        <div class="d-flex justify-content-around">
                            <b-button variant="primary" :to="`/dashboard/admin/lodgement/${row.item.id}`">
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
            </b-col>
            <b-col md="8" sm="12" v-if="viewTable === 'purchase'">
                <b-table ref="purchase" :items="purchaseList" :fields="pFields" :busy="isLoading"
                    class="mt-4 small-font" striped hover outlined sort-icon-left>
                    <template #cell(actions)="row">
                        <div class="d-flex justify-content-around">
                            <b-button variant="primary" :to="`/dashboard/admin/purchase/${row.item.id}`">
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
            </b-col>
        </b-row>
    </div>
</template>

<script>
export default {
    layout: "admin",
    data() {
        return {
            purchaseList: [],
            lodgementList: [],
            viewTable: "lodgement",
            lFields: [
                { key: "createdAt", label: "Date", sortable: true },
                { key: "trans_id", label: "ID" },
                { key: "mode_of_payment", label: "Mode", sortable: true },
                { key: "username", label: "User", sortable: true },
                { key: "amount", label: "Amount", sortable: true },
                { key: "service_type", label: "Service", sortable: true },
                { key: "coordinator", label: "Coordinator", sortable: true },
                "Actions",
            ],
            pFields: [
                { key: "createdAt", label: "Date", sortable: true },
                { key: "trans_id", label: "ID" },
                { key: "mode_of_payment", label: "Mode", sortable: true },
                { key: "amount", label: "Amount", sortable: true },
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
    },

    fetchOnServer: false,

    methods: {
        handleGetAllTransactions() {
            this.isLoading = true;
            return this.$store.dispatch("getAllTransactions").then((response) => {
                this.isLoading = false;
                this.purchaseList = response.data.purchase;
                this.lodgementList = response.data.lodgement;
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
    },
};
</script>

<style lang="scss" scoped></style>