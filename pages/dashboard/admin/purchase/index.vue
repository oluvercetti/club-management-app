<template>
    <div class="mt-3">
        <h2 class="mb-3"><b-icon icon="cash" class="mr-3" aria-hidden="true" /> Cash Purchase</h2>
        <div class="mb-4">
            <b-form-row>
                <b-col md="12">
                    <b-form @submit.prevent="handleCreateNewPurchase()">
                        <b-form-row class="radio">
                            <b-col md="3" class="radio__item" v-for="option in denominationOptions" :key="option.value" :disabled="disableFields">
                                <input :id="option.value" v-model="form.denomination" :value="option.value" type="radio"
                                    :name="option.value" class="radio__input">
                                <label :for="option.value" class="radio__label">
                                    <img :src="option.image" :alt="option.label" class="img-fluid" />
                                </label>
                            </b-col>
                        </b-form-row>
                        <hr />
                        <b-form-row>
                            <b-col md="5">
                                <template v-if="form.denomination">
                                    <b-form-group label="How many bundles?" label-for="quantity">
                                        <b-form-input id="quantity" type="number" min="1" max="100" v-model="form.quantity"
                                            required :disabled="disableFields"/>
                                    </b-form-group>
                                    <b-form-group label="Amount to change" label-for="amount">
                                        <h3><b>{{ computedAmount | format_amount }}</b></h3>
                                    </b-form-group>
                                </template>
                            </b-col>
                        </b-form-row>
                        <hr/>
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
                                    <b-button v-if="disableFields" size="lg" type="button" @click="resetValues(true)">
                                        Close Order
                                    </b-button>
                                    <b-button v-else size="lg" type="button" @click="resetValues()">
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
        </div>
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
                { key: "amount", label: "Amount", sortable: true },
                { key: "coordinator", label: "Coordinator", sortable: true },
                "Actions",
            ],
            form: {
                denomination: "500",
                quantity: null,
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
                coordinator: null,
                service_type: null,
            },
            showViewExistingTransaction: false,
            isLoading: false,
            denominationOptions: [
                { value: "100", label: "N100", image: "/img/100naira.jpeg" },
                { value: "200", label: "N200", image: "/img/200naira.jpeg" },
                { value: "500", label: "N500", image: "/img/500naira.jpeg" },
                { value: "1000", label: "N1000", image: "/img/1000naira.jpg" },
            ],
            trans_tag: this.$random_alpha_numeric(4),
            disableFields: false,
        };
    },

    fetchOnServer: false,

    computed: {

        computedAmount() {
            const quantity = this.form?.quantity * 100;
            return quantity * this.form?.denomination;
        },
    },

    methods: {

        handleCreateNewPurchase() {
            const payload = {
                trans_id: this.trans_tag,
                amount_booked: this.computedAmount,
                denomination: this.form.denomination,
            }

            this.isLoading = true;
            return this.$store.dispatch("createNewPurchase", payload).then(() => {
                this.$bvToast.toast("Purchase completed", {
                    title: "Success",
                    variant: "success",
                    delay: 300,
                });
                this.isLoading = false;
                this.disableFields = true;
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                this.isLoading = false;
            });
        },


        resetValues(showToast = false) {
            this.form = {
                denomination: "500",
                quantity: null,
            },
            this.trans_tag = this.$random_alpha_numeric(4)

            this.disableFields = false;
            if (showToast) {
                this.$bvToast.toast("Order Closed, You can now make another purchase", {
                    title: "Success",
                    variant: "success",
                    delay: 300,
                });
            }
        },

        printOrder() {
            this.$bvToast.toast("Print feature is coming soon", {
                    title: "Pending",
                    variant: "info",
                    delay: 300,
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.radio {
    display: flex;
    margin: 20px 0;

    &__input {
        display: none;

        &:checked+.radio__label {
            border: 2px solid red;
            transition: transform 0.3s ease-in-out;
            transform: scale(1.2);
        }
    }

    &__label {
        max-width: 250px;
        cursor: pointer;

        &>img {
            max-width: 100%;
            height: auto;
        }
    }
}
</style>