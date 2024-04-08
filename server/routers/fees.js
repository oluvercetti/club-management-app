const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Admin = require("../models/admin");
const Fees = require("../models/fees");
const utils = require("../utils");


//Create Fee
router.post("/api/fees", auth, async (req, res) => {
    const fees = new Fees(req.body);
    try {
        await Admin.checkUserPermission(req.admin.role, utils.permission_levels.admin);
        const isFeeTypeValid = utils.fee_types.includes(req.body.fee_type);
        if (!isFeeTypeValid) {
            throw new Error("Fee type can only be flat or percentage");
        }
        await fees.save();
        res.status(200).send({ fees });
    } catch (error) {
        if (error?.code === 11000) {
            res.status(400).send({
                status: "error",
                message: "Fee already exists",
            });
        } else {
            res.status(400).send({
                status: "error",
                message: error.message,
            } || "Error occurred");
        }
    }
});

// Get Fees
router.get("/api/fees", auth, async (req, res) => {

    try {
        const fees = await Fees.find();
        if(!fees) {
            return res.status(404).send({ status: "No Fees have been set" });
        }
        res.status(200).send({ status: "Success", data: fees });
    } catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
})

// Get Single Fee
router.get("/api/fees/:id", auth, async (req, res) => {

    try {
        const fee = await Fees.findOne({ _id: req.params.id });
        res.status(200).send({ status: "Success", data: fee });
    } catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
})

// Update single Fee
router.patch("/api/fees/:id", auth, async (req, res) => {

    try {

        await Admin.checkUserPermission(req.admin.role, utils.permission_levels.admin);
        // Check if the current time is between 10pm of yesterday and 6am of today
        const now = new Date();
        const todayTenPm = new Date(now);
        todayTenPm.setHours(22, 0, 0, 0);

        const todaySixAm = new Date(now);
        todaySixAm.setHours(6, 0, 0, 0);

        if (now >= todayTenPm && todaySixAm <= now) {
            throw new Error("Updates can not be made at this time");
        }
        const updates = Object.keys(req.body);
        const allowedUpdates = ["fee_name", "fee_value", "fee_type", "status"];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));
        if (!isValidOperation) {
            return res.status(400).send({ message: "Invalid operation" });
        }

        const isFeeTypeValid = utils.fee_types.includes(req.body.fee_type);
        if (!isFeeTypeValid && req.body.fee_type) {
            throw new Error("Fee type can only be flat or percentage");
        }
        const _id = req.params.id;
        const fee = await Fees.findOne({ _id });
        if (!fee) {
            return res.status(404).send({ message: "fee not found" });
        }
        updates.forEach((update) => {
            fee[update] = req.body[update];
        });

        await fee.save();
        res.send(fee);
    } catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

module.exports = router;