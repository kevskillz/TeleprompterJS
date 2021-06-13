// Set the onClick property of the start button
$(document).ready(function () {

    //This function called when the button is clicked
    $("#btn").click(function () {

        // val() method is used to get the values from 
        // textarea and stored in txt variable
        const script = document.getElementById("message").innerText

        if (script.trim() == "") alert("Enter a script!")
        else {
            localStorage.setItem("script", script)
            window.location.href = "teleprompter.html"
        }
    })
    $('#btn2').click(function() {

        localStorage.clear()
        document.getElementById("message").innerText = ""

    })
})
