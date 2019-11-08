const { Router } = require("express")

const apiRouts = new Router()

// binding routes
apiRouts.use("/", require("./routes/index"));

module.exports = apiRouts
