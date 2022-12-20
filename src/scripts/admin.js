//vanilla js
/* json: {
    "results": {
        "Q0": {
            "18": 5,
            "19": 30,
            "20": 900,
            "21": 293
        },
        "Q1": {
            "chicken": 10,
            "egg": 2
        }
    },
    "title": "Pollsite",
    "questions": [
        {
            "question": "What is 9+10?",
            "answers": [
                "21",
                "20",
                "19",
                "18"
            ]
        },
        {
            "question": "What came firt, the chicken or the egg?",
            "answers": [
                "chicken",
                "egg"
            ]
        }
    ],
    "email": "emidblol@gmail.com",
    "app-password": "1234567890",
    "valid_tokens": [
        "1234567890"
    ],
    "email_send": true
}*/
var body = `
<div class="questions">
</div>
<input type="submit" value="submit" onclick="submit()">Change settings</input>
`

function getJSON() {
    //get index.json using the api and then parse it
    var request = new XMLHttpRequest();
    request.open('GET', '/index.json', false);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            console.log(request.response)
        } else {
            // We reached our target server, but it returned an error
            console.log('error')
        }
    };
    request.onerror = function () {
        // There was a connection error of some sort
    }
    request.send();
    //return the parsed json
    return JSON.parse(request.response);
}
var globaldata = getJSON();
//check if cookies are present
if (document.cookie['token'] != undefined) {
    var valid_tokens = getJSON().valid_tokens;
    //check if the cookie is valid
    if (valid_tokens.includes(req.cookies['token'])) {
        document.getElementById("body").innerHTML = `
        <div><h1>Admin</h1></div>
        `
    } else {
        var email = prompt('Enter email');
        var password = prompt('Enter password');
        console.log(password)
        var json = getJSON();
        //check if the email and password are correct
        if (json.email == email && json['app-password'] == password) {
            //generate a random token
            var token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            //add the token to the valid tokens
            json.valid_tokens.push(token);
            document.cookie = `token=${token}; samesite=strict; path=/; max-age=31536000;`;
            //write the new json using the api
            fetch('/admin/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    newjson: JSON.stringify(json)
                })
            }).then(res => {
                if (res.status == 200) {
                    document.html.body.innerHTML = `
                    <div><h1>Admin</h1></div>
                    `
                } else {
                    document.html.body.innerHTML = `
                    <div><h1>failure</h1></div>
                    `
                }
            })
        } else {
            alert('fuck you, just kidding, wrong email or password')
        }
    }
} else {
    var email = prompt('Enter email');
    var password = prompt('Enter password');
    var json = getJSON();
    //check if the email and password are correct
    if (json.email == email && json['app-password'] == password) {
        //generate a random token
        var token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        //add the token to the valid tokens
        json.valid_tokens.push(token);
        //write the new json using the api
        fetch('/admin/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                newjson: JSON.stringify(json)
            })
        }).then(res => {
            if (res.status == 200) {
                document.getElementById("body").innerHTML = `
                <div><h1>Admin</h1></div>
                `
            } else {
                document.getElementById("body").innerHTML = `
                <div><h1>failure</h1></div>
                `
            }
        })
    } else {
        if (!json.familysite) {
            alert('fuck you, just kidding, wrong email or password')
        } else {
            alert('wrong email or password')
        }
        window.location.href = '/';
    }
}
function loadquestions() {
    var data = getJSON();
    var questions = data.questions;
    var results = data.results;
    var questionsdiv = document.getElementsByClassName('questions')[0];
    var examplehtml = `<input type="text" id="Q0" placeholder="question" value="question"></input><label for="Q0">Question</label>
    <div class="answers">
        <input type="text" id="Q0A0" placeholder="answer" value="answer"></input><label for="Q0A0">Answer</label>
        <input type="text" id="Q0A1" placeholder="answer" value="answer"></input><label for="Q0A1">Answer</label>
        <button onclick="addanswer('Q0')">Add answer</button>`
    for (var i = 0; i < questions.length; i++) {
        var question = questions[i];
        var questionhtml = examplehtml.replace(/Q0/g, 'Q' + i);
        for (var j = 0; j < question.answers.length; j++) {
            var answer = question.answers[j];
            questionhtml = questionhtml.replace(/Q0A0/g, 'Q' + i + 'A' + j);
        }
        questionsdiv.innerHTML += questionhtml;

    }
    questionsdiv.innerHTML += `<button onclick="addquestion()">Add question</button>`
    //add the new questions to globaldata
    globaldata.questions = questions;
}
loadquestions();
function addquestion() {
    var questionsdiv = document.getElementById('body');
    var examplehtml = `<input type="text" id="Q0" placeholder="question" value="question"></input><label for="Q0">Question</label>
    <div class="answers">
        <input type="text" id="Q0A0" placeholder="answer" value="answer"></input><label for="Q0A0">Answer</label>
        <input type="text" id="Q0A1" placeholder="answer" value="answer"></input><label for="Q0A1">Answer</label>
        <button onclick="addanswer('Q0')">Add answer</button>`
        var questioncount = questionsdiv.getElementsByClassName('answers').length;
    var questionhtml = examplehtml.replace(/Q0/g, 'Q' + questionsdiv.getElementsByClassName('answers').length);
    questionsdiv.innerHTML += questionhtml;
    //add the new question to globaldata
    globaldata.questions.push({
        answers: ['answer', 'answer']
    });
}
function addanswer(questionid) {
    var question = document.getElementById(questionid);
    var answers = question.getElementsByClassName('answers')[0];
    var answerhtml = `<input type="text" id="Q0A0" placeholder="answer" value="answer"></input><label for="Q0A0">Answer</label>`
    answerhtml = answerhtml.replace(/Q0A0/g, questionid + 'A' + answers.getElementsByTagName('input').length);
    answers.innerHTML += answerhtml;
    //add the new answer to globaldata
    globaldata.questions[questionid.replace('Q', '')].answers.push('answer');
}
function submit() {
    //change the json to newjson using the api
    fetch('/admin/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password,
            newjson: JSON.stringify(globaldata)
        })
    }).then(res => {
        if (res.status == 200) {
            alert('success')
        } else {
            alert('failure')
        }
    })
}