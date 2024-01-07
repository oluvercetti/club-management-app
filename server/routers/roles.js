const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Roles = require("../models/roles");

//Create Roles
router.post("/api/role/create", auth, async(req, res) => {
    const roles = new Roles(req.body);
    try {
        await roles.save();
        res.status(200).send({ roles });
    } catch (error) {
        if (error?.code === 11000) {
            res.status(400).send({
                status: "error",
                message: "Role already exists",
            });
        } else {
            res.status(400).send({
                status: "error",
                message: error,
            } || "Error occurred");
        }
    }
});

//



module.exports = router;