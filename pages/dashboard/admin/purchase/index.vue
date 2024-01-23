<template>
    <div class="mt-3">
        <h2 class="mb-3"><b-icon icon="cash" class="mr-3" aria-hidden="true" /> Cash Purchase</h2>
        <div class="mb-4">
            <b-form-row>
                <b-col md="5">
                    <b-form @submit.prevent="addItem()">
                        <b-form-group label="Denomination" label-for="denomination">
                            <b-form-select v-model="form.denomination" required>
                                <template #first>
                                    <b-form-select-option value="" disabled>
                                        -- Please select --
                                    </b-form-select-option>
                                </template>
                                <b-form-select-option value="100">N100</b-form-select-option>
                                <b-form-select-option value="200">N200</b-form-select-option>
                                <b-form-select-option value="500">N500</b-form-select-option>
                                <b-form-select-option value="1000">N1000</b-form-select-option>
                            </b-form-select>
                        </b-form-group>
                        <template v-if="form.denomination">
                            <b-form-group label="Quantity" label-for="quantity">
                                <b-form-input id="quantity" type="number" min="1" max="100" v-model="form.quantity"
                                    required />
                            </b-form-group>
                            <b-form-group label="Amount" label-for="amount">
                                <h3><b>{{ computedAmount | format_amount }}</b></h3>
                            </b-form-group>
                            <b-form-group label="Transaction Type" label-for="transtype">
                                <b-form-select v-model="form.trans_type" required>
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
                        </template>
                        <b-button v-if="isLoading" class="d-flex align-items-center" type="submit" variant="primary"
                            disabled>
                            <span class="mr-2">Please wait...</span>
                            <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                        </b-button>
                        <b-button v-else type="submit" variant="primary" class="mr-3">
                            Add Purchase
                        </b-button>
                    </b-form>
                </b-col>
            </b-form-row>
            <b-container fluid v-if="gridItems.length > 0">
                <b-table class="mt-4" ref="purchase" striped hover :items="gridItems" :fields="gridFields">
                    <template #cell(denomination)="denomination">
                        <div class="flex">
                            <p>{{ denomination.value | format_amount }}</p>
                        </div>
                    </template>
                    <template #cell(image)="image">
                        <div class="img-container">
                            <img :src="image.value" alt="image">
                        </div>
                    </template>
                    <template #cell(total_amount)="price">
                        <p>{{ price.value | format_amount }}</p>
                    </template>
                    <template #cell(actions)="row">
                        <b-button-group>
                            <b-button @click="updateItem(row.item)" variant="danger"><b-icon icon="trash"
                                    aria-hidden="true" /></b-button>
                        </b-button-group>
                    </template>
                </b-table>
                <b-card class="mt-3">
                    <b-card-title>Total Amount</b-card-title>
                    <b-card-text>{{ calculateTotalAmount() | format_amount }}</b-card-text>
                </b-card>
                <b-container class="mt-3" fluid>
                    <b-button type="button" variant="danger" @click="clearGrid()">
                        Clear
                    </b-button>

                    <b-button class="ml-4" type="button" variant="success" @click="handleCreateNewPurchase()">
                        Complete Purchase
                    </b-button>
                </b-container>
            </b-container>
        </div>
        <b-container v-if="purchaseList.length > 0">
            <h3 class="mb-3">Previous Purchases</h3>
            <b-table ref="transactions" :items="purchaseList" :fields="fields" :busy="isLoading" class="mt-4 small-font"
                striped hover outlined sort-icon-left>
                <template #cell(actions)="row">
                    <div class="d-flex justify-content-around">
                        <b-button variant="primary" :to="`/dashboard/admin/purchases/${row.item.id}`">
                            View Details
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
        </b-container>

        <b-modal v-model="showViewExistingTransaction" hide-footer title="View Lodgement">
            <b-form @submit.prevent="printTransactionReceipt(selectedPurchase)">
                <b-form-group label="Name" label-for="edit-name">
                    <b-form-input id="edit-name" v-model="selectedPurchase.location" required />
                </b-form-group>
                <b-form-group label="Denomination" label-for="denomination">
                    <b-form-select v-model="selectedPurchase.denomination" disabled>
                        <b-form-select-option value="100">N100</b-form-select-option>
                        <b-form-select-option value="200">N200</b-form-select-option>
                        <b-form-select-option value="500">N500</b-form-select-option>
                        <b-form-select-option value="1000">N1000</b-form-select-option>
                    </b-form-select>
                </b-form-group>
                <b-form-group label="Transaction Type" label-for="transtype">
                    <b-form-select v-model="selectedPurchase.trans_type" disabled>
                        <b-form-select-option value="pos">POS</b-form-select-option>
                        <b-form-select-option value="cash">Cash</b-form-select-option>
                        <b-form-select-option value="transfer">Transfer</b-form-select-option>
                    </b-form-select>
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
            purchaseList: [],
            fields: [
                { key: "createdAt", label: "Date", sortable: true },
                { key: "trans_id", label: "ID" },
                { key: "mode_of_payment", label: "Mode", sortable: true },
                { key: "amount", label: "Amount", sortable: true },
                { key: "coordinator", label: "Coordinator", sortable: true },
                "Actions",
            ],
            form: {
                denomination: null,
                quantity: null,
                trans_type: null,
            },
            gridItems: [],
            gridFields: [
                { key: "denomination", label: "Denomination", sortable: true },
                { key: "image", label: "Image", sortable: true },
                { key: "quantity", label: "Bundles", sortable: true },
                { key: "amount", label: "Amount", sortable: true },
            ],
            selectedPurchase: {
                id: null,
                denomination: null,
                amount: null,
                trans_type: null,
                coordinator: null,
                service_type: null,
            },
            showViewExistingTransaction: false,
            isLoading: false,
            imageSource: [
                { key: "100", value: "/img/100naira.webp" },
                { key: "200", value: "/img/200naira.jpeg" },
                { key: "500", value: "/img/500naira.webp" },
                { key: "1000", value: "/img/1000naira.webp" },
            ],
            trans_tag: this.$random_alpha_numeric(4),
        };
    },

    fetch() {
        this.handleGetAllPurchases();
    },

    fetchOnServer: false,

    computed: {
        computedPurchaseList() {
            return this.purchaseList.map((data) => {
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

        computedAmount() {
            const quantity = this.form?.quantity * 100;
            return quantity * this.form?.denomination;
        },
    },

    methods: {
        handleGetAllPurchases() {
            this.isLoading = true;
            return this.$store.dispatch("fetchPurchaseList").then((response) => {
                this.isLoading = false;
                this.purchaseList = response.data;
            }).catch((error) => {
                this.isLoading = false;
                this.$bvToast.toast(error?.response?.data, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
            });
        },

        handleCreateNewPurchase() {
            const payload = this.gridItems.map(item => {
                return {
                    trans_id: this.trans_tag,
                    mode_of_payment: item.mode_of_payment,
                    amount: item.amount,
                    denomination: item.denomination,
                }
            })
            this.isLoading = true;
            return this.$store.dispatch("createNewPurchase", payload).then(() => {
                this.$bvToast.toast("Purchase completed", {
                    title: "Success",
                    variant: "success",
                    delay: 300,
                });
                this.resetLocationValues();
                this.isLoading = false;
                this.handleGetAllPurchases();
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                this.isLoading = false;
            });
        },

        handleSelectedPurchase(data) {
            this.selectedPurchase.trans_id = data.trans_id;
            this.selectedPurchase.mode_of_payment = data.mode_of_payment;
            this.selectedPurchase.amount = data.amount;
            this.selectedPurchase.coordinator = data.coordinator;
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
                        this.handleGetAllPurchases();
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

        addItem() {
            // Add a new item to the items array
            this.gridItems.push({ ...this.form, amount: this.computedAmount, image: this.getImageSource(this.form.denomination) });
            // Clear the form fields
            this.form = { denomination: null, quantity: null, amount: null };
        },

        calculateTotalAmount() {
            // Calculate the total amount by summing the amount of each item
            return this.gridItems.reduce((total, item) => total + item.amount, 0);
        },


        resetFeeValues() {
            this.newFee = {
                fee_name: null,
                fee_type: null,
                fee_value: null,
            }
        },

        clearGrid() {
            this.gridItems = [];
        },

        getImageSource(id) {
            const imageSource = this.imageSource.find(img => img.key === id)
            return imageSource.value;
        }
    },
};
</script>

<style lang="scss" scoped>
.img-container {
    max-width: 200px;

    &>img {
        max-width: 100%;
        height: auto;
    }
}
</style>