const server = require("../server");

const router = require("express").Router();

const users = require("./users-model");
const restricted = require("../auth/restricted");

router.get("/", restricted, (req, res) => {
    users.find()
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ message: "Error retrieving users"}))
});

module.exports = router;  
