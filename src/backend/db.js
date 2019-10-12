const mongoose = require("mongoose")

const {documentSchema} = require("./schemas")
const {DB_URL} = require("./config/config")

// Promise. Needs to await
mongoose.connect(DB_URL, { useNewUrlParser: true })
const db = mongoose.connection

db.on("error", err => {
  throw err
})

db.once("open", () => console.log("database connection established"))

module.exports = {
  db,
  Document: mongoose.model("Document", documentSchema)
}
