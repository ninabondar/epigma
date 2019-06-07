const express = require("express")
const fs = require("fs")
const MongoClient = require("mongodb").MongoClient

const app = express()
const PORT = 8000

const mongoDBURI = "mongodb://127.0.0.1"

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

MongoClient.connect(mongoDBURI, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    console.log("The following error occured when connecting to database: ")
    throw err
  }
  const db = client.db("epigma")
  console.log(db, "<== docs")
  client.close()
})

const server = app.listen(PORT, () =>
  console.log(`Listening at http://localhost:${PORT}`)
)
