
const permission_levels = {
    super_admin: [1],
    admin: [1,2],
    cashier_only: [3],
}

const fee_types = ["flat", "percentage"]

const trans_types = ["lodgement", "purchase"]

const wallet_types = ["user", "admin"]

module.exports = {
    permission_levels,
    fee_types,
    trans_types,
    wallet_types,
};

//Updated this for render error