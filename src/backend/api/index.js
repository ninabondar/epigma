const { Router } = require("express")

const apiRouts = new Router()

// binding routes
apiRouts.use("/documents", require("./documents"))

module.exports = apiRouts
