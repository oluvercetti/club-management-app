<template>
    <div class="mt-3">
        <h2 class="mb-3"><b-icon icon="cash" class="mr-3" aria-hidden="true" /> Cash Lodgement</h2>
        <b-container>
            <b-row class="mb-3">
                <b-col>
                    <b-button variant="primary" class="mr-3" @click="mode = 'dancer'">
                        Dancer
                    </b-button>
                    <b-button variant="primary" @click="mode = 'coordinator'">
                        Coordinator
                    </b-button>
                </b-col>
            </b-row>
        </b-container>
        <b-form-row v-if="mode === 'dancer'">
            <b-col md="12">
                <b-form @submit.prevent="handleCreateNewLodgement()">
                    <b-form-row>
                        <b-col md="4">
                            <b-form-group label="Name" label-for="name">
                                <b-form-select v-model="newLodgement.name" :options="dancersList" required
                                    :disabled="disableFields">
                                    <template #first>
                                        <b-form-select-option value=null disabled>
                                            -- Please select a user --
                                        </b-form-select-option>
                                    </template>
                                </b-form-select>
                            </b-form-group>
                            <b-form-group label="Transaction Type" label-for="transtype">
                                <b-form-select v-model="newLodgement.mode_of_payment" required :disabled="disableFields">
                                    <template #first>
                                        <b-form-select-option value=null disabled>
                                            -- Please select --
                                        </b-form-select-option>
                                    </template>
                                    <b-form-select-option value="pos">POS</b-form-select-option>
                                    <b-form-select-option value="cash">Cash</b-form-select-option>
                                    <b-form-select-option value="transfer">Transfer</b-form-select-option>
                                </b-form-select>
                            </b-form-group>
                            <b-form-group label="Service Type" label-for="service_type">
                                <b-form-select v-model="newLodgement.service_type" :options="computedServiceTypeList"
                                    required :disabled="disableFields">
                                    <template #first>
                                        <b-form-select-option value=null disabled>
                                            -- Please select --
                                        </b-form-select-option>
                                    </template>
                                </b-form-select>
                            </b-form-group>
                            <b-form-group label="Amount" label-for="amount">
                                <b-form-input id="amount" type="number" v-model="newLodgement.amount" required
                                    :disabled="disableFields" />
                            </b-form-group>
                            <b-form-row>
                                <b-col>
                                    <h3><b>{{ newLodgement.amount | format_amount }}</b></h3>
                                </b-col>
                            </b-form-row>
                            <b-form-group label="Coordinator" label-for="cord">
                                <b-form-select v-model="newLodgement.coordinator" :options="coordinatorsList" required
                                    :disabled="disableFields">
                                    <template #first>
                                        <b-form-select-option value=null disabled>
                                            -- Please select --
                                        </b-form-select-option>
                                    </template>
                                </b-form-select>
                            </b-form-group>
                        </b-col>
                    </b-form-row>
                    <hr />
                    <b-form-row>
                        <b-col md="12">
                            <div class="form__button-container">
                                <b-button v-if="isLoading" size="lg" class="d-flex align-items-center" type="submit"
                                    variant="primary" disabled>
                                    <span class="mr-2">Please wait...</span>
                                    <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                                </b-button>
                                <b-button :disabled="disableFields" size="lg" v-else type="submit" variant="primary">
                                    Proceed
                                </b-button>
                                <b-button v-if="disableFields" size="lg" type="button" @click="resetLodgementValues(true)">
                                    Close Order
                                </b-button>
                                <b-button v-else size="lg" type="button" @click="resetLodgementValues()">
                                    Clear Order
                                </b-button>
                                <b-button v-if="disableFields" size="lg" type="button" @click="printOrder()">
                                    Reprint
                                </b-button>
                            </div>
                        </b-col>
                    </b-form-row>
                </b-form>
            </b-col>
        </b-form-row>
        <b-row v-if="mode === 'coordinator'">
            <b-col class="mb-3">
                <p>Service charge: {{ serviceCharge }}%</p>
            </b-col>
            <b-col md="12" sm="12">
                <b-table ref="purchase" :items="purchaseList" :fields="pFields" :busy="isLoading" class="mt-4 small-font"
                    striped hover outlined sort-icon-left>
                    <template #cell(createdAt)="createdAt">
                        <p>{{ $moment(createdAt.value).format("DD-MM-YYYY, HH:mm:ss") }}</p>
                    </template>
                    <template #cell(amount_booked)="amount_booked">
                        <p>{{ amount_booked.value | format_amount }}</p>
                    </template>
                    <template #cell(amount_sold)="amount_sold">
                        <p>{{ amount_sold.value | format_amount }}</p>
                    </template>
                    <template #cell(amount_returned)="amount_returned">
                        <p>{{ amount_returned.value | format_amount }}</p>
                    </template>
                    <template #cell(service_charge_amount)="service_charge_amount">
                        <p>{{ service_charge_amount.value | format_amount }}</p>
                    </template>
                    <template #cell(actions)="row">
                        <div class="d-flex justify-content-around">
                            <b-button v-if="row.item.status === 'Open'" variant="primary"
                                @click="handleSelectedTransaction(row.item)">
                                Complete Lodgement
                            </b-button>
                            <b-button v-else variant="success" disabled>
                                Closed
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
        <b-modal v-model="showUpdatePurchaseModal" hide-footer title="Update Lodgement">
            <b-form @submit.prevent="handleUpdateSinglePurchase(selectedTransaction)">
                <b-form-group label="Amount Booked" label-for="amou">
                    <p><strong>{{ selectedTransaction.amount_booked | format_amount }}</strong></p>
                </b-form-group>
                <b-form-group label="Sold All?" label-for="sold-all">
                    <b-form-select v-model="selectedTransaction.sold_all">
                        <b-form-select-option value="Yes">Yes</b-form-select-option>
                        <b-form-select-option value="No">No</b-form-select-option>
                    </b-form-select>
                </b-form-group>
                <b-form-group v-if="selectedTransaction.sold_all == 'No'" label="Amount Returned" label-for="amount-returned">
                    <b-form-input id="amount-returned" min="0" :max="selectedTransaction.amount_booked" type="number" v-model="selectedTransaction.amount_returned" :required="selectedTransaction.sold_all === 'No'" />
                </b-form-group>
                <b-form-group label="Amount Sold" label-for="amount-sold">
                    <p><strong>{{ computedAmountSold | format_amount }}</strong></p>
                </b-form-group>
                <b-form-group label="Service Charge" label-for="service-charge">
                    <p><strong>{{ computedServiceCharge | format_amount }}</strong></p>
                </b-form-group>
                <div class="form__button-container">
                    <b-button v-if="isLoading" class="d-flex align-items-center mr-3" type="submit" variant="primary"
                        disabled>
                        <span class="mr-2">Processing...</span>
                        <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                    </b-button>
                    <b-button v-else type="submit" variant="primary" class="mr-3">
                        Close Order
                    </b-button>
                    <b-button type="button" @click="showUpdatePurchaseModal = !showUpdatePurchaseModal">
                        Cancel
                    </b-button>
                </div>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
