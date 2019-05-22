//create production server, run: node server/server.js in terminal
const path = require('path');
const express = require('express');
const favicon = require('express-favicon');
const app = express();//create an express application
const publicPath = path.join(__dirname, 'build');
const port = process.env.PORT || 3000;//port provided by heroku

app.use(favicon(__dirname + '/build/favicon.ico'));
app.use(express.static(__dirname));
app.use(express.static(publicPath));//tell the application to use the public directory to server up all the static assets

app.get('*', (req, res) => { //if the requested page is not in the public folder, give them back index.html file
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => { //tell the appp to start up on port provided by heroku or 3000 (works for local machine)
    console.log("Server is Up!");
});