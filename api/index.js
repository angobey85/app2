//REQUERIMIENTOS
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan"); 
const cors = require("cors");
const colors = require("colors");
require('dotenv').config();

//INTANCIAS
const app = express();

//EXPRESS CONFIG

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());

//RUTAS EXPRESS

app.use('/api', require('./routes/plants.js'));
app.use('/api', require('./routes/devices.js'));
app.use('/api', require('./routes/users.js'));
app.use('/api', require('./routes/variables.js'));
app.use('/api', require('./routes/templates.js'));
app.use('/api', require('./routes/equipments.js'));
app.use('/api', require('./routes/webhooks.js'));
app.use('/api', require('./routes/emqxapis.js'));
app.use('/api', require('./routes/alarms.js'));
app.use('/api', require('./routes/dataprovide.js'));

module.exports = app;

//LISTENER
app.listen(process.env.API_PORT, () =>{
    console.log("API Servidor escuchando en el puerto " + process.env.API_PORT);
});

if (process.env.environment != "dev") {
    
    const app2 = express();
    app2.listen(3002, function(){
        console.log("LISTENING ON PORT 3002");
    });

    app2.all('*', function(req,res){
        console.log("NO SSL ACCESS REDIRECTING");
        return res.redirect("https://" + req.headers["host"] + req.url);
    });
}

//MONGO CONEXION

const mongoUserName = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT;
const mongoDatabase = process.env.MONGO_DATABASE;

var uri = "mongodb://" + mongoUserName + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort + "/" + mongoDatabase;

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    authSource: "admin"
};



    mongoose.connect(uri, options).then(()=>{
        console.log("\n");
        console.log("*************************************".green);
        console.log("SE HA CONECTADO A MONGO CORRECTAMENTE".green);
        console.log("*************************************".green);
        console.log("\n");

        global.check_mqtt_superuser();
    },
    
        (err)=>{
            console.log("\n");
            console.log("******************************".red);
            console.log("HA FALLADO LA CONEXION A MONGO".red);
            console.log("******************************".red);
            console.log("\n");
        }
    
    
    
    );
    



