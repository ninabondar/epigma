const express = require("express")
const mongoose = require("mongoose")
const fs = require("fs")

const app = express()
const PORT = 8000

const mongoDB = "mongodb://127.0.0.1/my_database"
mongoose.connect(mongoDB, { useNewUrlParser: true })
mongoose.Promise = global.Promise
// Получение подключения по умолчанию
const db = mongoose.connection

db.on("error", console.error.bind(console, "MongoDB connection error:"))

let documents = []

fs.readFile(__dirname + "/data.json", { encoding: "utf8" }, (err, data) => {
  if (err) throw err

  JSON.parse(data).forEach(item => {
    documents.push(item)
  })
})

app.get("/", (req, res) => {
  let buffer = ""

  documents.map(el => {
    buffer += '<a href="/edit/' + el.id + '">' + el.title + "</a> <br/>"
  })
  res.send(buffer)
})

app.get("/edit/:docId", (req, res) => {
  // take name out of query string
  let docId = req.params.docId
  res.send(docId)
})

const server = app.listen(PORT, () =>
  console.log(`Listening at http://localhost:${PORT}`)
)
