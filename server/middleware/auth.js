const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const auth = async(req, res, next) => {
    try {
        const token = req.header("sf-auth");
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        const admin = await Admin.findOne({ _id: decoded._id, "token": token });

        if (!admin) {
            throw new Error("User is not authenticated");
        }
        req.token = token;
        req.admin = admin;
        res.cookie('sftoken', JSON.stringify(token), { path: "/", secure: true, httpOnly: true });
        next();
    } catch (e) {
        res.status(401).send({ message: "Invalid token" });
    }
};

module.exports = auth;