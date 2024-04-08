const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Lodgements = require("../models/lodgements");
const Admin = require("../models/admin");
const utils = require("../utils");

//Create lodgement
router.post("/api/admin/lodgements", auth, async (req, res) => {
    const lodgement = new Lodgements({
        ...req.body,
        cashier: req.admin.username,
    });

    try {
        await Admin.checkUserPermission(req.admin.role, utils.permission_levels.cashier_only);
        await lodgement.save();
        res.status(200).send({ lodgement, message: "Transaction saved successfully" });

    } catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

//Get all lodgements
router.get("/api/admin/lodgements", auth, async(req, res) => {
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
    } else {
        sort.createdAt = -1;
    }

    try {
        const lodgements = await Lodgements.find(match).sort(sort);

        res.status(200).send({ status: "Success", data: lodgements });
    } catch (error) {
        return res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

//Get single lodgement
router.get("/api/admin/lodgements/:id", auth, async(req, res) => {
    
    try {
        const lodgement = await Lodgements.findOne({trans_id: req.params.id});

        res.status(200).send({ status: "Success", data: lodgement });
    } catch (error) {
        return res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

router.patch("/api/admin/lodgements/:id/void", auth, async(req, res) => {

    try {
        await Admin.checkUserPermission(req.admin.role, utils.permission_levels.admin);
        /* const updates = Object.keys(req.body);
        const allowedUpdates = ["status"];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));
        if (!isValidOperation) {
            return res.status(400).send({ message: "Invalid operation" });
        } */
        const transaction = await Lodgements.findOne({ trans_id:  req.params.id});
        if (!transaction) {
            return res.status(404).send({ message: "transaction not found" });
        }
        transaction.status = "Cancelled";
        transaction.voided_by = req.admin.username;
        // Update other fields if provided
        // Object.assign(transaction, updates);
        await transaction.save();
        res.send(transaction);
    }  catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

router.patch("/api/admin/lodgements/updatestatusbyforce", auth, async(req, res) => {
    try {
        await Admin.checkUserPermission(req.admin.role, utils.permission_levels.super_admin);
        
        // Find all transactions where status is undefined
        const transactions = await Lodgements.find({ status: { $exists: false } });
        
        // Update status to "Closed" and set voided_by
        const updates = transactions.map(transaction => {
            transaction.status = "Closed";
            return transaction.save();
        });

        // Wait for all updates to complete
        await Promise.all(updates);

        res.send(transactions);
    } catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});


module.exports = router;