const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Transactions = require("../models/transactions");

//Create transaction
router.post("/api/admin/transactions", auth, async (req, res) => {
    const transaction = new Transactions({
        ...req.body,
        owner: req.admin._id,
    });

    try {
        await transaction.save();
        res.status(200).send({ transaction, message: "transaction saved successfully" });

    } catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

//Get all transactions
router.get("/api/admin/transactions", auth, async(req, res) => {
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
        const transactions = await Transactions.find(match);

        res.status(200).send({ status: "Success", data: transactions });
    } catch (error) {
        return res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

//Get single transaction
router.get("/api/admin/transactions/:id", auth, async(req, res) => {
    
    try {
        const transaction = await Transactions.findOne({trans_id: req.body.trans_id});

        res.status(200).send({ status: "Success", data: transaction });
    } catch (error) {
        return res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

module.exports = router;