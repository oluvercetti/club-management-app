
const adminRouter = require("./admin");
const feesRouter = require("./fees");
const rolesRouter = require("./roles");
const servicesRouter = require("./services");
const lodgementsRouter = require("./lodgements");
const purchasesRouter = require("./purchases");

const allRouters = [adminRouter, feesRouter, rolesRouter, servicesRouter, lodgementsRouter, purchasesRouter];

module.exports = allRouters;