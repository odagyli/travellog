const express = require('express');
const cors = require('cors'); //when the clients aren't on the server
const app = express(); //server-app
const pg = require('pg');
const dbURI="postgres://pexmmwdyftxqmm:f8ff838ef3f9028287453919a7a4069cf36cda0afa467cf6573ef8eb99f67032@ec2-46-137-173-221.eu-west-1.compute.amazonaws.com:5432/d1fpt2lmsoq7v7" + "?ssl=true";
const connstring = process.env.DATABASE_URL || dbURI;
const pool = new pg.Pool({connectionString: connstring});
// middleware ------------------------------------
app.use(cors()); //allow all CORS requests
app.use(express.json()); //for extracting json in the request-body
app.use('/', express.static('client')); //for serving client files

// -----------------------------------------------

// endpoint GET ----------------------------------
app.get('/travels', async function (req, res) {
    
    let sql = "SELECT * FROM travels";

    try {
        let result = await pool.query(sql);
        res.status(200).json(result.rows); //send response  
    }
    catch(err) {
        res.status(500).json(err); //send response  
    }


});

// endpoint POST ---------------------------------
app.post('/travels', async function (req, res) {
    // code here... 
    let updata = req.body;

    let sql = 'INSERT INTO travels (id, destination, date, km, description, userid) VALUES(DEFAULT, $1, $2, $3, $4, $5) RETURNING *';
    let values = [updata.dest, updata.date, updata.km, updata.descr, updata.userid];

    try {
        let result = await pool.query(sql, values);

        if (result.rows.length > 0) {
            res.status(200).json({msg: "insert ok"}); //send response  
        }
        else {
            throw "Insert failed";
        }
    }

    catch(err){

        res.status(500).json({error: err}); //send error resposonse
    }
  
});

// start server -----------------------------------
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Server listening on port 3000!');
});

// endpoint - travels DELETE ----------------------------------
app.delete('/travels', async function (req, res) {

    let updata = req.body;

    let sql ='DELETE FROM travels WHERE id = $1 RETURNING *';
    let values = [updata.travelID];

    try {
        let result = await pool.query(sql, values);

        if (result.rows.length > 0) {
            res.status(200).json({msg: "Delete ok"}); //send response  
        }
        else {
            throw "Delete failed";
        }
    }

    catch(err){
        
        res.status(500).json({error: err}); //send error resposonse
    }
  
});

// endpoint - expenses POST -------------------------
app.post('/expenses', async function (req, res) {
    
    let update = req.body; //the data sent from the client

    let sql = 'INSERT INTO expenses (id, description, amount, travelid) VALUES(DEFAULT, $1, 2$, $3) RETURNING *';
    let values = [update.descr, updata.amount, updata.travelid];

    try {
        let result = await pool.query(sql, values);

        if (result.rows.length > 0 {
            res.status(200).jason({msg: "Insert OK"}); //send response
        }
        else {
            throw "Insert failed";
        }       
    }
    catch(err) {
        res.status(500).json({error: err}); //send error response
    }
});


// endpoint - expenses GET ----------------------
app.get('/expenses', async function (req, res){
    let travelid = req.query.travelid; //the data sent from the client

    let eql = 'SELECT * FROM expenses WHERE travelid = $1';
    let values = [travelid];

    try {
        let result = await pool.query(sql, values);
        res.status(200).json(result.rows); //send response
    }
    catch(err) {
        res.status(500).json({error: err}); //send error response
    }
});

