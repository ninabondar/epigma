const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const PORT = 8000

app.use(bodyParser.json())
app.use(cors())

app.use("/api", require("./api"))

const server = app.listen(PORT, () =>
  console.log(`Listening at http://localhost:${PORT}`)
)
