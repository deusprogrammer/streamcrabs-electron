const express = require('express');
const path = require('path');

const app = express();

const runImageServer = (port) => {
    app.use(express.json({limit: "50Mb"}))
    app.use("/media", express.static(path.join(__dirname, 'media')));
    app.use(express.static(path.join(__dirname, 'overlay')));
    app.get('*', (req,res) =>{
        res.sendFile(path.join(__dirname, 'overlay/index.html'));
    });
    app.listen(port);
}

module.exports = {
    runImageServer
};