export default {
    layout: "admin",
    data() {
        return {
            purchaseList: [],
            newLodgement: {
                trans_id: null,
                mode_of_payment: null,
                username: null,
                amount: 0,
                service_type: null,
                coordinator: null,
            },
            usersList: [],
            serviceTypeList: [],
            isLoading: false,
            trans_tag: this.$random_alpha_numeric(4),
            disableFields: false,
            mode: "dancer",
            pFields: [
                { key: "createdAt", label: "Date", sortable: true },
                { key: "trans_id", label: "ID" },
                { key: "amount_booked", label: "Booked", sortable: true },
                { key: "amount_sold", label: "Sold", sortable: true },
                { key: "amount_returned", label: "Returned", sortable: true },
                { key: "service_charge_amount", label: "Charge", sortable: true },
                { key: "coordinator", label: "Coordinator", sortable: true },
                "Actions",
            ],
            showUpdatePurchaseModal: false,
            selectedTransaction: {
                trans_id: null,
                amount_booked: null,
                amount_returned: null,
                amount_sold: null,
                sold_all: null,
            },
            feesList: [],
        };
    },

    fetch() {
        this.handleGetAllUsers();
        this.handleGetAllServices();
        this.handleFetchPurchaseList();
    },

    watch: {
        mode(value) {
            if (value === 'coordinator') {
                this.handleFetchPurchaseList();
            }
        }
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

        serviceCharge() {
            const fee = this.feesList.find(fee => fee.fee_name === 'purchase_service_charge');
            return fee?.fee_value;
        },

        computedAmountSold() {
            return parseFloat(this.selectedTransaction.amount_booked) - parseFloat(this.selectedTransaction.amount_returned)
        },

        computedServiceCharge() {
            const serviceCharge = parseFloat(this.serviceCharge) / 100
            return parseFloat(this.computedAmountSold * serviceCharge)
        }
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
                this.disableFields = true;
                this.isLoading = false;
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                this.isLoading = false;
                this.disableFields = false;
            });
        },

        resetLodgementValues(showToast = false) {
            this.newLodgement = {
                trans_id: null,
                mode_of_payment: null,
                username: null,
                amount: null,
                service_type: null,
                coordinator: null,
            },

                this.disableFields = false;

            if (showToast) {
                this.$bvToast.toast("Order Closed, You can now make another lodgement", {
                    title: "Success",
                    variant: "success",
                    delay: 300,
                });
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

        printOrder() {
            this.$bvToast.toast("Print feature is coming soon", {
                title: "Pending",
                variant: "info",
                delay: 300,
            });
        },

        handleFetchPurchaseList() {
            this.isLoading = true;
            const today = new Date().toISOString().split('T')[0];
            const params = {
                startDate: today,
                endDate: today,
            }
            return this.$store.dispatch("fetchPurchaseList", params).then((response) => {
                this.isLoading = false;
                this.purchaseList = response.data;
                this.handleGetAllFees()
            }).catch((error) => {
                this.isLoading = false;
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
            });
        },

        handleSelectedTransaction(data) {
            this.selectedTransaction.trans_id = data.trans_id;
            this.selectedTransaction.amount_booked = data.amount_booked;
            this.selectedTransaction.sold_all = "Yes";
            this.selectedTransaction.amount_returned = data.amount_returned;
            this.selectedTransaction.amount_sold = data.amount_sold;
            this.selectedTransaction.coordinator = data.coordinator;
            this.showUpdatePurchaseModal = true;
        },

        handleUpdateSinglePurchase(data) {
            const id = data.trans_id;
            const payload = {
                amount_sold: this.computedAmountSold,
                amount_returned: data.amount_returned,
            };
            this.isLoading = true;
            return this.$store.dispatch("updateSinglePurchase", { id, payload }).then(() => {
                this.isLoading = false;
                this.$bvToast.toast("Purchase closed successfully", {
                    title: "Success",
                    variant: "success",
                    delay: 300,
                });
                this.handleFetchPurchaseList()
                this.showUpdatePurchaseModal = false;
            }).catch((error) => {
                this.isLoading = false;
                this.$bvToast.toast(error?.response?.data, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
            });
        },

        handleGetAllFees() {
            this.isLoading = true;
            return this.$store.dispatch("getFees").then((response) => {
                this.isLoading = false;
                this.feesList = response.data;
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