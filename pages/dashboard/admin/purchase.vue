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
                        <b-button type="button" @click="showNewLodgementModal = !showNewLodgementModal">
                            Cancel
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

                <b-button class="ml-4" type="button" variant="success" @click="clearGrid()">
                    Complete Purchase
                </b-button>
                </b-container>
            </b-container>
        </div>
        <b-container v-if="transactionList.length > 0">
            <h3 class="mb-3">Previous Purchases</h3>
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
        </b-container>

        <b-modal v-model="showViewExistingTransaction" hide-footer title="View Lodgement">
            <b-form @submit.prevent="updateLocation(selectedLocation)">
                <b-form-group label="Name" label-for="edit-name">
                    <b-form-input id="edit-name" v-model="selectedLocation.location" required />
                </b-form-group>
                <b-form-group label="Shortcode" label-for="edit-shortcode">
                    <b-form-input id="edit-shortcode" v-model="selectedLocation.shortcode" minlength="3" required />
                </b-form-group>
                <b-button v-if="isLoading" class="d-flex align-items-center" type="submit" variant="primary" disabled>
                    <span class="mr-2">Saving...</span>
                    <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                </b-button>
                <b-button v-else type="submit" variant="primary" class="mr-3">
                    Save Location
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
            selectedLocation: {
                id: null,
                name: null,
                amount: null,
                trans_type: null,
                coordinator: null,
                service_type: null,
            },
            usersList: [],
            serviceTypeList: [],
            showNewPurchaseModal: false,
            showViewExistingTransaction: false,
            isLoading: false,
            adminBalance: null,
            imageSource: [
                { key: "100", value: "/img/100naira.webp" },
                { key: "200", value: "/img/200naira.jpeg" },
                { key: "500", value: "/img/500naira.webp" },
                { key: "1000", value: "/img/1000naira.webp" },
            ]
        };
    },

    fetch() {
        // this.handleGetAllTransactions();
        // this.handleGetAllUsers();
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

        computedAmount() {
            const quantity = this.form?.quantity * 100;
            return quantity * this.form?.denomination;
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
                this.showNewPurchaseModal = false;
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
            this.selectedLocation.location = data.location;
            this.selectedLocation.shortcode = data.shortcode;
            this.selectedLocation.id = data.id;
            this.showViewExistingTransaction = true;
        },

        updateLocation(data) {
            const id = data.id;
            const payload = {
                location: data.location,
                shortcode: data.shortcode?.toUpperCase(),
            };
            this.isLoading = true;
            return this.$store.dispatch("updateLocation", { id, payload }).then((response) => {
                this.$bvToast.toast("Location updated successfully", {
                    title: "Success",
                    variant: "success",
                    delay: 300,
                });
                this.showViewExistingTransaction = false;
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