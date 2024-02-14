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
            <b-col md="4">
                <b-button type="button" variant="info" class="mr-1 btn__custom--lg" @click="exportToPdf()">
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
                <b-table ref="purchase" id="b-table-export" :items="purchaseList" :fields="pFields" :busy="isLoading" class="mt-4 small-font"
                    striped hover outlined sort-icon-left>
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
import html2pdf from 'html2pdf.js';
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
            endDate: null
        };
    },

    fetch() {
        this.handleGetAllTransactions();
    },

    fetchOnServer: false,

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

        exportToPdf(){
            const element = document.getElementById('b-table-export'); // Replace 'b-table-export' with the ID of your b-table
            html2pdf(element);
        }
    },
};
</script>

<style lang="scss" scoped></style>