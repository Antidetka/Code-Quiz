// variables to keep track of quiz state
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

// variables to get the elements from html
var questionsEl = document.getElementById("questions");
var timer = document.getElementById("time");
var choicesEl = document.getElementById("choices");
var submitBtn = document.getElementById("submit");
var startBtn = document.getElementById("start");
var initialsEl = document.getElementById("initials");
var feedbackEl = document.getElementById("feedback");



//function to start quiz
function Start() {
  var startScreen = document.getElementById("start-screen");
  startScreen.setAttribute("class", "hide");
  questionsEl.removeAttribute("class");
  timerId = setInterval(clockTick, 2000);
  timer.textContent = time;

  getQuestion();
}
//function for getting questions
function getQuestion() {
  var currentQuestion = questions[currentQuestionIndex];
  var titleEl = document.getElementById("question-title");
  titleEl.textContent = currentQuestion.title;
  choicesEl.innerHTML = "";

  // loop over choices
  currentQuestion.choices.forEach(function(choice, i) {
    var choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);

    choiceNode.textContent = i + 1 + ". " + choice;
    choiceNode.onclick = questionClick;
    choicesEl.appendChild(choiceNode);
  });
}
//function to check corret or wrong answer
function questionClick() {
  if (this.value !== questions[currentQuestionIndex].answer) {
    time -= 15;
    if (time < 0) {
      time = 0;
    }
    timer.textContent = time;
    feedbackEl.textContent = "Wrong!";
  } else {
    feedbackEl.textContent = "Correct!";
  }
  // flash right/wrong feedback on page 
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 1500);

  // move to next question
  currentQuestionIndex++;

  // check if we've run out of questions
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}
//function for end
function quizEnd() {
  clearInterval(timer);
  var endScreenEl = document.getElementById("end-screen");
  endScreenEl.removeAttribute("class");

  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;
  questionsEl.setAttribute("class", "hide");
}

function clockTick() {
  time--;
  timer.textContent = time;
  if (time <= 0) {
    quizEnd();
  }
}
//function to save the scores
function storeHighscore() {
  var initials = initialsEl.value.trim();
  if (initials !== "") {
    var highscores =
      JSON.parse(window.localStorage.getItem("highscores")) || [];
    var newScore = {
      score: time,
      initials: initials
    };

    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));

    window.location.href = "highscores.html";
  }
}

submitBtn.onclick = storeHighscore;
startBtn.onclick = Start;

initialsEl.onkeyup = checkForEnter;
