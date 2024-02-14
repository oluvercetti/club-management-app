const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const Admin = require("../models/admin");
const Roles = require("../models/roles");
const Purchases = require("../models/purchases");
const Lodgements = require("../models/lodgements");
const auth = require("../middleware/auth");
const router = new express.Router();
const bcrypt = require("bcrypt");
const permissions = require("../utils").permission_levels;
const sendToPrinter = require("../printer");

// POST /admin

router.post("/api/admin", auth, async (req, res) => {
    const admin = new Admin(req.body);
    try {

        await Admin.checkUserPermission(req.admin.role, permissions.super_admin);

        const role = await Roles.findOne({ role_id: req.body.role });
        if (!role) {
            return res.status(400).send({ status: "error", message: "Role does not exist" });
        }
        await admin.generateAuthToken();
        await admin.save();
        res.status(200).send({ admin });
    } catch (error) {
        if (error?.code === 11000) {
            res.status(400).send({
                status: "error",
                message: "Username already exists",
            });
        } else if (error?.name === "ValidationError") {
            if (error?.errors?.password?.kind === "minlength") {
                res.status(400).send({
                    status: "error",
                    message: "Password should be minimum 7 characters long",
                });
            } else {
                res.status(400).send({ message: error?.message });
            }
        } else {
            res.status(400).send({
                status: "error",
                message: error?.message,
            } || "Error occurred");
        }
    }
});

router.post("/api/admin/login", async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.username, req.body.password);
        const token = await admin.generateAuthToken();
        res.status(200).send({ status: "Success", data: admin, token });
    } catch (e) {
        res.status(400).send({
            status: "error",
            message: e.message,
        } || "Error occurred");
    }
});

router.post("/admin/logout", auth, async (req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.admin.save();

        res.status(200).send({ message: "Logout Successful" });
    } catch (e) {
        res.status(400).send({
            status: "error",
            message: e.message,
        } || "Error occurred");
    }
});

router.post("/api/admin/logoutAll", auth, async (req, res) => {
    try {
        req.admin.tokens = [];
        await req.admin.save();

        res.status(200).send({ message: "Logout Successful" });
    } catch (e) {
        res.status(400).send({
            status: "error",
            message: e.message,
        } || "Error occurred");
    }
});

const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|PNG)$/)) {
            return cb(new Error("Please upload a valid image"));
        }

        cb(null, true);
    },
});

router.post("/api/admin/me/avatar", auth, upload.single("avatar"), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.admin.avatar = buffer;
    await req.admin.save();
    res.send("Uploaded successfully");
}, (error, req, res, next) => {
    res.status(400).send({ message: error.message });
});

router.get("/api/admin/me/avatar", auth, (req, res) => {
    try {
        if (!req.admin.avatar) {
            throw new Error("Avatar not available");
        }

        res.set("Content-Type", "image/png");
        res.send(req.admin.avatar);
    } catch (e) {
        res.status(404).send({ message: "Avatar not found" });
    }
});

//GET /admin/
router.get('/api/admin/me', auth, async (req, res) => {
    try {
        const admin = await Admin.findOne({ username: req.admin.username })
        res.status(200).send({ status: "Success", data: admin })
    } catch (e) {
        res.status(400).send({
            status: "error",
            message: e.message,
        } || "Error occurred");
    }
})

router.patch("/api/admin/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name"];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ message: "Invalid operation" });
    }

    try {
        updates.forEach((update) => {
            req.admin[update] = req.body[update];
        });

        await req.admin.save();
        res.send(req.admin);
    }  catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

router.delete("/api/admin/me", auth, async (req, res) => {
    // const email = req.admin.email;
    // const name = req.admin.name;
    try {
        await req.admin.remove();
        // sendCancellationMessage(email, name)
        res.send({ message: "Deleted Successfully" });
    } catch (e) {
        res.status(500).send();
    }
});

