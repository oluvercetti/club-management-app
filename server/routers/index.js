
const adminRouter = require("./admin");
const feesRouter = require("./fees");
const rolesRouter = require("./roles");
const servicesRouter = require("./services");
const transactionsRouter = require("./transactions");

const allRouters = [adminRouter, feesRouter, rolesRouter, servicesRouter, transactionsRouter];

module.exports = allRouters;