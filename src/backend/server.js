const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const PORT = 9000

app.use(bodyParser.json())
app.use(cors())

app.use("/api", require("./api"))

app.on("listening", () => {
  console.log("ok, server is running")
})

const server = app.listen(PORT, () =>
  console.log(`Listening at http://localhost:${PORT}`)
)
