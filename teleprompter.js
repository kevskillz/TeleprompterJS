var wordLookup = {
    "ain't": 'am not',
    "aimn't": 'am not',
    "aren't": 'are not',
    "can't": 'can not',
    "could've": 'could have',
    "couldn't": 'could not',
    "couldn't've": 'could not have',
    "didn't": 'did not',
    "doesn't": 'does not',
    "don't": 'do not',
    "gonna": 'going to',
    "hadn't": 'had not',
    "hadn't've": 'had not have',
    "hasn't": 'has not',
    "haven't": 'have not',
    "he'd": 'he would',
    "he'd've": 'he would have',
    "he'll": 'he will',
    "he's": 'he is',
    "he'sn't": 'he is not',
    "how'd": 'how did',
    "how'll": 'how will',
    "how's": 'how is',
    "i'd": 'i would',
    "i'd've": 'i would have',
    "i'll": 'i will',
    "i'm": 'i am',
    "i've": 'i have',
    "i'ven't": 'i have not',
    "isn't": 'is not',
    "it'd": 'it would',
    "it'd've": 'it would have',
    "it'll": 'it will',
    "it's": 'it is',
    "it'sn't": 'it is not',
    "let's": 'let us',
    "ma'am": 'madam',
    "mightn't": 'might not',
    "mightn't've": 'might not have',
    "might've": 'might have',
    "mustn't": 'must not',
    "must've": 'must have',
    "needn't": 'need not',
    "not've": 'not have',
    "o'clock": 'of the clock',
    "ol'": 'old',
    "oughtn't": 'ought not',
    "shan't": 'shall not',
    "she'd": 'she would',
    "she'd've": 'she would have',
    "she'll": 'she will',
    "she's": 'she is',
    "she'sn't": 'she is not',
    "should've": 'should have',
    "shouldn't": 'should not',
    "shouldn't've": 'should not have',
    "somebody'd": 'somebody would',
    "somebody'd've": 'somebody would have',
    "somebody'dn't've": 'somebody would not have',
    "somebody'll": 'somebody will',
    "somebody's": 'somebody is',
    "someone'd": 'someone would',
    "someone'd've": 'someone would have',
    "someone'll": 'someone will',
    "someone's": 'someone is',
    "something'd": 'something would',
    "something'd've": 'something would have',
    "something'll": 'something will',
    "something's": 'something is',
    "sup": 'what is up',
    "that'll": 'that will',
    "that's": 'that is',
    "there'd": 'there would',
    "there'd've": 'there would have',
    "there're": 'there are',
    "there's": 'there is',
    "they'd": 'they would',
    "they'dn't": 'they would not',
    "they'dn't've": 'they would not have',
    "they'd've": 'they would have',
    "they'd'ven't": 'they would have not',
    "they'll": 'they will',
    "they'lln't've": 'they will not have',
    "they'll'ven't": 'they will have not',
    "they're": 'they are',
    "they've": 'they have',
    "they'ven't": 'they have not',
    "'tis": 'it is',
    "'twas": 'it was',
    "wanna": 'want to',
    "wasn't": 'was not',
    "we'd": 'we would',
    "we'd've": 'we would have',
    "we'dn't've": 'we would not have',
    "we'll": 'we will',
    "we'lln't've": 'we will not have',
    "we're": 'we are',
    "we've": 'we have',
    "weren't": 'were not',
    "what'll": 'what will',
    "what're": 'what are',
    "what's": 'what is',
    "what've": 'what have',
    "when's": 'when is',
    "where'd": 'where did',
    "where's": 'where is',
    "where've": 'where have',
    "who'd": 'who would',
    "who'd've": 'who would have',
    "who'll": 'who will',
    "who're": 'who are',
    "who's": 'who is',
    "who've": 'who have',
    "why'll": 'why will',
    "why're": 'why are',
    "why's": 'why is',
    "won't": 'will not',
    "won't've": 'will not have',
    "would've": 'would have',
    "wouldn't": 'would not',
    "wouldn't've": 'would not have',
    "y'all": 'you all',
    "y'all'd've": 'you all would have',
    "y'all'dn't've": 'you all would not have',
    "y'all'll": 'you all will',
    "y'all'lln't": 'you all will not',
    "y'all'll've": 'you all will have',
    "y'all'll'ven't": 'you all will have not',
    "you'd": 'you would',
    "you'd've": 'you would have',
    "you'll": 'you will',
    "you're": 'you are',
    "you'ren't": 'you are not',
    "you've": 'you have',
    "you'ven't": 'you have not'
};
class Contractions {
    constructor(contractions) {
        var keys;

        this._expandLookup = contractions;
        // Put the longest keys first so they match before shorter, partial matches.
        keys = Object.keys(this._expandLookup);
        keys.sort((a, b) => {
            var diff = b.length - a.length;

            if (diff !== 0) diff = this._expandLookup[b].length - this._expandLookup[a].length;

            return diff;
        });
        this._expandRegexp = new RegExp(keys.join('|'), 'gi');

        // Build reverse lookup
        let contractLookup = {};

        Object.keys(contractions).forEach(function (key) {
            contractLookup[contractions[key]] = key;
        });

        this._contractLookup = contractLookup;
        keys = Object.keys(this._contractLookup);
        keys.sort((a, b) => {
            var diff = b.length - a.length;

            if (diff !== 0) diff = this._contractLookup[b].length - this._contractLookup[a].length;

            return diff;
        });
        this._contractRegexp = new RegExp(keys.join('|'), 'gi');


        // Expose class for custom word lists
        this.Contractions = Contractions;
    }

