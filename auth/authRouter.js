const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets.js");

const dbConfig = require("../data/dbConfig");
const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
    const user = req.body;

    if(!(user.username && user.password && user.department)) {
        res.status(400).json({ message: "Missing required data: username, password, department" });
    } else {
        const hash = bcrypt.hashSync(user.password, 10);
        user.password = hash;

        Users.add(user)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(err => res.status(500).json({ message: "Error adding user to database" }));
    }
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;
  
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({
            message: `Welcome ${user.username}!, have a token...`,
            token,
          });
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });
  

router.get("/logout", async (req, res, next) => {
	try {
		req.session.destroy((err) => {
			if (err) {
				next(err)
			} else {
				res.status(204).end()
			}
		})
	} catch (err) {
		next(err)
	}
})

module.exports = router


function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
        department: user.department,
    };

    const options = {
        expiresIn: "1h",
    };

    return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router; 