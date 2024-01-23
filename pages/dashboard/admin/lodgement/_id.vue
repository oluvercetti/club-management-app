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
                        <b-card-title>Lodgement Details</b-card-title>
                        <b-card-text>
                            <b-row>
                                <b-col md="3">
                                    <strong>Transaction ID:</strong>
                                </b-col>
                                <b-col>{{ lodgementDetails.trans_id }}</b-col>
                            </b-row>

                            <b-row>
                                <b-col md="3">
                                    <strong>Transaction Type:</strong>
                                </b-col>
                                <b-col>{{ lodgementDetails.mode_of_payment }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Dancer:</strong>
                                </b-col>
                                <b-col>{{ lodgementDetails.username }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Amount:</strong>
                                </b-col>
                                <b-col>{{ lodgementDetails.amount | format_amount }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Service Type:</strong>
                                </b-col>
                                <b-col>{{ lodgementDetails.service_type }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Coordinator:</strong>
                                </b-col>
                                <b-col>{{ lodgementDetails.coordinator }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Cashier:</strong>
                                </b-col>
                                <b-col>{{ lodgementDetails.cashier }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Transaction Date:</strong>
                                </b-col>
                                <b-col>{{ lodgementDetails.createdAt }}</b-col>
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
            lodgementDetails: {},
            isLoading: false,
        }
    },
    fetch() {
        this.getLodgementDetails();
    },
    methods: {
        getLodgementDetails(){
            this.isLoading = true;
            const id = this.$route.params.id;
            return this.$store.dispatch("fetchSingleLodgement", id).then((response) => {
                this.isLoading = false;
                this.lodgementDetails = response.data;
            }).catch((error) => {
                this.isLoading = false;
                this.$bvToast.toast(error?.response?.data, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                this.$router.push("/dashboard/admin/lodgement")
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