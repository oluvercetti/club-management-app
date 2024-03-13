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
                <b-col md="3" xs="3" v-if="[1,2].includes(roleId)">
                    <b-button variant="danger" @click="handleCancelSingleLodgement()" :disabled="lodgementDetails.voided_by !== ''">
                        Void Transaction
                    </b-button>
                </b-col>
            </b-row>

            <b-row>
                <b-col>
                    <b-card>
                        <b-card-title class="text__custom--lg">Lodgement Details</b-card-title>
                        <b-card-text class="text__custom--lg">
                            <b-row>
                                <b-col md="3">
                                    <strong>Transaction ID:</strong>
                                </b-col>
                                <b-col>{{ lodgementDetails?.trans_id?.toUpperCase() }}</b-col>
                            </b-row>

                            <b-row>
                                <b-col md="3">
                                    <strong>Transaction Type:</strong>
                                </b-col>
                                <b-col>{{ lodgementDetails?.mode_of_payment?.toUpperCase() }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Dancer:</strong>
                                </b-col>
                                <b-col>{{ lodgementDetails?.username?.toUpperCase() }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Amount:</strong>
                                </b-col>
                                <b-col>{{ lodgementDetails?.amount | format_amount }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Service Type:</strong>
                                </b-col>
                                <b-col>{{ lodgementDetails?.service_type?.toUpperCase() }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Coordinator:</strong>
                                </b-col>
                                <b-col>{{ lodgementDetails?.coordinator?.toUpperCase() }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Cashier:</strong>
                                </b-col>
                                <b-col>{{ lodgementDetails?.cashier?.toUpperCase() }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Transaction Date:</strong>
                                </b-col>
                                <b-col>{{ $moment(lodgementDetails?.createdAt).format("DD-MM-YYYY, HH:mm:ss") }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Date Last Updated:</strong>
                                </b-col>
                                <b-col>{{ $moment(lodgementDetails?.updatedAt).format("DD-MM-YYYY, HH:mm:ss") }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Status:</strong>
                                </b-col>
                                <b-col class="text-capitalize">{{ lodgementDetails?.status?.toUpperCase() }}</b-col>
                            </b-row>
                            <b-row>
                                <b-col md="3">
                                    <strong>Voided By:</strong>
                                </b-col>
                                <b-col class="text-capitalize">{{ lodgementDetails?.voided_by?.toUpperCase() }}</b-col>
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
            lodgementDetails: {},
            isLoading: false,
            printCopy: null,
        }
    },
    created() {
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
                this.createPrintOut(this.lodgementDetails)
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
                        <td style="border: 1px solid black; padding: 5px;">Dancer</td>
                        <td style="border: 1px solid black; padding: 5px;">${data.username.toUpperCase()}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Transaction ID</td>
                        <td style="border: 1px solid black; padding: 5px;">${data.trans_id.toUpperCase()}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Amount</td>
                        <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(data.amount)}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Cashier</td>
                        <td style="border: 1px solid black; padding: 5px;">${data.cashier.toUpperCase()}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Coordinator</td>
                        <td style="border: 1px solid black; padding: 5px;">${data.coordinator.toUpperCase()}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Mode of Payment</td>
                        <td style="border: 1px solid black; padding: 5px;">${data.mode_of_payment.toUpperCase()}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Service Type</td>
                        <td style="border: 1px solid black; padding: 5px;">${data.service_type.toUpperCase()}</td>
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

        handleCancelSingleLodgement() {
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
                    return this.$store.dispatch("cancelSingleLodgement", {id}).then(() => {
                        this.getLodgementDetails()
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