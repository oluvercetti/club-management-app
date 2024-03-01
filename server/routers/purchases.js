const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Purchases = require("../models/purchases");
const Admin = require("../models/admin");
const Fees = require("../models/fees");
const utils = require("../utils");

//Create purchase
router.post("/api/admin/purchases", auth, async (req, res) => {
    const purchase = new Purchases({
        ...req.body,
        coordinator: req.admin.username,
    });

    try {
        await Admin.checkUserPermission(req.admin.role, utils.permission_levels.coordinator_only);
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
router.get("/api/admin/purchases", auth, async (req, res) => {
    // const limit = parseInt(req.query.limit) || 3;
    // const page = req.query.page > 1 ? (parseInt(req.query.page) - 1) * limit : 0; // this is my implementation
    const sort = {};
    const match = {};
    // Define start and end date parameters
    if(req.query.startDate && req.query.endDate) {
        const startDate = new Date(req.query.startDate); // You should validate and parse this input
        const endDate = new Date(req.query.endDate);     // You should validate and parse this input

        // Set hours for start date to 00:00 (midnight)
        startDate.setHours(0, 0, 0, 0);

        // Set hours for end date to 23:59 (just before midnight)
        endDate.setHours(23, 59, 59, 999); 

        // Construct query for records between startDate and endDate or 

        match.$or = [
            { createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) } },
            { status: 'Open' }
        ];
    }

    if(req.query.status) {
        match.status = req.query.status;
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    } else {
        sort.createdAt = -1;
    }
    try {
        const purchases = await Purchases.find(match).sort(sort);
        if(!purchases.length){
            res.status(404).send({ status: "Error", message: "No records found" });
        }
        res.status(200).send({ status: "Success", data: purchases });
    } catch (error) {
        return res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

//Get single purchase
router.get("/api/admin/purchases/:id", auth, async (req, res) => {

    try {
        const purchase = await Purchases.findOne({ trans_id: req.params.id });

        res.status(200).send({ status: "Success", data: purchase });
    } catch (error) {
        return res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

//Update single purchase status
router.patch("/api/admin/purchases/:id", auth, async(req, res) => {

    try {
        await Admin.checkUserPermission(req.admin.role, utils.permission_levels.cashier_only);
        const updates = req.body;
        const allowedUpdates = ["amount_sold", "amount_returned"];
        const isValidOperation =  Object.keys(updates).every(update => allowedUpdates.includes(update));
        if (!isValidOperation) {
            return res.status(400).send({ message: "Invalid operation" });
        }
        const purchase = await Purchases.findOne({ trans_id:  req.params.id});
        if (!purchase) {
            return res.status(404).send({ message: "purchase not found" });
        }

        // Apply service charge calculation
        const fees = await Fees.findOne({fee_name: 'purchase_service_charge'}); // Assuming Fees table has a single row

        if (!fees) {
            return res.status(400).send({ status: "error occurred", message: "Service charge has not been set" });
        }
        const serviceChargePercentage = parseFloat(fees.fee_value)/100; // Assuming the field is named 'service_charge_percentage'
        const service_charge_amount = parseFloat(req.body.amount_sold) * parseFloat(serviceChargePercentage);
        purchase.service_charge_amount = parseFloat(service_charge_amount);
        purchase.status = "Closed";
        purchase.cashier = req.admin.username;
        // Update other fields if provided
        Object.assign(purchase, updates);
        await purchase.save();
        res.status(200).send({ status: "Success", data: purchase });
    }  catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

module.exports = router;