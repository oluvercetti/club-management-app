const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Purchases = require("../models/purchases");
const Admin = require("../models/admin");
const utils = require("../utils");

//Create purchase
router.post("/api/admin/purchases", auth, async (req, res) => {
    const purchase = new Purchases({
        ...req.body,
        owner: req.admin._id,
    });

    try {
        await Admin.checkUserPermission(req.admin.role, utils.permission_levels.cashier_only);
        const isTransTypeValid = utils.trans_types.includes(req.body.trans_type);
        if (!isTransTypeValid) {
            throw new Error("Transaction type can only be purchase or purchase");
        }
        await purchase.save();
        res.status(200).send({ purchase, message: "Transaction saved successfully" });

    } catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

//Get all purchases
router.get("/api/admin/purchases", auth, async(req, res) => {
    const match = {};
    // const limit = parseInt(req.query.limit) || 3;
    // const page = req.query.page > 1 ? (parseInt(req.query.page) - 1) * limit : 0; // this is my implementation
    const sort = {};

    if (req.query.active) {
        match.active = req.query.active === "true";
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }
    try {
        const purchases = await Purchases.find(match);

        res.status(200).send({ status: "Success", data: purchases });
    } catch (error) {
        return res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

//Get single purchase
router.get("/api/admin/purchases/:id", auth, async(req, res) => {
    
    try {
        const purchase = await Purchases.findOne({trans_id: req.body.trans_id});

        res.status(200).send({ status: "Success", data: purchase });
    } catch (error) {
        return res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

module.exports = router;