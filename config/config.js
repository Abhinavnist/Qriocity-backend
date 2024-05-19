module.exports = {
  jwtSecret: process.env.JWT_SECRET || "jwtsecret",
  mongoURI: "mongodb://127.0.0.1:27017/meet",
}