router.delete("/api/admin/me/avatar", auth, async (req, res) => {
    req.admin.avatar = undefined;
    try {
        await req.admin.save();
        res.send({ message: "Deleted Successfully" });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.patch("/api/admin/changepassword", auth, async (req, res) => {

    try {
        const isMatch = await bcrypt.compare(req.body.password, req.admin.password);

        if (!isMatch) {
            return res.status(400).send({ message: "Incorrect Password" });
        }

        const isSameasOldPassword = await bcrypt.compare(req.body.new_password, req.admin.password);

        if (isSameasOldPassword) {
            return res.status(400).send({ message: "New password can not be same as new" });
        }
        req.admin.password = req.body.new_password;
        await req.admin.save();
        res.send(req.admin);
    } catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
});

router.get("/api/admin/users", auth, async (req, res) => {

    const role = req.query?.role;
    try {
        // Parse role parameter to integer
        if(role){
            const users = await Admin.find({ role });
            res.status(200).send({ status: "Success", data: users });
        } else {
            const users = await Admin.find();
            res.status(200).send({ status: "Success", data: users });
        }
        // await Admin.checkUserPermission(req.admin.role, permissions.admin);
    } catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
})

router.get("/api/admin/users/:id", auth, async (req, res) => {

    try {
        await Admin.checkUserPermission(req.admin.role, permissions.admin);
        const user = await Admin.findOne({ _id: req.params.id });
        res.status(200).send({ status: "Success", data: user });
    } catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
})

//Get all purchases and lodgements
router.get("/api/admin/transactions", auth, async (req, res) => {

    try {
        await Admin.checkUserPermission(req.admin.role, permissions.admin);
        let purchasesQuery = null;
        let lodgementsQuery = null;
        const sort = {};
        // Define start and end date parameters
        if(req.query.startDate && req.query.endDate) {
            const startDate = new Date(req.query.startDate); // You should validate and parse this input
            const endDate = new Date(req.query.endDate);
            // Set hours for start date to 00:00 (midnight)
            startDate.setHours(0, 0, 0, 0);

            // Set hours for end date to 23:59 (just before midnight)
            endDate.setHours(23, 59, 59, 999); 

        // Construct query for records between startDate and endDate
        purchasesQuery = { createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) } };
        lodgementsQuery = { createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) } };
        }

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(":");
            sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
        } else {
            sort.createdAt = -1;
        }

        // Fetch records based on the query
        const purchases = await Purchases.find(purchasesQuery).sort(sort);
        const lodgements = await Lodgements.find(lodgementsQuery).sort(sort);
        if(!purchases.length && !lodgements.length){
            res.status(404).send({ status: "Error", message: "No records found for the selected period"});
        } else {
            res.status(200).send({ status: "Success", data: { purchases, lodgements } });
        }
    } catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
})

//Get all purchases and lodgements
router.get("/api/admin/endofdayreport", auth, async (req, res) => {

    try {
        await Admin.checkUserPermission(req.admin.role, permissions.admin);

        let now = new Date();
        if(req.query.reportDate){
            now = new Date(req.query.reportDate)
        }

        // Calculate start and end dates for yesterday 10pm to today 6am
        const yesterdayTenPM = new Date(now);
        yesterdayTenPM.setDate(now.getDate() - 1);
        yesterdayTenPM.setHours(22, 0, 0, 0);

        const todaySixAM = new Date(now);
        todaySixAM.setHours(6, 0, 0, 0);
        const lodgementsReport = await Lodgements.aggregate([
            {
                $match: {
                    createdAt: { $gte: yesterdayTenPM, $lt: todaySixAM },
                    username: { $exists: true, $ne: null },
                },
            },
            {
                $group: {
                    _id: "$username",
                    totalAmount: { $sum: "$amount" },
                },
            },
        ]);

        const purchasesReport = await Purchases.aggregate([
            {
                $match: {
                    createdAt: { $gte: yesterdayTenPM, $lt: todaySixAM },
                    coordinator: { $exists: true, $ne: null },
                },
            },
            {
                $group: {
                    _id: "$coordinator",
                    totalAmount: { $sum: "$amount" },
                },
            },
        ]);

        if (!lodgementsReport.length && !purchasesReport.length) {
            return res.status(404).send({ status: "Error", message: "No report found for the selected day" });
        } 
        res.status(200).send({ status: "Success", data: { lodgementsReport, purchasesReport } });
        
    } catch (error) {
        res.status(400).send({
            status: "error occurred",
            message: error.message,
        } || "Error occurred");
    }
})

router.post("/api/admin/print", async (req, res) => {

    try {
        sendToPrinter(req.body.content)
        res.status(200).send({ message: "Success" });

    } catch (error) {
        res.status(400).send({
            status: "error",
            message: error?.message,
        } || "Error occurred");
    }
})
//To be deleted when going live
router.post("/api/admin/over15", async (req, res) => {
    const admin = new Admin(req.body);
    try {

        const role = await Roles.findOne({ role_id: req.body.role });
        if (!role) {
            return res.status(400).send({ status: "error", message: "Role does not exist" });
        }
        await admin.generateAuthToken();
        await admin.save();
        res.status(200).send({ admin });
    } catch (error) {
        if (error?.code === 11000) {
            res.status(400).send({
                status: "error",
                message: "Username already exists",
            });
        } else if (error?.name === "ValidationError") {
            if (error?.errors?.password?.kind === "minlength") {
                res.status(400).send({
                    status: "error",
                    message: "Password should be minimum 7 characters long",
                });
            } else {
                res.status(400).send({ message: error?.message });
            }
        } else {
            res.status(400).send({
                status: "error",
                message: error?.message,
            } || "Error occurred");
        }
    }
});
module.exports = router;