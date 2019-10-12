const mongoose = require("mongoose")
const documentSchema = require("./schemas/documents")

const databaseURI = process.env.MONGO_URL 

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