    expand(text) {
        return this._convert(text, this._expandLookup, this._expandRegexp);
    }


    contract(text) {
        return this._convert(text, this._contractLookup, this._contractRegexp);
    }


    _convert(text, lookup, regexp) {
        return text.replace(regexp, (matched) => {
            var replacement = lookup[matched.toLowerCase()];
            var firstCharCode = matched.charAt(0) === '\'' ? matched.charCodeAt(1) : matched.charCodeAt(0);

            // Check if first character of matched string is uppercase
            if (firstCharCode >= 65 && firstCharCode <= 90) {
                // Uppercase the first character of the replacement text
                if (replacement.charAt(0) === '\'') {
                    replacement = '\'' + replacement.charAt(1).toUpperCase() + replacement.slice(2);
                }
                else {
                    replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
                }
            }

            return replacement;
        });
    }
}
var contractions = new Contractions(wordLookup);
function toWords(s) {

    let th = ['', 'thousand', 'million', 'billion', 'trillion'];
    let dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    let tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    let tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    s = s.toString();
    s = s.replace(/[\, ]/g, '');
    if (s != parseFloat(s)) return s;
    var x = s.indexOf('.');
    if (x == -1)
        x = s.length;
    var n = s.split('');
    var str = '';
    var sk = 0;
    for (var i = 0; i < x; i++) {
        if ((x - i) % 3 == 2) {
            if (n[i] == '1') {
                str += tn[Number(n[i + 1])] + ' ';
                i++;
                sk = 1;
            } else if (n[i] != 0) {
                str += tw[n[i] - 2] + ' ';
                sk = 1;
            }
        } else if (n[i] != 0) { // 0235
            str += dg[n[i]] + ' ';
            if ((x - i) % 3 == 0) str += 'hundred ';
            sk = 1;
        }
        if ((x - i) % 3 == 1) {
            if (sk)
                str += th[(x - i - 1) / 3] + ' ';
            sk = 0;
        }
    }

    if (x != s.length) {
        var y = s.length;
        str += 'point ';
        for (var i = x + 1; i < y; i++)
            str += dg[n[i]] + ' ';
    }
    return str.replace(/\s+/g, ' ');
}

var word = {
    recognized: false,
    str: ""
}

class TextHandler {
    #BAD_MAX = 1
    #PADDING_MAX = 6 // make modifiable for accuracy
    #MATCH_ACCURACY = 2 // make modifiable for accuracy

    #badcount = 0
    state = true
    finished = false

    #currSpokenWord = ""

    scriptPos = 0




    setScript(script) {
        let m_script = script.trim().replace(/\n/g, " ").split(" ").filter(x => x != "")
        this.originalScript = m_script
        for (let i = 0; i < this.originalScript.length; i++) {
            if (contractions.expand(this.originalScript[i]) != this.originalScript[i]) {
                this.originalScript.splice(i + 1, 0, '')
            }
            else if (toWords(this.originalScript[i]) != this.originalScript[i]) {
                let t = toWords(this.originalScript[i]).split(' ').length
                for (let j = i; j < i + t; j++) {
                    this.originalScript.splice(j + 1, 0, '')
                }
            }
        }
        console.log(this.originalScript);
        script = contractions.expand(m_script.join(' ').toLowerCase()).split(' ') // TODO: #3 map OG script to this one cuz changed contractions

        this.script = script
        this.script.forEach(element => toWords(element))

        console.log(this.script);
    }

