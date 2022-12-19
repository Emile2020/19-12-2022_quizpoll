import express from 'express';
import path from 'path';
import fs from 'fs'
import bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.json());
const __dirname = path.resolve();
function init() {
    //start the pages
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/src/pages/index.html');
    });
    //start the css
    app.get('/index.css', (req, res) => {
        res.sendFile(__dirname + '/src/styles/index.css');
    });
    //start the js
    app.get('/index.js', (req, res) => {
        res.sendFile(__dirname + '/src/scripts/index.js');
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
    //start the server
    app.listen(80, () => {
        console.log('Server started on port 80');
    });
}

init()