import express from 'express';
import path from 'path';
import fs from 'fs'
import bodyParser from 'body-parser';
import nodemail from 'nodemailer';
import rateLimit from 'express-rate-limit'
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use(limiter)
const __dirname = path.resolve();
//get data from ./src/json/index.json
var data = JSON.parse(fs.readFileSync(__dirname + '/src/json/index.json', 'utf8'));
//init email
var transporter = nodemail.createTransport({
    service: 'gmail',
    auth: {
        user: data.email,
        pass: data['app-password']
    }
});

const app = express();
app.use(bodyParser.json());
function init() {
    //start the pages
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/src/pages/index.html');
    });
    app.get('/admin', (req, res) => {
        res.sendFile(__dirname + '/src/pages/admin.html');
    });
    //start the css
    app.get('/index.css', (req, res) => {
        res.sendFile(__dirname + '/src/styles/index.css');
    });
    app.get('/admin.css', (req, res) => {
        res.sendFile(__dirname + '/src/styles/admin.css');
    });
    //start the js
    app.get('/index.js', (req, res) => {
        res.sendFile(__dirname + '/src/scripts/index.js');
    });
    app.get('/admin.js', (req, res) => {
        res.sendFile(__dirname + '/src/scripts/admin.js');
    });
    //start the json
    app.get('/index.json', (req, res) => {
        res.sendFile(__dirname + '/src/json/index.json');
    });
    //start the post request
    app.post('/submit', (req, res) => {
        console.log(req)
        //check if request body contains: questionid, selectedvalue
        if (req.body.questionid != undefined && req.body.selectedvalue != undefined) {
            //get index.json and parse it
            fs.readFile(__dirname + '/src/json/index.json', 'utf8', (err, data) => {
                if (err) {
                    console.error(err)
                    return
                }
                //parse the json
                var data = JSON.parse(data);
                console.log(req.body)
                //get the question
                var question = data.results[req.body.questionid];
                //check if the selected value is in the question
                if (question[req.body.selectedvalue]) {
                    //increase the selected value
                    question[req.body.selectedvalue]++;
                    //write the new json
                    fs.writeFile(__dirname + '/src/json/index.json', JSON.stringify(data), (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                        //send the response 
                        res.send('success');
                    })
                } else {
                    //send the response
                    res.send('error');
                }
            })
        } else {
            //send the response
            res.send('invalid request');
            res.statusCode = 400;
        }
    })
    app.post('/validatecookie', (req, res) => {
        //check if the cookie is valid
        if (data.valid_tokens.includes(req.body.token)) {
            //send the response
            res.send('valid');
        } else {
            //send the response
            res.send('invalid');
        }
    })
    app.post('/admin/api', (req, res) => {
        if (req.body.password && req.body.email && req.body.newjson) {
            if (req.body.password == data['app-password'] && req.body.email == data.email) {
                fs.writeFile(__dirname + '/src/json/index.json', req.body.newjson, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                    //send an email with the new json and old json
                    if (data.email_send) {
                        transporter.sendMail({
                            from: data.email,
                            to: data.email,
                            subject: 'New json',
                            text: 'New json: ' + req.body.newjson + '\nOld json: ' + data
                        }, (err, info) => {
                            if (err) {
                                console.error(err)
                                return
                            }
                            console.log(info)
                        })
                    }
                    //send the response 
                    res.send('success');
                })
            } else {
                res.send('invalid credentials');
            }
        }
    })
    //start the server
    app.listen(80, () => {
        console.log('Server started on port 80');
    });
}

init()