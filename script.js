class TextHandler {
    #PHRASE = 3
    #PADDING = 5 // make modifiable for accuracy

    #badCount = 0
    #rightInRow = 0
    state = true

    current = ""
    scriptPos = 0


    setScript(script) {
        this.originalScript = script
        script = script.toLowerCase()
        this.script = script.replace(/\n/g, " ").split(" ").filter(x => x != "")
    }

    clear() {
        this.#badCount = 0
        this.#rightInRow = 0
        this.state = true

        this.current = ""
        this.scriptPos = 0
        this.script = []

    }

    wordAtCurrPos() {
        return this.script[this.scriptPos]
    }

    matchStrength(a, b) {
        // Levenshtein distance -
        // https://en.wikipedia.org/wiki/Levenshtein_distance

        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;


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

        return arr[b.length][a.length];
    }

    algorithm(recognized) {

        if (!recognized) {
            let i

            if (this.scriptPos - this.#PADDING < 0) i = 0
            else i = this.scriptPos - this.#PADDING

            let k

            if (this.scriptPos + this.#PADDING >= this.script.length) k = this.script.length - 1
            else k = this.scriptPos + this.#PADDING

            let distance = Infinity
            for (; i < k; i++) {
                if (this.matchStrength(this.script[i], this.current) <= 1) {
                    if (Math.abs(i - this.scriptPos) < Math.abs(distance)) {
                        distance = i - this.scriptPos
                    }
                }
            }

            if (distance != Infinity) {
                this.scriptPos = i + distance
                this.#rightInRow++
                if (this.#badCount < this.#PHRASE) {
                    this.#badCount = 0
                    return true
                }
                else if (this.#rightInRow == this.#PHRASE && this.#badCount > 0) {
                    this.#badCount = 0
                    return true
                }
                return true
            }
            else {
                this.#badCount++
                if (this.#badCount >= this.#PADDING) {
                    this.state = false
                }

                this.#rightInRow = 0
                return false
            }
        }

        else {
            this.#rightInRow++
            if (this.#badCount < this.#PHRASE) {
                this.#badCount = 0
                return true
            }
            else if (this.#rightInRow == this.#PHRASE && this.#badCount > 0) {
                this.#badCount = 0
                return true
            }

            return false
        }


    }
}

const t = new TextHandler()
headerText = ""



if ("webkitSpeechRecognition" in window) {


    const MAX_TRIES = 5 // make modifiable for accuracy
    tries = 0

    // Initialize webkitSpeechRecognition
    let speechRecognition = new webkitSpeechRecognition();


    // Set the properties for the Speech Recognition object
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = "en-US"



    speechRecognition.onresult = (event) => {



        // Create the interim transcript string locally because we don't want it to persist like final transcript
        interim_transcript = ""


        // Loop through the results from the speech recognition object.
    loop1:
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript

            let words = event.results[i][0].transcript.split(" ")
            console.log("maybe: " + words);
        loop2:
            for (const word of words) {
                if (t.matchStrength(word, t.wordAtCurrPos()) > 2) {
                    tries++

                    if (tries === MAX_TRIES) {
                        t.current = word
                        console.log(t.current + " " + t.algorithm(false))
                        t.scriptPos++
                        tries = 0
                    }
                }
                else {
                    tries = 0

                    t.current = word
                    console.log(t.current + " " + t.algorithm(true))
                    t.scriptPos++
                }

                if (t.scriptPos === t.script.length && t.scriptPos != 0) {
                    console.log("done")
                    t.state = false
                }
                if (!t.state) {
                    headerText = t.script.toString()
                    $("#result").html(headerText)
                    $("#btn2").click()
                    
                    break loop1
                }
                else {
                    headerText = t.script.slice(0, t.scriptPos).toString()
                    $("#result").html('<span style="color: blue">' + headerText + "</span> " + t.script.slice(t.scriptPos, t.script.length).toString())
                }
            }

            /* else {
                
                interim_transcript += event.results[i][0].transcript;
            } */
        }



        // Set the Final transcript and Interim transcript.

    };

    // Set the onClick property of the start button
    $(document).ready(function () {

        //This function called when the button is clicked
        $("#btn").click(function () {

            // val() method is used to get the values from 
            // textarea and stored in txt variable
            const script = $("#textinp").val()
            headerText = script
            $("#result").html(headerText)
            t.setScript(script)

            speechRecognition.start()

        });
    });

    // Set the onClick property of the start button
    $(document).ready(function () {

        //This function called when the button is clicked
        $("#btn2").click(function () {

            // val() method is used to get the values from 
            // textarea and stored in txt variable

            speechRecognition.stop()
            //   console.log("fuckkkk")
            t.clear()
            tries = 0
        });
    });
} else {
    console.log("Speech Recognition Not Available");
}


