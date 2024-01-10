const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Services = require("../models/services");
const Admin = require("../models/admin");
const permissions = require("../utils").permission_levels;

//Create Service
router.post("/api/services", auth, async(req, res) => {
    const services = new Services(req.body);
    try {
        await Admin.checkUserPermission(req.admin.role, permissions.admin);
        await services.save();
        res.status(200).send({ services });
    } catch (error) {
        if (error?.code === 11000) {
            res.status(400).send({
                status: "error",
                message: "Service already exists",
            });
        } else {
            res.status(400).send({
                status: "error",
                message: error,
            } || "Error occurred");
        }
    }
});

// Get Services
router.get("api/services", auth, async (req, res) => {
    
    try {
        const services = await Services.find();
        res.status(200).send({ status: "Success", data: services });
    } catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
})

//Update service
router.patch("/api/services/:id", auth, async(req, res) => {

    await Admin.checkUserPermission(req.admin.role, permissions.admin);

    const updates = Object.keys(req.body);
    const allowedUpdates = ["status"];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid operation" });
    }

    const _id = req.params.id;
    try {
        const service = await Services.findOne({ _id });
        if (!service) {
            return res.status(404).send({ error: "service not found" });
        }
        updates.forEach((update) => {
            service[update] = req.body[update];
        });

        await service.save();
        res.send(service);
    } catch (err) {
        res.status(400).send({ error: "Error occurred" });
    }
});



module.exports = router;