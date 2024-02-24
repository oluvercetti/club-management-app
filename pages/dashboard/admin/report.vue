<template>
    <div class="mt-3">
        <b-row class="mb-3">
            <b-col md="3" xs="3">
                <b-button variant="link" @click="goBack()">
                    Go Back
                </b-button>
            </b-col>
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

        <client-only>
            <b-row class="mb-3">
                <b-col md="4">
                    <b-form-group label="Report Date" label-for="report-date">
                        <b-form-datepicker id="report-date" v-model="reportDate" required></b-form-datepicker>
                    </b-form-group>
                </b-col>
            </b-row>
        </client-only>
        <b-row>
            <b-col md="3">
                <b-button type="button" variant="info" @click="handleGetReport()">
                    Regenerate Report
                </b-button>
            </b-col>
            <b-col md="3">
                <b-button type="button" variant="info" @click="exportToPdf()">
                    Export to PDF
                </b-button>
            </b-col>
            <b-col md="3">
                <b-button type="button" variant="info" @click="exportToExcel()">
                    Export to Excel
                </b-button>
            </b-col>
            <b-col md="12" sm="12" v-if="viewTable === 'lodgement'">
                <b-table ref="lodgement" id="b-table-export" :items="lodgementList" :fields="lFields" :busy="isLoading"
                    class="mt-4 small-font" :per-page="lodgement.perPage" :current-page="lodgement.currentPage" striped hover outlined
                    sort-icon-left>
                    <template #cell(_id)="name">
                        <p>{{ name.value.toUpperCase() }}</p>
                    </template>
                    <template #cell(total_amount)="total_amount">
                        <p>{{ total_amount.value | format_amount }}</p>
                    </template>
                    <template #cell(total_commission)="total_commission">
                        <p>{{ total_commission.value | format_amount }}</p>
                    </template>
                    <template #cell(sub_total)="sub_total">
                        <p>{{ sub_total.value | format_amount }}</p>
                    </template>
                    <template #cell(coordinator_fee)="coordinator_fee">
                        <p>{{ coordinator_fee.value | format_amount }}</p>
                    </template>
                    <template #cell(net_total)="net_total">
                        <p>{{ net_total.value | format_amount }}</p>
                    </template>
                    <template #table-busy>
                        <div class="text-center text-info my-2">
                            <b-spinner class="align-middle" />
                            <strong>Loading...</strong>
                        </div>
                    </template>
                </b-table>
                <b-pagination v-if="lTotalRows > lodgement.perPage" v-model="lodgement.currentPage" :total-rows="lTotalRows" :per-page="lodgement.perPage"
                    first-text="First" prev-text="Prev" next-text="Next" last-text="Last" size="lg" align="center" />
            </b-col>
            <b-col md="12" sm="12" v-if="viewTable === 'purchase'">
                <b-table ref="purchase" id="b-table-export" :items="purchaseList" :fields="pFields" :busy="isLoading"
                    class="mt-4 small-font" :per-page="purchase.perPage" :current-page="purchase.currentPage"  striped hover outlined sort-icon-left>
                    <template #cell(_id)="name">
                        <p>{{ name.value.toUpperCase() }}</p>
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
                    <template #table-busy>
                        <div class="text-center text-info my-2">
                            <b-spinner class="align-middle" />
                            <strong>Loading...</strong>
                        </div>
                    </template>
                </b-table>
                <b-pagination v-if="pTotalRows > purchase.perPage" v-model="purchase.currentPage" :total-rows="lTotalRows" :per-page="purchase.perPage"
                    first-text="First" prev-text="Prev" next-text="Next" last-text="Last" size="lg" align="center" />
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
                { key: "_id", label: "Name" },
                { key: "total_amount", label: "Lodge Fee" },
                { key: "total_commission", label: "Commission" },
                { key: "sub_total", label: "Girls Money" },
                { key: "coordinator_fee", label: "Coordinator" },
                { key: "net_total", label: "Take Home" },
            ],
            pFields: [
                { key: "_id", label: "Name" },
                { key: "amount_booked", label: "Booked", sortable: true },
                { key: "amount_sold", label: "Sold", sortable: true },
                { key: "amount_returned", label: "Returned", sortable: true },
                { key: "service_charge_amount", label: "Charge", sortable: true },
            ],
            isLoading: false,
            reportDate: new Date().toISOString().split('T')[0],
            lodgement: {
                perPage: 8,
                currentPage: 1,
            },
            purchase: {
                perPage: 8,
                currentPage: 1,
            },
            feesList: [],
        };
    },

    fetch() {
        this.handleGetReport();
        this.handleGetAllFees();
    },

    fetchOnServer: false,

    methods: {
        handleGetReport() {
            this.isLoading = true;
            const params = {
                reportDate: this.reportDate
            }
            return this.$store.dispatch("getReport", params).then((response) => {
                this.isLoading = false;
                this.purchaseList = response.data.purchasesReport;
                this.lodgementList = response.data.lodgementsReport;
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

        async exportToPdf() {
            const data = this.viewTable === 'lodgement' ? this.lodgementList : this.purchaseList;
            if(this.viewTable === 'lodgement' && this.lodgementList?.length < 1) {
                this.$bvToast.toast("There are no cash lodgement records ", {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                return false;
            }

            if(this.viewTable === 'purchase' && this.purchaseList?.length < 1) {
                this.$bvToast.toast("There are no cash purchase records ", {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                return false;
            }
            const today = this.reportDate || new Date().toISOString().split('T')[0];
            let tableContent = `<h2>${this.viewTable === "lodgement" ? "GIRLS SALES" : "CASH PURCHASE"} SUMMARY ${today}</h2><br>
            <table style="border-collapse: collapse; width: 100%; margin-bottom: 10px; color: black; font-size: 16px;">`;
            if (this.viewTable === 'lodgement') {

                tableContent += `<thead><tr>
                <th style="border: 1px solid black; padding: 5px;">Name</th>
                <th style="border: 1px solid black; padding: 5px;">Lodge Fee</th>
                <th style="border: 1px solid black; padding: 5px;">${this.dancersFee}% Commission</th>
                <th style="border: 1px solid black; padding: 5px;">${100 - parseFloat(this.dancersFee)}% Girls Money</th>
                <th style="border: 1px solid black; padding: 5px;">Coordinator</th>
                <th style="border: 1px solid black; padding: 5px;">Take Home</th>
                </tr></thead>
                <tbody>`;
                data.forEach(item => {
                    tableContent += `<tr>
                    <td style="border: 1px solid black; padding: 5px;">${item._id.toUpperCase()}</td>
                    <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(item.total_amount)}</td>
                    <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(item.total_commission)}</td>
                    <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(item.sub_total)}</td>
                    <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(item.coordinator_fee)}</td>
                    <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(item.net_total)}</td>
                    </tr>`;
                });

            } else {

                tableContent += `<thead><tr>
                <th style="border: 1px solid black; padding: 5px;">Name</th>
                <th style="border: 1px solid black; padding: 5px;">Amount Booked</th>
                <th style="border: 1px solid black; padding: 5px;">Amount Sold</th>
                <th style="border: 1px solid black; padding: 5px;">Amount Returned</th>
                <th style="border: 1px solid black; padding: 5px;">${this.serviceCharge}% Service Charge</th>
                </tr></thead>
                <tbody>`;
                data.forEach(item => {
                    tableContent += `<tr>
                    <td style="border: 1px solid black; padding: 5px;">${item._id.toUpperCase()}</td>
                    <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(item.amount_booked)}</td>
                    <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(item.amount_sold)}</td>
                    <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(item.amount_returned)}</td>
                    <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(item.service_charge_amount)}</td>
                    </tr>`;
                });
            }
            tableContent += '</tbody></table>';
            const filename = `${this.viewTable}_${today}.pdf`;
            var opt = {
                margin: 1,
                filename,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'a2', orientation: 'portrait' }
            };
            await this.$html2pdf(tableContent, opt);
        },

        async exportToExcel() {
            const data = this.viewTable === 'lodgement' ? this.lodgementList : this.purchaseList;
            if(this.viewTable === 'lodgement' && this.lodgementList?.length < 1) {
                this.$bvToast.toast("There are no cash lodgement records ", {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                return false;
            }

            if(this.viewTable === 'purchase' && this.purchaseList?.length < 1) {
                this.$bvToast.toast("There are no cash purchase records ", {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                return false;
            }
            const today = this.reportDate || new Date().toISOString().split('T')[0];
            let tableContent = `<table>`;
            if (this.viewTable === 'lodgement') {

                tableContent += `<thead><tr>
                <th>Name</th>
                <th>Lodge Fee</th>
                <th>${this.dancersFee}% Commission</th>
                <th>${100 - parseFloat(this.dancersFee)}% Girls Money</th>
                <th>Coordinator</th>
                <th>Take Home</th>
                </tr></thead>
                <tbody>`;
                data.forEach(item => {
                    tableContent += `<tr>
                    <td>${item._id.toUpperCase()}</td>
                    <td>${this.$options.filters.format_amount(item.total_amount)}</td>
                    <td>${this.$options.filters.format_amount(item.total_commission)}</td>
                    <td>${this.$options.filters.format_amount(item.sub_total)}</td>
                    <td>${this.$options.filters.format_amount(item.coordinator_fee)}</td>
                    <td>${this.$options.filters.format_amount(item.net_total)}</td>
                    </tr>`;
                });

            } else {

                tableContent += `<thead><tr>
                <th>Name</th>
                <th>Amount Booked</th>
                <th>Amount Sold</th>
                <th>Amount Returned</th>
                <th>${this.serviceCharge}% Service Charge</th>
                </tr></thead>
                <tbody>`;
                data.forEach(item => {
                    tableContent += `<tr>
                    <td>${item._id.toUpperCase()}</td>
                    <td>${this.$options.filters.format_amount(item.amount_booked)}</td>
                    <td>${this.$options.filters.format_amount(item.amount_sold)}</td>
                    <td>${this.$options.filters.format_amount(item.amount_returned)}</td>
                    <td>${this.$options.filters.format_amount(item.service_charge_amount)}</td>
                    </tr>`;
                });
            }
            tableContent += '</tbody></table>';
            const filename = `${this.viewTable}_${today}`;
            await this.$htmlToXlsx(tableContent, filename);
        },

        goBack() {
            this.$router.go(-1);
        },

        handleGetAllFees() {
            return this.$store.dispatch("getFees").then((response) => {
                this.isLoading = false;
                this.feesList = response.data;
            }).catch((error) => {
                this.isLoading = false;
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
            });
        },
    },

    computed: {
        computedReportList() {
            return this.data
        },

        pTotalRows() {
            return this.purchaseList?.length;
        },

        lTotalRows() {
            return this.lodgementList?.length;
        },

        serviceCharge() {
            const fee = this.feesList.find(fee => fee.fee_name === 'purchase_service_charge');
            return fee?.fee_value;
        },

        dancersFee() {
            const fee = this.feesList.find(fee => fee.fee_name.toLowerCase() == "house fee for dancers");
            return fee?.fee_value;
        },
    },
};
</script>

<style lang="scss" scoped></style>