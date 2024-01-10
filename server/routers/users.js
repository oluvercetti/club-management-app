const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Admin = require("../models/admin");


router.post("/api/updateuser", auth, async(req, res) => {

    try {
        if(req.admin.role !== 1){
            return res.status(400).send({ error: "You do not have permission" });
        }
        const user = await Admin.findOne({ _id: req.body.user_id});
        user.status = !user.status;
        await user.save();
        res.send(req.admin);
    } catch (err) {
        res.status(400).send({ error: "Error occurred", err });
    }
});


module.exports = router;