<template>
    <div class="mt-3">
        <b-container class="mb-4">
            <b-row>
                <b-col md="4">
                    <b-button variant="primary" class="mr-3" @click="viewTable = 'lodgement'">
                        View Lodgements
                    </b-button>
                </b-col>
                <b-col md="4">
                    <b-button variant="primary" class="mr-3" @click="viewTable = 'purchase'">
                        View Purchases
                    </b-button>
                </b-col>
            </b-row>
        </b-container>
        <b-container class="mb-4">
            <b-row>
                <b-col md="4">
                    <b-form-group label="Start Date" label-for="report-date">
                    <b-form-datepicker id="report-date" v-model="reportDate" required></b-form-datepicker>
                </b-form-group>
                </b-col>
                <b-col md="4">
                    <b-button type="button" variant="info" @click="handleGetReport()">
                        Generate
                    </b-button>
                </b-col>
            </b-row>
        </b-container>
        <b-row>
            <b-col md="4">
                <b-button type="button" variant="success" @click="exportToPdf()">
                    Export to PDF
                </b-button>
            </b-col>
            <b-col md="12" sm="12" v-if="viewTable === 'lodgement'">
                <b-table ref="lodgement" :items="lodgementList" :fields="lFields" :busy="isLoading" class="mt-4 small-font"
                    striped hover outlined sort-icon-left>
                    <template #cell(createdAt)="createdAt">
                        <p>{{ $moment(createdAt.value).format("DD-MM-YYYY, HH:mm:ss") }}</p>
                    </template>
                    <template #cell(amount)="amount">
                        <p>{{ amount.value | format_amount }}</p>
                    </template>
                    <template #cell(mode_of_payment)="mode">
                        <p class="text-capitalize">{{ mode.value }}</p>
                    </template>
                    <template #cell(actions)="row">
                        <div class="d-flex justify-content-around">
                            <b-button variant="primary" :to="`/dashboard/admin/lodgement/${row.item.trans_id}`">
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
            <b-col md="12" sm="12" v-if="viewTable === 'purchase'">
                <b-table ref="purchase" :items="purchaseList" :fields="pFields" :busy="isLoading" class="mt-4 small-font"
                    striped hover outlined sort-icon-left>
                    <template #cell(createdAt)="createdAt">
                        <p>{{ $moment(createdAt.value).format("DD-MM-YYYY, HH:mm:ss") }}</p>
                    </template>
                    <template #cell(amount)="amount">
                        <p>{{ amount.value | format_amount }}</p>
                    </template>
                    <template #cell(mode_of_payment)="mode">
                        <p class="text-capitalize">{{ mode.value }}</p>
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
                { key: "createdAt", label: "Date" },
                { key: "trans_id", label: "ID" },
                { key: "mode_of_payment", label: "Mode" },
                { key: "username", label: "User" },
                { key: "amount", label: "Amount" },
                { key: "service_type", label: "Service" },
                { key: "coordinator", label: "Coordinator" },
            ],
            pFields: [
                { key: "createdAt", label: "Date" },
                { key: "trans_id", label: "ID" },
                { key: "mode_of_payment", label: "Mode" },
                { key: "amount", label: "Amount" },
                { key: "coordinator", label: "Coordinator" },
            ],
            isLoading: false,
            reportDate: new Date(),
        };
    },

    fetch() {
        this.handleGetReport();
    },

    fetchOnServer: false,

    methods: {
        handleGetReport() {
            this.isLoading = true;
            const params = {
                reportDate: this.reportDate
            }
            return this.$store.dispatch("getAllTransactions", params).then((response) => {
                this.isLoading = false;
                this.purchaseList = response.data.purchases;
                this.lodgementList = response.data.lodgements;
                this.showDateFilter = false;
            }).catch((error) => {
                this.isLoading = false;
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
            });
        },

        exportToPdf(){

        }
    },

    computed: {
        computedReportList() {
            return this.data 
        }
    },
};
</script>

<style lang="scss" scoped></style>