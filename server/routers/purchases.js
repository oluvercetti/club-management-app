const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Purchases = require("../models/purchases");
const Admin = require("../models/admin");
const utils = require("../utils");

//Create purchase
router.post("/api/admin/purchases", auth, async (req, res) => {
    const purchasesData = req.body;

    try {
        await Admin.checkUserPermission(req.admin.role, utils.permission_levels.coordinator_only);
        const createdPurchases = [];

        // Iterate through each purchase in the array
        for (const purchaseData of purchasesData) {
            // Create a new Purchase instance and set the coordinator
            const newPurchase = new Purchases({
                ...purchaseData,
                coordinator: req.admin.username, // Assuming req.admin contains the admin data
            });

            // Save the purchase to the database
            const savedPurchase = await newPurchase.save();

            // Add the saved purchase to the array
            createdPurchases.push(savedPurchase);
        }
        res.status(200).send({ createdPurchases, message: "Transaction saved successfully" });

    } catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

//Get all purchases
router.get("/api/admin/purchases", auth, async (req, res) => {
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

module.exports = router;