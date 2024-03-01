<template>
    <div class="mt-3">
        <b-container>
            <b-row class="mb-3">
                <b-col md="3" sm="3" v-if="roleId == 1">
                    <b-button variant="primary" class="mr-1 btn__custom--lg" @click="showNewUserModal = !showNewUserModal">
                        Create New User
                    </b-button>
                </b-col>
                <b-col md="3" sm="3" v-if="roleId == 1">
                    <b-button variant="primary" class="mr-1 btn__custom--lg" @click="showNewRoleModal = !showNewRoleModal">
                        Create New Role
                    </b-button>
                </b-col>
                <b-col md="3" sm="3">
                    <b-button variant="primary" class="mr-1 btn__custom--lg" @click="handleGetAllUsers(4)">
                        View Dancers
                    </b-button>
                </b-col>
                <b-col md="3" sm="3">
                    <b-button variant="primary" class="mr-1 btn__custom--lg" @click="handleGetAllUsers()">
                        View All Users
                    </b-button>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                </b-col>
            </b-row>
        </b-container>
        <b-table ref="users" :items="userList" :fields="fields" :busy="isLoading"  :per-page="user.perPage" :current-page="user.currentPage" class="mt-4 small-font" striped hover
            outlined sort-icon-left>

            <template #cell(role)="role">
                <p>{{ getRoleName(role.value) }}</p>
            </template>
            <template #cell(status)="active">
                <!-- `active.value` is the value after formatted by the Formatter -->
                <p>{{ active.value ? "Active" : "Inactive" }}</p>
            </template>

            <template #cell(createdAt)="createdAt">
                <p>{{ $moment(createdAt.value).format("DD-MM-YYYY") }}</p>
            </template>

            <template #cell(updatedAt)="updatedAt">
                <p>{{ $moment(updatedAt.value).format("DD-MM-YYYY") }}</p>
            </template>

            <template #cell(actions)="row">
                <div class="d-flex justify-content-around">
                    <b-button variant="primary" @click="handleSelectedUser(row.item)">
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
        <b-pagination v-if="userTotalRows > user.perPage" v-model="user.currentPage" :total-rows="userTotalRows"
            :per-page="user.perPage" first-text="First" prev-text="Prev" next-text="Next" last-text="Last" size="lg"
            align="center" />

        <b-modal v-model="showNewUserModal" hide-footer title="New User">
            <b-form autocomplete="false" @submit.prevent="handleCreateNewUser()">
                <b-form-group label="Role" label-for="role">
                    <b-form-select v-model="newUser.role" :options="computedRoleList" required></b-form-select>
                </b-form-group>
                <b-form-group label="Name" label-for="name">
                    <b-form-input id="name" type="text" v-model="newUser.name" required />
                </b-form-group>
                <b-form-row v-if="newUser.role !== 4">
                    <b-col md="12">
                        <b-form-group label="Username" label-for="newUsername">
                            <b-form-input autocomplete="off" id="newUsername" type="text" v-model="newUser.username"
                                :required="newUser.role !== 4" />
                        </b-form-group></b-col>
                    <b-col md="12">
                        <b-form-group label="Password" label-for="newPassword">
                            <b-form-input autocomplete="off" id="newPassword" type="password" v-model="newUser.password"
                                required />
                        </b-form-group></b-col>
                </b-form-row>
                <div class="form__button-container">
                    <b-button v-if="isLoading" class="d-flex align-items-center mr-3" type="submit" variant="primary"
                        disabled>
                        <span class="mr-2">Please wait...</span>
                        <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                    </b-button>
                    <b-button v-else type="submit" variant="primary" class="mr-3">
                        Create User
                    </b-button>
                    <b-button type="button" @click="showNewUserModal = !showNewUserModal">
                        Cancel
                    </b-button>
                </div>
            </b-form>
        </b-modal>

        <b-modal v-model="showExistingUserModal" hide-footer title="Edit User">
            <template v-if="selectedUser.role !== 4">
                <b-button v-if="resetPassword" type="button" variant="info" @click="resetPassword = !resetPassword">
                    Update User
                </b-button>
                <b-button v-else type="button" variant="danger" @click="resetPassword = !resetPassword">
                    Reset User Password
                </b-button>
            </template>
            <b-form class="mt-3" v-if="resetPassword" @submit.prevent="handleResetPassword(selectedUser)">
                <b-form-group label="New Reset Password" label-for="newResetPassword">
                    <b-form-input autocomplete="off" id="newResetPassword" type="password" v-model="selectedUser.newResetPassword" required />
                </b-form-group>
                <div class="form__button-container">
                    <b-button v-if="isLoading" class="d-flex align-items-center mr-3" type="submit" variant="primary"
                        disabled>
                        <span class="mr-2">Saving...</span>
                        <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                    </b-button>
                    <b-button v-else type="submit" variant="primary" class="mr-3">
                        Save User
                    </b-button>
                    <b-button type="button" @click="showExistingUserModal = !showExistingUserModal">
                        Cancel
                    </b-button>
                </div>
            </b-form>
            <b-form class="mt-3" v-else @submit.prevent="handleUpdateSingleUser(selectedUser)">
                <b-form-group label="Role" label-for="edit-role">
                    <b-form-select v-model="selectedUser.role" :options="computedRoleList" required></b-form-select>
                </b-form-group>
                <b-form-group label="Username" label-for="edit-username">
                    <b-form-input id="edit-username" v-model="selectedUser.username" required />
                </b-form-group>
                <b-form-group label="Name" label-for="edit-name">
                    <b-form-input id="edit-name" v-model="selectedUser.name" required />
                </b-form-group>
                <b-form-group label="Status" label-for="edit-status">
                    <b-form-select v-model="selectedUser.status">
                        <b-form-select-option value="true">Active</b-form-select-option>
                        <b-form-select-option value="false">Inactive</b-form-select-option>
                    </b-form-select>
                </b-form-group>
                <div class="form__button-container">
                    <b-button v-if="isLoading" class="d-flex align-items-center mr-3" type="submit" variant="primary"
                        disabled>
                        <span class="mr-2">Saving...</span>
                        <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                    </b-button>
                    <b-button v-else type="submit" variant="primary" class="mr-3">
                        Save User
                    </b-button>
                    <b-button type="button" @click="showExistingUserModal = !showExistingUserModal">
                        Cancel
                    </b-button>
                </div>
            </b-form>
        </b-modal>

        <b-modal v-model="showNewRoleModal" hide-footer title="New Role">
            <b-form autocomplete="false" @submit.prevent="handleCreateNewRole()">
                <b-form-group label="Role Name" label-for="role-name">
                    <b-form-input id="role-name" type="text" v-model="newRole.name" required />
                </b-form-group>
                <b-form-group label="Description" label-for="description">
                    <b-form-textarea id="description" rows="2" v-model="newRole.description" />
                </b-form-group>
                <div class="form__button-container">
                    <b-button v-if="isLoading" class="d-flex align-items-center mr-3" type="submit" variant="primary"
                        disabled>
                        <span class="mr-2">Please wait...</span>
                        <b-spinner style="width: 1.5rem; height: 1.5rem;" />
                    </b-button>
                    <b-button v-else type="submit" variant="primary" class="mr-3">
                        Create Role
                    </b-button>
                    <b-button type="button" @click="showNewRoleModal = !showNewRoleModal">
                        Cancel
                    </b-button>
                </div>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
