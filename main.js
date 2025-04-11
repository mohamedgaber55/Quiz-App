let submitButton = document.querySelector('.submit-ans');
let count = document.querySelector('.count span');
let theBullets = document.querySelector('.bullets')
let bulletsContainer = document.querySelector('.bullets .spans');
let quizBox = document.querySelector('.quiz-box');
let answerArea = document.querySelector(".answers-area");
let results = document.querySelector(".results");
let countDownElement = document.querySelector('.conut-down')

let currentIndex = 0;
let rightAnswers = 0;

function getQuestions(){
    let myRequest = new XMLHttpRequest(); 

    myRequest.onreadystatechange = function(){

        if(myRequest.readyState === 4 && myRequest.status === 200){
            let questions = JSON.parse(myRequest.responseText);
            let questionsCount = questions.length;

            // create bullets and set questions count
            bullets(questionsCount);

            // get questions and answers
            getQuestionsAndAnswers(questions[currentIndex], questionsCount);
            
            // countDownFunction
            countDown(5, questionsCount);
            
            // click on submitButton
            submitButton.onclick = () => {
                let rightAnswer = questions[currentIndex].right_answer;

                currentIndex++;

                checkAnswers(rightAnswer, questionsCount);
                
                
                quizBox.innerHTML = '';
                answerArea.innerHTML = '';
                getQuestionsAndAnswers(questions[currentIndex], questionsCount);
                
                
                handleBullets();
                
                clearInterval(countdownInterval);
                countDown(5, questionsCount);

                showResults(questionsCount);

            } 
        }

    }

    myRequest.open("GET", "/html_questions.json");
    myRequest.send();
}

getQuestions();

function bullets(num){
    count.innerHTML = num;

    for(let i = 0; i < num; i++){
        // create bullet
        let bullet = document.createElement('span');

        // append bullet to bullets container
        bulletsContainer.appendChild(bullet);

        // check if it is the first bullet
        if(i === 0){
            bullet.className = 'done';
        }
    }
}

function handleBullets(){

    let allSpans = document.querySelectorAll(".bullets .spans span");
    let allSpansArray = Array.from(allSpans);

    allSpansArray.forEach((span , index) => {
        if(currentIndex === index){
            span.className = 'done'
        }
    })

}

function getQuestionsAndAnswers(obj, count){

    if(currentIndex < count){
    // *********** create h2 ***********
    let h2Title = document.createElement("h2");

    // create text into title 
    let quesText = document.createTextNode(obj["title"]);
    
    // append text into titlte 
    h2Title.appendChild(quesText);
    
    // append tittle to quizBox
    quizBox.appendChild(h2Title);
    
    // *********** end h2 ***********

    // *********** create answers ***********
    for(let i = 1; i <= 4; i++){
        let answersDiv = document.createElement('div');
        answersDiv.className = 'answer';
        
        // create input 
        let theInput = document.createElement('input');
        theInput.type = 'radio';
        theInput.name = 'question';
        theInput.id = `answer_${i}`;
        theInput.dataset.answer = obj[`answer_${i}`]

        if(i === 1){
            theInput.checked = true;
        }
        
        // create label
        let theInputLbel = document.createElement('label');
        theInputLbel.htmlFor = `answer_${i}`;
        
        // create label text 
        let labelText = document.createTextNode(obj[`answer_${i}`]);
        
        // append text to label 
        theInputLbel.appendChild(labelText);
        
        // append input and label into answer div 
        answersDiv.appendChild(theInput);
        answersDiv.appendChild(theInputLbel);
        
        // *********** end answers ***********
        
            // append answersDiv into answerArea
            answerArea.appendChild(answersDiv);
    }
}
}  

function checkAnswers(rAnswer, count){

    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for(let i = 0; i < answers.length; i++){

        if(answers[i].checked){
            theChoosenAnswer = answers[i].dataset.answer;
        }

    }

    if(rAnswer === theChoosenAnswer){
        rightAnswers++;
    }

}

function showResults(count){
    let theResults;
    if(currentIndex === count){
        quizBox.remove();
        answerArea.remove();
        submitButton.remove();
        theBullets.remove();

        if(rightAnswers > (count/2) && rightAnswers < count){
            theResults = `<span class ="Good">Good </span> You Answered ${rightAnswers} Right From ${count}`;
        }else if(rightAnswers === count){
            theResults = `<span class ="perfect">Perfect </span> All Questions You Answered Is Right`;
        }else{
            theResults = `<span class ="bad">Bad </span> You Answered ${rightAnswers} Right From ${count}`;
        }

        results.innerHTML = theResults;
        results.style.padding = "10px"
    }
}

function countDown(duration, count){
    if(currentIndex < count){
        let minutes, seconds;

        countdownInterval = setInterval(function(){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            
            countDownElement.innerHTML = `${minutes}:${seconds}`;

            if(--duration < 0){
                clearInterval(countdownInterval);
                submitButton.click();
            }
        }, 1000);
    }
}