const mongoose = require("mongoose")
const documentSchema = require("./schemas/documents")

const databaseURI =
  "mongodb+srv://user:1234567890@epigma-ti4w5.mongodb.net/test"

mongoose.connect(databaseURI, { useNewUrlParser: true })
const db = mongoose.connection

db.on("error", err => {
  throw err
})

db.once("open", () => console.log("database connection established"))

module.exports = {
  db: db,
  Document: mongoose.model("Document", documentSchema)
}
