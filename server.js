const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const { readdirSync } = require('fs');
require('dotenv').config();

// app
const app = express();

// Database
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(() => console.log("DB CONNECTED"))
    .catch((error) => console.log("DB CONNECTION ERROR", error));

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());


// routes middleware
readdirSync("./routes").map((route) => app.use("/", require("./routes/" + route)));


// Port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port 8000`));