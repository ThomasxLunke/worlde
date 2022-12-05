let actualLetter = "letter-0";
let indexActualLetter = 0
let currentWord = ""
const NBR_ESSAI= 6
const NBR_LETTRE= 5

const wordURL = "https://words.dev-apis.com/word-of-the-day"
const validWordURL = "https://words.dev-apis.com/validate-word"
let wordOfTheDay =""
fetchWordOfTheDay().then(function(response){
    wordOfTheDay = response
})

async function fetchWordOfTheDay(){
    const promise = await fetch(wordURL);
    const processedResponse = await promise.json()
    return processedResponse.word.toUpperCase()
}

document.addEventListener("keydown", function handleKeyPress(event) {
    const action = event.key;
    if (action === "Enter") {
      commit();
    } else if (action === "Backspace") {
      backspace();
    } else if (isLetter(action)) {
      addLetter(action.toUpperCase());
    } else {
      // do nothing
    }
});
 
function isLetter(value) {
    return (/^[a-zA-Z]$/).test(value)
}

function addLetter(letter) {
    if (currentWord.length === NBR_LETTRE ) return
    indexActualLetter++;
    document.getElementById(`${actualLetter}`).textContent = letter;
    actualLetter = actualLetter.substring(0,7) + indexActualLetter
    currentWord = currentWord + letter
}   

function commit() {
    if (currentWord.length !== NBR_LETTRE) 
        return
    else {
        if(isWin()) {
            checkWord()
            return alert("you wiiiin")
        }
        else {
            let isCorrect 
            isCorrectWord().then(function(response){
                if(response === true) {
                    checkWord()
                    isCorrect = response
                    actualLetter = actualLetter.substring(0,7) + indexActualLetter
                    currentWord = "" 
                }
                else
                {
                    let lettreCompareCompteur =  indexActualLetter - (NBR_LETTRE)
                    for (let i=0; i<NBR_LETTRE;i++)
                    {
                        document.getElementById(`${actualLetter.substring(0,7) + lettreCompareCompteur}`).classList.add("invalid")
                        lettreCompareCompteur++ 
                    }
                    lettreCompareCompteur =  indexActualLetter - (NBR_LETTRE)
                    setTimeout( () => {
                    for (let i=0; i<NBR_LETTRE;i++)
                    {
                        document.getElementById(`${actualLetter.substring(0,7) + lettreCompareCompteur}`).classList.remove("invalid")
                        lettreCompareCompteur++ 
                    }},300)
                }
            });

            setTimeout(
                () => {
                    if(isLost() && isCorrect === true)
                    {
                        alert("you lost, the word was : " + wordOfTheDay)
                    }
                }, 600
            ) 
        }       
    }
}

function backspace(){
   if (currentWord === "") return
   currentWord = currentWord.substring(0, currentWord.length - 1);
   indexActualLetter--;
   actualLetter = actualLetter.substring(0,7) + indexActualLetter
   document.getElementById(`${actualLetter}`).textContent = "";
}

function isWin(){
    return currentWord === wordOfTheDay;
}

function isLost(){
    return indexActualLetter === NBR_ESSAI * NBR_LETTRE && isCorrectWord()
}

async function isCorrectWord(){
    const promise = await fetch(validWordURL, {
        method: "POST",
        body: JSON.stringify({"word": currentWord})
    });
    const processedResponse = await promise.json()
    return processedResponse.validWord
}

function checkWord()
{
    const wordOfTheDayArray = wordOfTheDay.split('')
    const currentWordArray = currentWord.split('')
    let lettreCompareCompteur =  indexActualLetter - (NBR_LETTRE)
    checkGoodPosition(wordOfTheDayArray, currentWordArray)
    checkGoodLetter(wordOfTheDayArray, currentWordArray) 
}

function checkGoodPosition(wordOfTheDayArray, currentWordArray)
{
    let lettreCompareCompteur =  indexActualLetter - (NBR_LETTRE)
    for (let i=0; i<NBR_LETTRE;i++)
    {
        if (wordOfTheDayArray[i] === currentWordArray[i])
        {
            document.getElementById(`${actualLetter.substring(0,7) + lettreCompareCompteur}`).classList.add("in-the-word-and-good-position")
        }
        lettreCompareCompteur++
    }
}

function checkGoodLetter(wordOfTheDayArray, currentWordArray)
{
    let lettreCompareCompteur =  indexActualLetter - (NBR_LETTRE)
    currentWordArray.forEach(function (letter){
        if (wordOfTheDayArray.includes(letter) )
        {
            if (!(document.getElementById(`${actualLetter.substring(0,7) + lettreCompareCompteur}`).classList.contains("in-the-word-and-good-position")))
            {
                document.getElementById(`${actualLetter.substring(0,7) +lettreCompareCompteur}`).classList.add("in-the-word-and-wrong-place")
            }
        } 
        else
        {
            document.getElementById(`${actualLetter.substring(0,7) +lettreCompareCompteur}`).classList.add("not-in-the-word") 
        }
        lettreCompareCompteur++  
    })
}
