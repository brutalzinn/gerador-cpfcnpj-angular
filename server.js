const express = require('express');
const app = express(),
    bodyParser = require("body-parser");
port = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(express.static(process.cwd() + "/dist/my-app/"));

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + "/dist/my-app/index.html")
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});