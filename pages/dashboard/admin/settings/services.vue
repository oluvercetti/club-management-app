<template>
    <div class="mt-3">
        <b-container class="mb-4">
            <b-row>
                <b-col md="4">
                    <b-form-radio v-model="viewTable" name="viewTable" value="fee">
                       View Fee Settings
                    </b-form-radio>
                </b-col>
                <b-col md="4">
                    <b-form-radio v-model="viewTable" name="viewTable" value="services">
                        View Service Settings
                    </b-form-radio>
                </b-col>
            </b-row>
        </b-container>
        <b-row>
            <b-col md="12" sm="12" v-if="viewTable === 'fee'">
                <b-button variant="primary" class="mr-3" @click="showNewFeeModal = !showNewFeeModal">
                    Create New Fee
                </b-button>
                <b-table ref="fees" :items="feesList" :fields="feeFields" :busy="isLoading" class="mt-4 small-font" striped
                    hover outlined sort-icon-left>
                    <template #cell(status)="active">
                        <!-- `active.value` is the value after formatted by the Formatter -->
                        <p>{{ active.value ? "Active" : "Inactive" }}</p>
                    </template>
                    <template #cell(createdAt)="createdAt">
                        <p>{{ $moment(createdAt.value).format("DD-MM-YYYY, HH:mm:ss") }}</p>
                    </template>
                    <template #cell(updatedAt)="updatedAt">
                        <p>{{ $moment(updatedAt.value).format("DD-MM-YYYY, HH:mm:ss") }}</p>
                    </template>
                    <template #cell(actions)="row">
                        <div class="d-flex justify-content-around">
                            <b-button variant="primary" @click="handleSelectedFee(row.item)">
                                <b-icon icon="pencil"></b-icon>
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
            <b-col md="12" sm="12" v-if="viewTable === 'services'">
                <b-button variant="primary" class="mr-3" @click="showNewServiceModal = !showNewServiceModal">
                    Create New Service
                </b-button>
                <b-table ref="services" :items="servicesList" :fields="serviceFields" :busy="isLoading"
                    class="mt-4 small-font" striped hover outlined sort-icon-left>
                    <template #cell(status)="active">
                        <!-- `active.value` is the value after formatted by the Formatter -->
                        <p>{{ active.value ? "Active" : "Inactive" }}</p>
                    </template>
                    <template #cell(createdAt)="createdAt">
                        <p>{{ $moment(createdAt.value).format("DD-MM-YYYY, HH:mm:ss") }}</p>
                    </template>
                    <template #cell(updatedAt)="updatedAt">
                        <p>{{ $moment(updatedAt.value).format("DD-MM-YYYY, HH:mm:ss") }}</p>
                    </template>
                    <template #cell(actions)="row">
                        <div class="d-flex justify-content-around">
                            <b-button variant="primary" @click="handleSelectedService(row.item)">
                                <b-icon icon="pencil"></b-icon>
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

        <b-modal v-model="showNewFeeModal" hide-footer title="New Fee">
            <b-form autocomplete="false" @submit.prevent="handleCreateNewFee()">
                <b-form-group label="Fee name" label-for="feeName">
                    <b-form-input id="feeName" type="text" v-model="newFee.fee_name" required />
                </b-form-group>
                <b-form-group label="Fee Type" label-for="feeType">
                    <b-form-select v-model="newFee.fee_type" required>
                        <template #first>
                            <b-form-select-option value="" disabled>
                                -- Please select --
                            </b-form-select-option>
                        </template>
                        <b-form-select-option value="percentage">Percentage</b-form-select-option>
                        <b-form-select-option value="flat">Flat</b-form-select-option>
                    </b-form-select>
                </b-form-group>
                <b-form-group label="Value" label-for="feeValue">
                    <b-form-input v-if="newFee.fee_type === 'flat'" id="feeValue" type="number" min="1"
                        v-model="newFee.fee_value" required />
                    <b-form-input v-else id="feeValue" type="number" min="1" max="100" v-model="newFee.fee_value"
                        required />
                </b-form-group>
                <b-button v-if="isLoading" class="d-flex align-items-center" type="submit" variant="primary" disabled>
                    <span class="mr-2">Please wait...</span>
                    <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                </b-button>
                <b-button v-else type="submit" variant="primary" class="mr-3">
                    Create Fee
                </b-button>
                <b-button type="button" @click="showNewFeeModal = !showNewFeeModal">
                    Cancel
                </b-button>
            </b-form>
        </b-modal>

        <b-modal v-model="showEditFeeModal" hide-footer title="Edit Fee">
            <b-form @submit.prevent="handleUpdateFee(selectedFee)">
                <b-form-group label="Fee name" label-for="feeName">
                    <b-form-input id="feeName" type="text" v-model="selectedFee.fee_name" required />
                </b-form-group>
                <b-form-group label="Fee Type" label-for="feeType">
                    <b-form-select v-model="selectedFee.fee_type" required>
                        <template #first>
                            <b-form-select-option value="" disabled>
                                -- Please select --
                            </b-form-select-option>
                        </template>
                        <b-form-select-option value="percentage">Percentage</b-form-select-option>
                        <b-form-select-option value="flat">Flat</b-form-select-option>
                    </b-form-select>
                </b-form-group>
                <b-form-group label="Value" label-for="feeValue">
                    <b-form-input v-if="selectedFee.fee_type === 'flat'" id="feeValue" type="number" min="1"
                        v-model="selectedFee.fee_value" required />
                    <b-form-input v-else id="feeValue" type="number" min="1" max="100" v-model="selectedFee.fee_value"
                        required />
                </b-form-group>
                <b-form-group label="Status" label-for="feeStatus">
                    <b-form-select v-model="selectedFee.status">
                        <b-form-select-option value="true">Active</b-form-select-option>
                        <b-form-select-option value="false">Inactive</b-form-select-option>
                    </b-form-select>
                </b-form-group>
                <b-button v-if="isLoading" class="d-flex align-items-center" type="submit" variant="primary" disabled>
                    <span class="mr-2">Saving...</span>
                    <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                </b-button>
                <b-button v-else type="submit" variant="primary" class="mr-3">
                    Save
                </b-button>
                <b-button type="button" @click="showEditFeeModal = !showEditFeeModal">
                    Cancel
                </b-button>
            </b-form>
        </b-modal>
        <b-modal v-model="showNewServiceModal" hide-footer title="New Service">
            <b-form autocomplete="false" @submit.prevent="handleCreateNewService()">
                <b-form-group label="Service Name" label-for="serviceName">
                    <b-form-input id="serviceName" type="text" v-model="newService.service_name" required />
                </b-form-group>
                <b-button v-if="isLoading" class="d-flex align-items-center" type="submit" variant="primary" disabled>
                    <span class="mr-2">Please wait...</span>
                    <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                </b-button>
                <b-button v-else type="submit" variant="primary" class="mr-3">
                    Create Service
                </b-button>
                <b-button type="button" @click="showNewServiceModal = !showNewServiceModal">
                    Cancel
                </b-button>
            </b-form>
        </b-modal>

        <b-modal v-model="showEditServiceModal" hide-footer title="Edit Service">
            <b-form @submit.prevent="handleUpdateService(selectedService)">
                <b-form-group label="Service Name" label-for="serviceName">
                    <b-form-input id="serviceName" type="text" v-model="selectedService.service_name" required />
                </b-form-group>
                <b-form-group label="Status" label-for="serviceStatus">
                    <b-form-select v-model="selectedService.status">
                        <b-form-select-option value="true">Active</b-form-select-option>
                        <b-form-select-option value="false">Inactive</b-form-select-option>
                    </b-form-select>
                </b-form-group>
                <b-button v-if="isLoading" class="d-flex align-items-center" type="submit" variant="primary" disabled>
                    <span class="mr-2">Saving...</span>
                    <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                </b-button>
                <b-button v-else type="submit" variant="primary" class="mr-3">
                    Save Changes
                </b-button>
                <b-button type="button" @click="showEditServiceModal = !showEditServiceModal">
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
            feesList: [],
            servicesList: [],
            viewTable: "fee",
            feeFields: [
                { key: "fee_name", label: "Fee Name", sortable: true },
                { key: "fee_type", label: "Fee Type" },
                { key: "fee_value", label: "Fee Value", sortable: true },
                { key: "status", label: "Status", sortable: true },
                { key: "createdAt", label: "Date Created", sortable: true },
                { key: "updatedAt", label: "Date Updated", sortable: true },
                "Actions",
            ],
            serviceFields: [
                { key: "service_name", label: "Service Name", sortable: true },
                { key: "status", label: "Status", sortable: true },
                { key: "createdAt", label: "Date Created", sortable: true },
                { key: "updatedAt", label: "Date Updated", sortable: true },
                "Actions",
            ],
            newFee: {
                fee_name: null,
                fee_type: null,
                fee_value: null,
            },
            newService: {
                service_name: null,
            },
            selectedFee: {
                id: null,
                fee_name: null,
                fee_type: null,
                fee_value: null,
                status: null,
            },
            selectedService: {
                id: null,
                service_name: null,
                status: null,
            },
            showNewFeeModal: false,
            showEditFeeModal: false,
            showNewServiceModal: false,
            showEditServiceModal: false,
            isLoading: false,
        };
    },

    fetch() {
        this.handleGetAllFees();
        this.handleGetAllServices();
    },

    fetchOnServer: false,

    methods: {
        handleGetAllFees() {
            this.isLoading = true;
            return this.$store.dispatch("getFees").then((response) => {
                this.isLoading = false;
                this.feesList = response.data;
            }).catch((error) => {
                this.isLoading = false;
                this.$bvToast.toast(error?.response?.data, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
            });
        },


        handleGetAllServices() {
            this.isLoading = true;
            return this.$store.dispatch("getServiceList").then((response) => {
                this.isLoading = false;
                this.servicesList = response.data;
            }).catch((error) => {
                this.isLoading = false;
                this.$bvToast.toast(error?.response?.data, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
            });
        },

        handleCreateNewFee() {
            const payload = {
                fee_name: this.newFee.fee_name,
                fee_type: this.newFee.fee_type,
                fee_value: this.newFee.fee_value,
            };
            this.isLoading = true;
            return this.$store.dispatch("createNewFee", payload).then(() => {
                this.$bvToast.toast("Fee created successfully", {
                    title: "Success",
                    variant: "success",
                    delay: 300,
                });
                this.showNewFeeModal = false;
                this.resetFeeValues();
                this.isLoading = false;
                this.handleGetAllFees();
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                this.isLoading = false;
            });
        },


        handleCreateNewService() {
            const payload = {
                service_name: this.newService.service_name,
            };
            this.isLoading = true;
            return this.$store.dispatch("createNewService", payload).then(() => {
                this.$bvToast.toast("Service created successfully", {
                    title: "Success",
                    variant: "success",
                    delay: 300,
                });
                this.showNewServiceModal = false;
                this.resetServiceValues();
                this.isLoading = false;
                this.handleGetAllServices();
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                this.isLoading = false;
            });
        },

        handleSelectedFee(data) {
            this.selectedFee.id = data._id;
            this.selectedFee.fee_name = data.fee_name;
            this.selectedFee.fee_type = data.fee_type;
            this.selectedFee.fee_value = data.fee_value;
            this.selectedFee.status = data.status;
            this.showEditFeeModal = true;
        },


        handleSelectedService(data) {
            this.selectedService.id = data._id;
            this.selectedService.service_name = data.service_name;
            this.selectedService.status = data.status;
            this.showEditServiceModal = true;
        },

        handleUpdateFee(data) {
            const id = data.id;
            const payload = {
                fee_name: this.selectedFee.fee_name,
                fee_type: this.selectedFee.fee_type,
                fee_value: this.selectedFee.fee_value,
                status: this.selectedFee.status,
            };
            this.isLoading = true;
            return this.$store.dispatch("updateFee", { id, payload }).then((response) => {
                this.$bvToast.toast("Fee updated successfully", {
                    title: "Success",
                    variant: "success",
                    delay: 300,
                });
                this.showEditFeeModal = false;
                this.isLoading = false;
                this.handleGetAllFees();
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                this.isLoading = false;
            });
        },

        handleUpdateService(data) {
            const id = data.id;
            const payload = {
                service_name: this.selectedService.service_name,
                status: this.selectedService.status,
            };
            this.isLoading = true;
            return this.$store.dispatch("updateService", { id, payload }).then((response) => {
                this.$bvToast.toast("Service updated successfully", {
                    title: "Success",
                    variant: "success",
                    delay: 300,
                });
                this.showEditServiceModal = false;
                this.isLoading = false;
                this.handleGetAllServices();
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                this.isLoading = false;
            });
        },


        resetFeeValues() {
            this.newFee = {
                fee_name: null,
                fee_type: null,
                fee_value: null,
            }
        },

        resetServiceValues() {
            this.newService = {
                service_name: null,
            }
        },

    },
};
</script>

<style lang="scss" scoped></style>