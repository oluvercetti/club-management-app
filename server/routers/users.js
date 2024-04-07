const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Admin = require("../models/admin");


router.patch("/api/updateuser/:id", auth, async(req, res) => {

    try {
        await Admin.checkUserPermission(req.admin.role, permissions.admin);
        if(req.body.role){
            if(parseInt(req.admin.role) === 2 && parseInt(req.body.role) === 1){
                return res.status(400).send({ status: "error", message: "Admin can only update user to super admin" });
            }
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