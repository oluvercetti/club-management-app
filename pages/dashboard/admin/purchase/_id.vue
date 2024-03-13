<template>
    <div>
        <iframe id="printFrame" style="display:none;"></iframe>
        <b-container>
            <b-row class="mb-3">
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
                <b-col md="3" xs="3" v-if="[1,2,6].includes(roleId)">
                    <b-button variant="danger" @click="handleCancelSinglePurchase()" :disabled="purchaseDetails.voided_by !== ''">
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
import appLogo from "@/plugins/logo"
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
            this.$store.dispatch("sendToPrinter", data).then(() => {
                this.$bvToast.toast("Printing is done", {
                    title: "Printed",
                    variant: "info",
                    delay: 300,
                });
            }).catch((error) => {
                /* this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                }); */
                this.createPrintOut(this.purchaseDetails)
            });
        },

        createPrintOut(data) {
            let tableContent = `<div style="width:100%; text-align: center;">${appLogo}</div>
            <h2>Cash Lodgement</h2><br>
            <table style="border-collapse: collapse; width: 100%; margin-bottom: 10px; color: black; font-size: 16px; font-weight: 600; letter-spacing: 1.2px">
                <thead></thead>
                <tbody>
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Date</td>
                        <td style="border: 1px solid black; padding: 5px;">${this.$moment(data.createdAt).format("DD-MM-YYYY, HH:mm:ss")}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Coordinator</td>
                        <td style="border: 1px solid black; padding: 5px;">${data.coordinator.toUpperCase()}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Transaction ID</td>
                        <td style="border: 1px solid black; padding: 5px;">${data.trans_id.toUpperCase()}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Amount Booked</td>
                        <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(data.amount_booked)}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Amount Sold</td>
                        <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(data.amount_sold)}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Amount Returned</td>
                        <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(data.amount_returned)}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Service Charge</td>
                        <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(data?.service_charge_amount)}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Denomination</td>
                        <td style="border: 1px solid black; padding: 5px;">${data.denomination.toUpperCase()}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Cashier</td>
                        <td style="border: 1px solid black; padding: 5px;">${data.cashier ? data.cashier.toUpperCase() : ""}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Status</td>
                        <td style="border: 1px solid black; padding: 5px;">${data.status.toUpperCase()}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Date Last Updated</td>
                        <td style="border: 1px solid black; padding: 5px;">${this.$moment(data.updatedAt).format("DD-MM-YYYY, HH:mm:ss")}</td>
                    </tr>`;
            if (data.voided_by) {
                tableContent += `
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Voided By</td>
                        <td style="border: 1px solid black; padding: 5px;">${data.voided_by.toUpperCase()}</td>
                    </tr>`;
            }
            tableContent += `
                </tbody>
            </table>`;
            this.printCopy = tableContent;
            const printFrame = document.getElementById('printFrame');
            const frameDoc = printFrame.contentWindow.document;
            frameDoc.open();
            frameDoc.write(tableContent);
            frameDoc.close();

            printFrame.contentWindow.focus(); // Focus the iframe
            printFrame.contentWindow.print(); // Print the iframe content
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