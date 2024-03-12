<template>
    <div>
        <b-container>
            <b-row class="mb-3">
                <b-col md="3" xs="3">
                    <b-button variant="link" @click="goBack()">
                        Go Back
                    </b-button>
                </b-col>
                <!-- <b-col md="3" xs="3">
                    <b-button variant="link" @click="printTransactionReceipt()">
                        Print
                    </b-button>
                </b-col> -->
                <b-col md="3" xs="3" v-if="[1,2].includes(roleId)">
                    <b-button variant="danger" @click="handleCancelSinglePurchase()" :disabled="purchaseDetails?.voided_by">
                        Void Transaction
                    </b-button>
                </b-col>
            </b-row>

            <b-row>
                <b-col>
                    <b-card>
                        <b-card-title class="text__custom--lg">Purchase Details</b-card-title>
                        <b-card-text class="text__custom--lg">
                            <b-row>
                                <b-col md="3">
                                    <strong>Transaction ID:</strong>
                                </b-col>
                                <b-col>{{ purchaseDetails?.trans_id?.toUpperCase() }}</b-col>
                            </b-row>

                            <b-row>
                                <b-col md="3">
                                    <strong>Amount Booked:</strong>
                                </b-col>
                                <b-col>{{ purchaseDetails?.amount_booked | format_amount }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Denomination:</strong>
                                </b-col>
                                <b-col>{{ purchaseDetails?.denomination }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Amount Sold:</strong>
                                </b-col>
                                <b-col>{{ purchaseDetails?.amount_sold | format_amount }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Amount Returned:</strong>
                                </b-col>
                                <b-col>{{ purchaseDetails?.amount_returned | format_amount }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Service Charge:</strong>
                                </b-col>
                                <b-col>{{ purchaseDetails?.service_charge_amount | format_amount }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Processed by:</strong>
                                </b-col>
                                <b-col class="text-capitalize">{{ purchaseDetails?.coordinator?.toUpperCase() }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Completed by:</strong>
                                </b-col>
                                <b-col class="text-capitalize">{{ purchaseDetails?.cashier?.toUpperCase() }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Transaction Date:</strong>
                                </b-col>
                                <b-col>{{ $moment(purchaseDetails?.createdAt).format("DD-MM-YYYY, HH:mm:ss") }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Date Last Updated:</strong>
                                </b-col>
                                <b-col>{{ $moment(purchaseDetails?.updatedAt).format("DD-MM-YYYY, HH:mm:ss") }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Status:</strong>
                                </b-col>
                                <b-col class="text-capitalize">{{ purchaseDetails?.status?.toUpperCase() }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Voided By:</strong>
                                </b-col>
                                <b-col class="text-capitalize">{{ purchaseDetails?.voided_by?.toUpperCase() }}</b-col>
                            </b-row>
                        </b-card-text>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
export default {
    layout: "admin",
    data() {
        return {
            purchaseDetails: {},
            isLoading: false,
        }
    },
    fetch() {
        this.getPurchaseDetails();
    },
    methods: {
        getPurchaseDetails() {
            this.isLoading = true;
            const id = this.$route.params.id;
            return this.$store.dispatch("fetchSinglePurchase", id).then((response) => {
                this.isLoading = false;
                this.purchaseDetails = response.data;
            }).catch((error) => {
                this.isLoading = false;
                this.$bvToast.toast(error?.response?.data, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                this.goBack()
            });
        },
        goBack() {
            this.$router.go(-1);
        },

        printTransactionReceipt(data) {
            this.$bvModal.msgBoxConfirm("Please make sure a printer is connected", {
                title: "Print Receipt",
                size: "md",
                buttonSize: "md",
                okVariant: "info",
                okTitle: "Print",
                cancelTitle: "Cancel",
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

        handleCancelSinglePurchase() {
            this.$bvModal.msgBoxConfirm("Are you sure you want to cancel this transaction", {
                title: "Cancel Transaction",
                size: "md",
                buttonSize: "md",
                okVariant: "info",
                okTitle: "Yes",
                cancelTitle: "No",
                footerClass: "p-2",
                hideHeaderClose: false,
                centered: true,
            }).then((value) => {
                if (value) {
                    this.isLoading = true;
                    const id = this.$route.params.id;
                    return this.$store.dispatch("cancelSinglePurchase", {id}).then(() => {
                        this.getPurchaseDetails()
                    })
                }
            }).catch((error) => {
                this.isLoading = false;
                this.$bvToast.toast(error?.response?.data, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                this.goBack()
            });
        },
    },

    computed: {
        roleId() {
            return this.$store.getters.getUserInfo.role
        }
    },
}
</script>

<style lang="scss" scoped></style>