export default {

    data() {
        return {
            userList: [],
            roleList: [],
            fields: [
                { key: "name", label: "Name", sortable: true },
                { key: "username", label: "Username", sortable: true },
                { key: "role", label: "Role", sortable: true },
                { key: "status", label: "Status", sortable: true },
                { key: "createdAt", label: "Created", sortable: true },
                { key: "updatedAt", label: "Updated", sortable: true },
                "Actions",
            ],
            newUser: {
                username: null,
                password: null,
                role: null,
                name: null
            },
            selectedUser: {
                id: null,
                username: null,
                role: null,
                name: null,
                status: null
            },
            newRole: {
                name: null,
                description: null,
            },
            showNewUserModal: false,
            showNewRoleModal: false,
            showExistingUserModal: false,
            isLoading: false,
            roleId: this.$store.getters?.getUserInfo?.role,
            user: {
                perPage: 8,
                currentPage: 1,
            },
            resetPassword: false,
        };
    },

    fetch() {
        this.handleGetAllUsers();
        return this.handleGetRoleList();
    },

    fetchOnServer: false,

    computed: {
        computedRoleList() {
            return this.roleList.map((data) => {
                return { value: data.role_id, text: data.role_name.toUpperCase() };
            }
            )
        },

        userTotalRows() {
            return this.userList?.length;
        },
    },

    watch: {
        "newUser.role"() {
            if (this.newUser.role > 4) {
                this.newUser.password = 12345678;
            }
        }
    },

    methods: {
        handleGetAllUsers(role = null) {
            this.isLoading = true;
            const params = {
                role,
            }
            return this.$store.dispatch("getAllUsers", params).then((response) => {
                this.isLoading = false;
                this.userList = response.data;
            }).catch((error) => {
                this.isLoading = false;
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
            });
        },

        handleCreateNewUser() {
            const payload = {
                username: this.newUser.role !== 4 ? this.newUser.username : this.newUser.name.toLowerCase(),
                password: this.newUser.password,
                role: this.newUser.role,
                name: this.newUser.name,
            };
            this.isLoading = true;
            return this.$store.dispatch("createNewUser", payload).then(() => {
                this.$bvToast.toast("User Created Successfully", {
                    title: "Success",
                    variant: "success",
                    delay: 300,
                });
                this.showNewUserModal = false;
                this.resetUserValues();
                this.isLoading = false;
                this.handleGetAllUsers();
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                this.isLoading = false;
            });
        },

        handleCreateNewRole() {
            const payload = {
                role_name: this.newRole.name,
                role_description: this.newRole?.description,
            };
            this.isLoading = true;
            return this.$store.dispatch("createNewRole", payload).then(() => {
                this.$bvToast.toast("Role Created Successfully", {
                    title: "Success",
                    variant: "success",
                    delay: 300,
                });
                this.showNewRoleModal = false;
                this.resetRoleValues();
                this.isLoading = false;
                this.handleGetRoleList();
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                this.isLoading = false;
            });
        },

        handleSelectedUser(data) {
            this.resetPassword = false;
            this.selectedUser.username = data.username;
            this.selectedUser.role = data.role;
            this.selectedUser.id = data._id;
            this.selectedUser.name = data.name;
            this.selectedUser.status = data.status;
            this.showExistingUserModal = true;
        },

        handleUpdateSingleUser(data) {
            const id = data.id;
            const payload = {
                username: data.username,
                role: data.role,
                name: data.name,
                status: data.status
            };
            this.isLoading = true;
            return this.$store.dispatch("updateSingleUser", { id, payload }).then((response) => {
                this.$bvToast.toast("User updated successfully", {
                    title: "Success",
                    variant: "success",
                    delay: 300,
                });
                this.showExistingUserModal = false;
                this.isLoading = false;
                this.handleGetAllUsers();
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                this.isLoading = false;
            });
        },

        resetUserValues() {
            this.newUser = {
                username: null,
                password: null,
                role: null,
                name: null
            }

            this.selectedUser = {
                id: null,
                username: null,
                role: null,
                name: null,
                status: null
            }
        },

        resetRoleValues() {
            this.newRole = {
                name: null,
                description: null,
            }
        },


        handleGetRoleList() {
            return this.$store.dispatch("getRoleList").then((response) => {
                this.roleList = response.data;
            }).catch((error) => {
                this.isLoading = false;
                this.$bvToast.toast(error?.response?.data, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
            });
        },

        getRoleName(roleId) {
            const role = this.computedRoleList.find(item => item.value === roleId);
            return role ? role.text : roleId;
        },

        handleResetPassword() {
            const payload = {
                user_id: this.selectedUser.id,
                password: this.selectedUser.newResetPassword,
            };
            this.isLoading = true;
            return this.$store.dispatch("resetPassword", { payload }).then(() => {
                this.$bvToast.toast("Password Reset Successfully", {
                    title: "Success",
                    variant: "success",
                    delay: 300,
                });
                this.showExistingUserModal = false;
                this.resetUserValues();
                this.isLoading = false;
                this.handleGetAllUsers();
            }).catch((error) => {
                this.$bvToast.toast(error?.response?.data?.message, {
                    title: "Error",
                    variant: "danger",
                    delay: 300,
                });
                this.isLoading = false;
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>