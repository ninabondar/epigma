const express = require("express")

const app = express()
const PORT = 8000

app.use("/api", require("./api"))

const server = app.listen(PORT, () =>
  console.log(`Listening at http://localhost:${PORT}`)
)
