class TextHandler {
    #PHRASE = 3
    #PADDING_MAX = 5 // make modifiable for accuracy
    #MATCH_ACCURACY = 2 // make modifiable for accuracy

    #padding = 5
    #rightInRow = 0
    state = true
    finished = false

    #currSpokenWord = ""
    #currSpokenPhrase = ""

    scriptPos = 0


    setScript(script) {
        this.originalScript = script
        script = script.toLowerCase()
        this.script = script.replace(/\n/g, " ").split(" ").filter(x => x != "")
    }

    clear() {

        this.state = true
        this.finished = false
        this.#currSpokenWord = ""
        this.#currSpokenPhrase = ""
        this.scriptPos = 0
        this.script = []

    }

    wordAtCurrPos() {
        return this.script[this.scriptPos]
    }

    isMatch(a, b) {
        // Levenshtein distance -
        // https://en.wikipedia.org/wiki/Levenshtein_distance

        if (a == b) return true

        if (a.length === 0) return b.length <= this.#MATCH_ACCURACY;
        if (b.length === 0) return a.length <= this.#MATCH_ACCURACY;

        if (a.length <= this.#MATCH_ACCURACY + 1 || b.length <= this.#MATCH_ACCURACY + 1) {
            return false;
        }

        var arr = [];

        // increment along the first column of each row
        var i;
        for (i = 0; i <= b.length; i++) {
            arr[i] = [i];
        }

        // increment each column in the first row
        var j;
        for (j = 0; j <= a.length; j++) {
            arr[0][j] = j;
        }

        // Fill in the rest of the arr
        for (i = 1; i <= b.length; i++) {
            for (j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    arr[i][j] = arr[i - 1][j - 1];
                } else {
                    arr[i][j] = Math.min(arr[i - 1][j - 1] + 1, // substitution
                        Math.min(arr[i][j - 1] + 1, // insertion
                            arr[i - 1][j] + 1)); // deletion
                }
            }
        }

        return arr[b.length][a.length] <= this.#MATCH_ACCURACY;
    }

    setCurrSpokenWord(newWord) {
        this.#currSpokenWord = newWord.toLowerCase()
    }

    setCurrSpokenPhrase(newPhrase) {
        this.#currSpokenPhrase = newPhrase.toLowerCase()

        this.#padding = this.#currSpokenPhrase.split(" ").length

        if (this.#padding > this.#PADDING_MAX) {
            this.#padding = this.#PADDING_MAX
            let temp = this.scriptPos - this.#PADDING_MAX
            if (temp < 0) temp = 0
            this.#currSpokenPhrase = this.#currSpokenPhrase.split(" ").slice(temp, this.scriptPos + 1).join(" ")
        }
    }

    isPhraseNear() { // TODO: #2 fix this!

        const extraPadding = this.#padding * 3
        let i
        // before
        if (this.scriptPos - this.#padding + 1 - extraPadding < 0) i = 0 // scriptpos -> last element of phrase
        else i = this.scriptPos - this.#padding + 1 - extraPadding // need to - padding - 1 to reach first element of phrase
        // [ 'Banana', 'Orange', 'Lemon', 'Apple', 'Mango' ]
        //             |                     ^   | scriptPos = 3... padding = 3... need to go back 2, so + 1

        let k
        // after
        if (this.scriptPos + extraPadding >= this.script.length) k = this.script.length - 1
        else k = this.scriptPos + extraPadding

        let distance = Infinity
        for (; i < k; i++) {

            if (this.isMatch(this.script.slice(i, i + this.#padding).join(" "), this.#currSpokenPhrase)) {

                // [... 'Banana', 'Orange', 'Lemon', 'Apple', 'Mango', 'Pear', 'S', 'K'... ]
                // if looking for [lemon, apple, mango], i will match here  | ^                      |
                //0      (2)          2                   (-5)             7
                if (Math.abs(i - this.scriptPos) < Math.abs(distance)) { // may need to change based on before/after
                    distance = i - this.scriptPos
                }
            }
        }

        if (distance != Infinity) {
            // before
            if (distance < 0) {
                this.scriptPos - this.#padding + 1 + i
            }
            if (i - distance <= k && i - distance >= i) {
                this.scriptPos = i - distance
            }
            this.#rightInRow++
            return true
        }
        else {
            return false;
            // ret false
        }

    }
    isWordNear() {

        return false
    }

    algorithm() {
        if (this.scriptPos == this.script.length || this.script.slice(-1).toString() == this.wordAtCurrPos()) {
            this.state = false
            this.finished = true
            return true
        }
        if (this.isMatch(this.wordAtCurrPos(), this.#currSpokenWord)) {
            // console.log(this.wordAtCurrPos + this.#currSpokenWord);
            this.scriptPos++
            return true
        }
        else if (this.isPhraseNear()) {
            return true
        }
        else if (this.isWordNear()) {
            return true
        }
        
        else {
            // maybe: do nothing
            return false
        }
    }
}

const t = new TextHandler()
var running = true


window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const speechRecognition = new SpeechRecognition();
speechRecognition.interimResults = true;
speechRecognition.lang = 'en-US';

let p = document.createElement('p');
const words = document.querySelector('.words');
words.appendChild(p);

speechRecognition.addEventListener('result', e => {
    if (running) {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join(' ');


        
        p.textContent = transcript
        t.setCurrSpokenPhrase(transcript)
        const temp = transcript.split(" ").pop()
        t.setCurrSpokenWord(temp)
        console.log(temp);

        let good = t.algorithm()

        console.log(good + " " + transcript + " at " + t.scriptPos);



        if (e.results[0].isFinal) {
            p = document.createElement('p');
            words.appendChild(p);
        }

        if (!t.state) {
            $("#btn2").click()
            
        }
        if (t.finished) {
            // add some finish graphic
        } else {} // error
        

    }
});

speechRecognition.addEventListener('end', speechRecognition.start);


// Set the onClick property of the start button
$(document).ready(function () {

    //This function called when the button is clicked
    $("#btn").click(function () {

        // val() method is used to get the values from 
        // textarea and stored in txt variable
        const script = $("#textinp").val()
        if (script == "") alert("Enter a script")
        else {

            t.setScript(script)
            running = true;
            speechRecognition.start()

        }
    });
});

// Set the onClick property of the start button
$(document).ready(function () {

    //This function called when the button is clicked
    $("#btn2").click(function () {

        // val() method is used to get the values from 
        // textarea and stored in txt variable

        console.log("fuckkkk")
        t.clear()
        running = false

    });
});


