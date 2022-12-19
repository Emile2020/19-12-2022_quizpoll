//vanilla javascript
/* index.json: {
    "results": {
        "Q1": {
            "21": 293,
            "20": 900,
            "19": 29
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
        }
    ]
}*/
function submitquestion(questione) {
    var questionid = "Q" + questione;
    //get the selected radio button
    var radios = document.getElementsByName(questionid);
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            var selectedvalue = radios[i].value;
        }
    }
    console.log(selectedvalue)
    //get from index.json the results
    var request = new XMLHttpRequest();
    request.open('GET', '/index.json', true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);
            console.log(data);
            var question = data.results[questionid];
            console.log(data.results)
            console.log(questionid)
            console.log(question)
            //check for each answer how many people selected it and the percentage
            //convert question to array
            var questionarray = Object.entries(question);
            console.log(questionarray)
            //loop through the array
            var total = 0;
            for (var i = 0; i < questionarray.length; i++) {
                total += questionarray[i][1];
            }
            console.log(total);
            var percentageobject = {};
            for (var i = 0; i < questionarray.length; i++) {
                let idsfdh = "A" + questione + i;
                percentageobject[idsfdh] = (questionarray[i][1] / total) * 100;
            }
            console.log(percentageobject);
            //lock the radio buttons
            for (var i = 0; i < radios.length; i++) {
                radios[i].disabled = true;
            }
            //round the percentage to 2 decimals
            for (var i = 0; i < questionarray.length; i++) {
                let id = "A" + questione + i;
                percentageobject[id] = percentageobject[id].toFixed(2);
            }
            //create a progress bar for each answer with the percentage and add it to the page
            for (var i = 0; i < questionarray.length; i++) {
                let id = "A" + questione + i;
                console.log(id)
                //if the answer is the selected one
                if (radios[i].value == selectedvalue) {

                var progressbar = `${percentageobject[id]}%  <br> <progress style="color:green" value="${percentageobject[id]}" max="100"></progress>`;
                } else {
                    var progressbar = `${percentageobject[id]}%  <br> <progress value="${percentageobject[id]}" max="100"></progress>`;
                }
                let answer = document.getElementById(id);
                //lock submit button
                document.getElementById('submit_' + questione).disabled = true;
                answer.innerHTML = progressbar;
                
            }
        } else {
            // We reached our target server, but it returned an error
            console.log('error');
        }

    }
    request.onerror = function () {
        // There was a connection error of some sort
    }
    request.send();
    //send to /submit a post request with selectedvalue and questionid
    var request_sub = new XMLHttpRequest();
    request_sub.open('POST', '/submit', true);
    request_sub.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request_sub.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);
            console.log(data);
        } else {
            // We reached our target server, but it returned an error
            console.log('error');
        }
    }
    request_sub.onerror = function () {
        // There was a connection error of some sort
    }
    var data = JSON.stringify({ questionid: questionid, selectedvalue: selectedvalue });
    request_sub.send(data);
}
//vanilla js
//get /index.json and parse it
var request = new XMLHttpRequest();
request.open('GET', '/index.json', true);
request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
        document.getElementById('title').innerHTML = data.title;
    } else {
        // We reached our target server, but it returned an error
        console.log('error');
    }
}
request.send();
function loadsite() {
    //load from index.json the questions and answers
    var request = new XMLHttpRequest();
    request.open('GET', '/index.json', true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);
            var questions = data.questions;
            var questionhtml = "";
            for (var i = 0; i < questions.length; i++) {
                var ii = i
                var question = questions[i];
                var answers = question.answers;
                var questionid = "Q" + i;
                questionhtml += `<h2>${question.question} <span class="required">*</span></h2>\n`;
                for (var j = 0; j < answers.length; j++) {
                    var answer = answers[j];
                    var answerid = "A" + j;
                    questionhtml += `<input type="radio" name="${questionid}" value="${answer}" id="Q${ii}_${answer}"><label for="Q${ii}_${answer}">${answer}</label><span id="A${i}${j}" class="A"></span><br>\n`;
                    
                }
                questionhtml += `<button onclick="submitquestion(${ii})" id="submit_${i}">Submit</button><br><br>\n`;
                console.log(questionhtml)
            }
            document.getElementById('questions').innerHTML = questionhtml;
        } else {
            // We reached our target server, but it returned an error
            console.log('error');
        }
    }
    request.onerror = function () {
        // There was a connection error of some sort
    }
    request.send();
}
loadsite();