const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Admin = require("../models/admin");


router.patch("/api/updateuser/:id", auth, async(req, res) => {

    try {
        if(req.admin.role !== 1){
            return res.status(400).send({ message: "You do not have permission" });
        }
        const updates = Object.keys(req.body);
        const allowedUpdates = ["name", "username", "role", "status"];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));
        if (!isValidOperation) {
            return res.status(400).send({ message: "Invalid operation" });
        }
        const user = await Admin.findOne({ _id:  req.params.id});
        if (!user) {
            return res.status(404).send({ message: "user not found" });
        }
        updates.forEach((update) => {
            user[update] = req.body[update];
        });
        await user.save();
        res.send(req.admin);
    }  catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});


module.exports = router;