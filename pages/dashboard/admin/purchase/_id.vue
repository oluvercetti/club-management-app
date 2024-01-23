<template>
    <div>
        <b-container>
            <b-row>
                <b-col md="3" xs="3">
                    <b-button variant="link" @click="goBack()">
                        Go Back
                    </b-button>
                </b-col>
                <b-col md="3" xs="3">
                    <b-button variant="link" @click="printTransactionReceipt()">
                        Print
                    </b-button>
                </b-col>
            </b-row>

            <b-row>
                <b-col>
                    <b-card>
                        <b-card-title>Purchase Details</b-card-title>
                        <b-card-text>
                            <b-row>
                                <b-col md="3">
                                    <strong>Transaction ID:</strong>
                                </b-col>
                                <b-col>{{ purchaseDetails?.trans_id }}</b-col>
                            </b-row>

                            <b-row>
                                <b-col md="3">
                                    <strong>Transaction Type:</strong>
                                </b-col>
                                <b-col>{{ purchaseDetails?.mode_of_payment }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Denomination:</strong>
                                </b-col>
                                <b-col>{{ purchaseDetails?.denomination }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Amount:</strong>
                                </b-col>
                                <b-col>{{ purchaseDetails?.amount | format_amount }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Processed by:</strong>
                                </b-col>
                                <b-col>{{ purchaseDetails?.coordinator }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Transaction Date:</strong>
                                </b-col>
                                <b-col>{{ purchaseDetails?.createdAt }}</b-col>
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
                this.$router.push("/dashboard/admin/purchases")
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
    },
}
</script>

<style lang="scss" scoped></style>