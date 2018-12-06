const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.status(200).json({
        ua:req.headers['user-agent'],
        ip : req.header('x-forwarded-for') || req.connection.remoteAddress,
    });
}); 

module.exports = app;