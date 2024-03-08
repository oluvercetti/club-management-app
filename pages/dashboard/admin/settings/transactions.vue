<template>
    <div class="mt-3">
        <b-row class="mb-3">
            <b-col md="3">
                <b-button variant="primary" class="mr-1 btn__custom--lg" @click="viewTable = 'lodgement'">
                    View Lodgements
                </b-button>
            </b-col>
            <b-col md="3">
                <b-button variant="primary" class="mr-1 btn__custom--lg" @click="viewTable = 'purchase'">
                    View Purchases
                </b-button>
            </b-col>
            <b-col md="3">
                <b-button type="button" variant="info" class="mr-1 btn__custom--lg" @click="showDateFilter = true">
                    Filter by Date
                </b-button>
            </b-col>
            <b-col md="3">
                <b-button type="button" variant="info" class="mr-1 btn__custom--lg" to="/dashboard/admin/report">
                    Generate Report
                </b-button>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="3">
                <b-button type="button" variant="info" class="mr-1 btn__custom--lg" @click="exportToPdf()">
                    Export to PDF
                </b-button>
            </b-col>
            <b-col md="3">
                <b-button type="button" variant="info" class="mr-1 btn__custom--lg" @click="exportToExcel()">
                    Export to Excel
                </b-button>
            </b-col>
            <b-col md="12" class="mt-3" v-if="startDate && endDate && showDate">
                <h3>Date Range from {{ $moment(startDate).format("DD-MM-YYYY") }} to {{ $moment(endDate).format("DD-MM-YYYY") }}</h3>
            </b-col>
            <b-col md="12" sm="12" v-if="viewTable === 'lodgement'">
                <b-table ref="lodgement" id="b-table-export" :items="lodgementList" :fields="lFields" :busy="isLoading"
                    class="mt-4 small-font" :per-page="lodgement.perPage" :current-page="lodgement.currentPage"  striped hover outlined sort-icon-left>
                    <template #cell(createdAt)="createdAt">
                        <p>{{ $moment(createdAt.value).format("DD-MM-YYYY, HH:mm:ss") }}</p>
                    </template>
                    <template #cell(amount)="amount">
                        <p>{{ amount.value | format_amount }}</p>
                    </template>
                    <template #cell(mode_of_payment)="mode">
                        <p>{{ mode.value.toUpperCase() }}</p>
                    </template>
                    <template #cell(username)="username">
                        <p>{{ username.value.toUpperCase() }}</p>
                    </template>
                    <template #cell(service_type)="service_type">
                        <p>{{ service_type.value.toUpperCase() }}</p>
                    </template>
                    <template #cell(coordinator)="coordinator">
                        <p>{{ coordinator.value.toUpperCase() }}</p>
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
                <b-pagination v-if="lTotalRows > lodgement.perPage" v-model="lodgement.currentPage" :total-rows="lTotalRows" :per-page="lodgement.perPage"
                    first-text="First" prev-text="Prev" next-text="Next" last-text="Last" size="lg" align="center" />
            </b-col>
            <b-col md="12" sm="12" v-if="viewTable === 'purchase'">
                <b-table ref="purchase" id="b-table-export" :items="purchaseList" :fields="pFields" :busy="isLoading"
                    class="mt-4 small-font" :per-page="purchase.perPage" :current-page="purchase.currentPage"   striped hover outlined sort-icon-left>
                    <template #cell(createdAt)="createdAt">
                        <p>{{ $moment(createdAt.value).format("DD-MM-YYYY, HH:mm:ss") }}</p>
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
                    <template #cell(coordinator)="coordinator">
                        <p>{{ coordinator.value.toUpperCase() }}</p>
                    </template>
                    <template #cell(actions)="row">
                        <div class="d-flex justify-content-around">
                            <b-button variant="primary" :to="`/dashboard/admin/purchase/${row.item.trans_id}`">
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
                <b-pagination v-if="pTotalRows > purchase.perPage" v-model="purchase.currentPage" :total-rows="pTotalRows" :per-page="purchase.perPage"
                    first-text="First" prev-text="Prev" next-text="Next" last-text="Last" size="lg" align="center" />
            </b-col>
        </b-row>
        <b-modal v-model="showDateFilter" centered hide-footer title="FIlter by date">
            <b-form @submit.prevent="handleGetAllTransactions()">
                <b-form-group label="Start Date" label-for="start-date">
                    <b-form-datepicker id="start-date" v-model="startDate" required></b-form-datepicker>
                </b-form-group>
                <b-form-group label="End Date" label-for="end-date">
                    <b-form-datepicker id="end-date" v-model="endDate" required></b-form-datepicker>
                </b-form-group>
                <b-button type="submit" variant="primary" class="mr-3" :disabled="!endDate || !startDate">
                    Filter Records
                </b-button>
                <b-button type="button" @click="showDateFilter = !showDateFilter">
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
            lodgementList: [],
            viewTable: "lodgement",
            lFields: [
                { key: "createdAt", label: "Date", sortable: true },
                { key: "trans_id", label: "ID" },
                { key: "mode_of_payment", label: "Mode", sortable: true },
                { key: "username", label: "User", sortable: true },
                { key: "amount", label: "Amount", sortable: true },
                { key: "service_type", label: "Service", sortable: true },
                { key: "coordinator", label: "Coordinator", sortable: true },
                "Actions",
            ],
            pFields: [
                { key: "createdAt", label: "Date", sortable: true },
                { key: "trans_id", label: "ID" },
                { key: "amount_booked", label: "Booked", sortable: true },
                { key: "amount_sold", label: "Sold", sortable: true },
                { key: "amount_returned", label: "Returned", sortable: true },
                { key: "service_charge_amount", label: "Charge", sortable: true },
                { key: "coordinator", label: "Coordinator", sortable: true },
                "Actions",
            ],
            showDateFilter: false,
            isLoading: false,
            startDate: null,
            endDate: null,
            showDate: false,
            lodgement: {
                perPage: 8,
                currentPage: 1,
            },
            purchase: {
                perPage: 8,
                currentPage: 1,
            }
        };
    },

    fetch() {
        this.handleGetAllTransactions();
    },

    fetchOnServer: false,

    computed: {
        pTotalRows() {
            return this.purchaseList?.length;
        },

        lTotalRows() {
            return this.lodgementList?.length;
        },
    },

    methods: {
        handleGetAllTransactions() {
            this.isLoading = true;
            const params = {
                startDate: this.startDate,
                endDate: this.endDate
            }
            return this.$store.dispatch("getAllTransactions", params).then((response) => {
                this.isLoading = false;
                this.purchaseList = response.data.purchases;
                this.lodgementList = response.data.lodgements;
                this.showDateFilter = false;
                if(this.startDate && this.endDate) {
                    this.showDate = true;
                }
            }).catch((error) => {
                this.isLoading = false;
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
            });
        },

        handleSelectedTransaction(data) {
            this.selectedTransaction.id = data.id;
            this.selectedTransaction.name = data.name;
            this.selectedTransaction.amount = data.amount;
            this.selectedTransaction.trans_type = data.trans_type;
            this.selectedTransaction.coordinator = data.coordinator;
            this.selectedTransaction.service_type = data.service_type;
            this.showDateFilter = true;
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
            const today = new Date().toISOString().split('T')[0];
            let tableContent = `<h2>${this.viewTable === "lodgement" ? "CASH LODGEMENT" : "CASH SALES"} SUMMARY </h2><br>
            <table style="border-collapse: collapse; width: 100%; margin-bottom: 10px; color: black; font-size: 16px;">`;
            if (this.viewTable === 'lodgement') {

                tableContent += `<thead><tr>
                <th style="border: 1px solid black; padding: 5px;">Date</th>
                <th style="border: 1px solid black; padding: 5px;">ID</th>
                <th style="border: 1px solid black; padding: 5px;">Mode</th>
                <th style="border: 1px solid black; padding: 5px;">Dancer</th>
                <th style="border: 1px solid black; padding: 5px;">Amount</th>
                <th style="border: 1px solid black; padding: 5px;">Service</th>
                <th style="border: 1px solid black; padding: 5px;">Coordinator</th>
                </tr></thead>
                <tbody>`;
                data.forEach(item => {
                    tableContent += `<tr>
                    <td style="border: 1px solid black; padding: 5px;">${this.$moment(item.createdAt).format("DD-MM-YYYY, HH:mm:ss")}</td>
                    <td style="border: 1px solid black; padding: 5px;">${item.trans_id}</td>
                    <td style="border: 1px solid black; padding: 5px;">${item.mode_of_payment.toUpperCase()}</td>
                    <td style="border: 1px solid black; padding: 5px;">${item.username.toUpperCase()}</td>
                    <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(item.amount)}</td>
                    <td style="border: 1px solid black; padding: 5px;">${item.service_type.toUpperCase()}</td>
                    <td style="border: 1px solid black; padding: 5px;">${item.coordinator.toUpperCase()}</td>
                    </tr>`;
                });

            } else {

                tableContent += `<thead><tr>
                <th style="border: 1px solid black; padding: 5px;">Date</th>
                <th style="border: 1px solid black; padding: 5px;">ID</th>
                <th style="border: 1px solid black; padding: 5px;">Booked</th>
                <th style="border: 1px solid black; padding: 5px;">Sold</th>
                <th style="border: 1px solid black; padding: 5px;">Returned</th>
                <th style="border: 1px solid black; padding: 5px;">Charge</th>
                <th style="border: 1px solid black; padding: 5px;">Coordinator</th>
                </tr></thead>
                <tbody>`;
                data.forEach(item => {
                    tableContent += `<tr>
                    <td style="border: 1px solid black; padding: 5px;">${this.$moment(item.createdAt).format("DD-MM-YYYY, HH:mm:ss")}</td>
                    <td style="border: 1px solid black; padding: 5px;">${item.trans_id}</td>
                    <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(item.amount_booked)}</td>
                    <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(item.amount_sold)}</td>
                    <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(item.amount_returned)}</td>
                    <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(item.service_charge_amount)}</td>
                    <td style="border: 1px solid black; padding: 5px;">${item.coordinator.toUpperCase()}</td>
                    </tr>`;
                });
            }
            tableContent += '</tbody></table>';
            const filename = `${this.viewTable}_${today}.pdf`;
            var opt = {
                margin: 1,
                filename,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 4 },
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
            const today = new Date().toISOString().split('T')[0];
            let tableContent = `<h2>${this.viewTable === "lodgement" ? "CASH LODGEMENT" : "CASH SALES"} SUMMARY </h2><br>
            <table style="border-collapse: collapse; width: 100%; margin-bottom: 10px; color: black; font-size: 16px;">`;
            if (this.viewTable === 'lodgement') {

                tableContent += `<thead><tr>
                <th style="border: 1px solid black; padding: 5px;">Date</th>
                <th style="border: 1px solid black; padding: 5px;">ID</th>
                <th style="border: 1px solid black; padding: 5px;">Mode</th>
                <th style="border: 1px solid black; padding: 5px;">Dancer</th>
                <th style="border: 1px solid black; padding: 5px;">Amount</th>
                <th style="border: 1px solid black; padding: 5px;">Service</th>
                <th style="border: 1px solid black; padding: 5px;">Coordinator</th>
                </tr></thead>
                <tbody>`;
                data.forEach(item => {
                    tableContent += `<tr>
                    <td style="border: 1px solid black; padding: 5px;">${this.$moment(item.createdAt).format("DD-MM-YYYY, HH:mm:ss")}</td>
                    <td style="border: 1px solid black; padding: 5px;">${item.trans_id}</td>
                    <td style="border: 1px solid black; padding: 5px;">${item.mode_of_payment.toUpperCase()}</td>
                    <td style="border: 1px solid black; padding: 5px;">${item.username.toUpperCase()}</td>
                    <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(item.amount)}</td>
                    <td style="border: 1px solid black; padding: 5px;">${item.service_type.toUpperCase()}</td>
                    <td style="border: 1px solid black; padding: 5px;">${item.coordinator.toUpperCase()}</td>
                    </tr>`;
                });

            } else {

                tableContent += `<thead><tr>
                <th style="border: 1px solid black; padding: 5px;">Date</th>
                <th style="border: 1px solid black; padding: 5px;">ID</th>
                <th style="border: 1px solid black; padding: 5px;">Booked</th>
                <th style="border: 1px solid black; padding: 5px;">Sold</th>
                <th style="border: 1px solid black; padding: 5px;">Returned</th>
                <th style="border: 1px solid black; padding: 5px;">Charge</th>
                <th style="border: 1px solid black; padding: 5px;">Coordinator</th>
                </tr></thead>
                <tbody>`;
                data.forEach(item => {
                    tableContent += `<tr>
                    <td style="border: 1px solid black; padding: 5px;">${this.$moment(item.createdAt).format("DD-MM-YYYY, HH:mm:ss")}</td>
                    <td style="border: 1px solid black; padding: 5px;">${item.trans_id}</td>
                    <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(item.amount_booked)}</td>
                    <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(item.amount_sold)}</td>
                    <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(item.amount_returned)}</td>
                    <td style="border: 1px solid black; padding: 5px;">${this.$options.filters.format_amount(item.service_charge_amount)}</td>
                    <td style="border: 1px solid black; padding: 5px;">${item.coordinator.toUpperCase()}</td>
                    </tr>`;
                });
            }
            tableContent += '</tbody></table>';
            const filename = `${this.viewTable}_${today}`;
            await this.$htmlToXlsx(tableContent, filename);
        }
    },
};
</script>

<style lang="scss" scoped></style>