    setCurrSpokenWord(newWord) {
        this.#currSpokenWord = newWord.toLowerCase()
        console.log(this.#currSpokenWord);
    }

    getAccuracies() {
        return [this.#PADDING_MAX, this.#MATCH_ACCURACY]
    }

    setPaddMax(padd_max) {
        this.#PADDING_MAX = padd_max
    }

    setMatchAcc(match_acc) {
        this.#MATCH_ACCURACY = match_acc
    }

    clear() {

        this.state = true
        this.finished = false
        this.#currSpokenWord = ""
        this.scriptPos = 0

        this.#badcount = 0
        this.script = []
        this.originalScript = []
    }

    wordAtCurrPos() {
        return this.script[this.scriptPos]
    }

    initP(color1) {
        console.log(this.script);
        this.color1 = color1
        return "<span style='color: " + color1 + " '>" + this.originalScript.filter(x => x != '').join(' ') + "</span>"
    }


    wordsFromOriginalScript() { // TODO: #4 fix wordsFromOGScript()

        // return "<span style='color: " + color1 + " '>" + this.originalScript.slice(0, this.scriptPos).filter(x => x != '').join(' ') +
        //    "</span>" + " <span style='color: " + this.color2 + " '>" + this.originalScript.slice(this.scriptPos, this.originalScript.length).filter(x => x != '').join(' ')
        //    + "</span>"
        let arr = []

        this.originalScript.slice(0, this.scriptPos).filter(x => x != '').forEach(element => {
            const word = { recognized: true, str: element }
            arr.push(word)
        })
        this.originalScript.slice(this.scriptPos, this.originalScript.length).filter(x => x != '').forEach(element => {
            const word = { recognized: false, str: element }
            arr.push(word)
        })

        return arr
    }

    isMatch(a, b) {
        // Levenshtein distance -
        // https://en.wikipedia.org/wiki/Levenshtein_distance

        if (a == b) return true
        console.log(a + ' ' + b);
        if (a.length === 0) return b.length <= this.#MATCH_ACCURACY;
        if (b.length === 0) return a.length <= this.#MATCH_ACCURACY;

        let containsSymbol = false
        let containsLetter = false

        for (let l = 0; l < a.length; l++) {
            if (a[l].match(/[^a-zA-Z0-9]/g)) containsSymbol = true
            else containsLetter = true
            if (containsSymbol && containsLetter) break
        }


        if (containsSymbol && containsLetter) {
            a = a.replace(/[^a-zA-Z0-9]/g, '')
            b = b.replace(/[^a-zA-Z0-9]/g, '')
        }

        if (a == b) return true

        if (a.length <= this.#MATCH_ACCURACY || b.length <= this.#MATCH_ACCURACY) {
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
        console.log(arr[b.length][a.length] <= this.#MATCH_ACCURACY);
        return arr[b.length][a.length] <= this.#MATCH_ACCURACY;
    }

    isDone() {
        if (this.scriptPos == this.script.length) {

            this.state = false
            this.finished = true
            return true
        }
    }

    isWordNear() {

        let i
        // before
        if (this.scriptPos + 1 - this.#PADDING_MAX < 0) i = 0
        else i = this.scriptPos + 1 - this.#PADDING_MAX

        let k
        // after
        if (this.scriptPos + 1 + this.#PADDING_MAX >= this.script.length) k = this.script.length
        else k = this.scriptPos + 1 + this.#PADDING_MAX
        console.log(i + ' ' + k);
        let distance = Infinity
        for (; i < k; i++) {

            if (this.isMatch(this.script[i], this.#currSpokenWord)) {

                if (Math.abs(i - this.scriptPos + 1) <= Math.abs(distance) ||
                    (i - this.scriptPos + 1 > 0 && i - this.scriptPos + 1 <= Math.abs(distance) + this.#MATCH_ACCURACY)) { // may need to change based on before/after
                    distance = i - this.scriptPos + 1 // positive if after currword, neg if before

                    console.log(this.script[i] + "\ndistance: " + distance);
                }
            }
        }

        console.log(distance);
        if (distance != Infinity) {
            this.scriptPos = distance + this.scriptPos
            return true
        }
        else {
            return false;
            // ret false
        }
    }

    algorithm() {

        if (this.isMatch(this.wordAtCurrPos(), this.#currSpokenWord)) {
            this.#badcount = 0
            // console.log(this.wordAtCurrPos + this.#currSpokenWord);
            this.scriptPos++
            this.isDone()
            return true
        }

        else if (this.#badcount >= this.#BAD_MAX) {
            let ret = false
            if (this.isWordNear()) {
                this.#badcount = 0
                ret = true
            }
            this.isDone()
            return ret
        }


        this.#badcount++
        // maybe: do nothing
        return false



    }
}


const words = document.querySelector('.words');
var text = []



// Set the onClick property of the start button
$(document).ready(function () {


    $("#btn").click(function () {
        window.location.href = "index.html"

        // val() method is used to get the values from 
        // textarea and stored in txt variable
    })
    $("#btn2").click(function () {
       

        running = !running
        console.log('%cDone', 'background: #222; color: #ae1ebb')

        // val() method is used to get the values from 
        // textarea and stored in txt variable
    })


    document.getElementById("padd_text").innerHTML = t.getAccuracies()[0]
    document.getElementById("match_text").innerHTML = t.getAccuracies()[1]

    document.getElementById("padd_max").oninput = function () {
        document.getElementById("padd_text").innerHTML = this.value
        t.setPaddMax(this.value)
    }
    document.getElementById("match_acc").oninput = function () {
        document.getElementById("match_text").innerHTML = this.value
        t.setMatchAcc(this.value)
    }

    const script = localStorage.getItem("script")

    if (script == null) {
        alert("You must enter a script!")
        window.location.href = "index.html"
    } else {

        t.setScript(script)
        t.initP("#000")
        running = true;
        try {
            speechRecognition.start()
        } catch (err) { }
    }

    t.originalScript.forEach(element => {
        if (element.trim() != '') {
            let p = document.createElement('nobr')
            p.innerHTML = element + ' '
            console.log(p);
            text.push(p)

            words.appendChild(p)
            if (!isInView(p)) {
                try {

                    words.insertBefore(document.createTextNode('\n'), p.before())


                } catch (err) { console.log(err) }
            }

        }

    });
    console.log(text);

})



console.log("loaded");

var t = new TextHandler()
var running = true


window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const speechRecognition = new SpeechRecognition();
speechRecognition.interimResults = true;
speechRecognition.lang = 'en-US';

const color2 = "#F67280"


var first = true



function isInView(elem) {

    var docViewTop = $(window).scrollLeft();
    var docViewBottom = docViewTop + $(window).width();

    var elemTop = $(elem).offset().left;
    var elemBottom = elemTop + $(elem).width();

    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom));
}

function scrollToView(element){
   element.scrollIntoViewIfNeeded()
}

speechRecognition.addEventListener('result', e => {
    if (running) {
        if (first) {

            for (const i of words.childNodes) {
                if (i.textContent == '\n') {
                    i.remove()
                }
            }
            first = false

        }

        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join(' ');
        console.log(t.wordAtCurrPos());



        let ptemp = transcript.replace("  ", " ").split(" ").pop()
        let temp = contractions.expand(ptemp)

        // console.log(temp + ' ' + ptemp);

        for (const i of temp.split(" ")) {

            t.setCurrSpokenWord(toWords(i))
            console.log(i);
            // console.log(i);

            // p.textContent = transcript


            let good = t.algorithm()

            if (good) {

                let wArr = t.wordsFromOriginalScript()
                let fir = false
                for (let i = 0; i < text.length; i++) {

                    console.log(wArr.length + ' ' + text.length); // fix text.length too long
                    let p = text[i]
                    let element = wArr[i]
                    if (element.recognized) {
                        if(!fir) {
                            fir = true
                        }

                        p.innerHTML = "<span style='color: " + color2 + " '>" + element.str + ' ' + "</span>"

                    } else {


                        p.innerHTML = "<span style='color: " + t.color1 + " '>" + element.str + ' ' + "</span>"

                    }

                    if (!isInView(text[i])) {
                        try {
                            text[i - 2].innerHTML += '<wbr />'
                        } catch (err) { }
                    }
                    if (fir) {
                       scrollToView(p)
                       fir = false
                    }
                   

                };
            }

            // console.log(good + " " + i + " at " + t.scriptPos);

        }
        

        if (!t.state) {
            console.log('%cDone', 'background: #222; color: #ae1ebb');
            running = false
            t.clear()
        }


    }
});

speechRecognition.addEventListener('end', speechRecognition.start);


