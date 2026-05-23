const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {

  const token = req.header("Authorization");

  if (!token) {

    return res.status(401).json({
      message: "No Token, Access Denied"
    });

  }

  try {

    const verified = jwt.verify(
      token,
      "secretkey"
    );

    req.user = verified;

    next();

  } catch (err) {

    res.status(400).json({
      message: "Invalid Token"
    });

  }

};

module.exports = auth;