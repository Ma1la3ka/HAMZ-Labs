const typedTextSpan = document.querySelector("#typed-text");
const textArray = ["Edu-Tech.", "The Future.", "Academics."];
const typingSpeed = 150;
const erasingSpeed = 100;
const newTextDelay = 2000; 
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingSpeed);
    } else {
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingSpeed);
    } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingSpeed + 1100);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    setTimeout(type, newTextDelay + 250);
});
const contactForm = document.querySelector('form');

contactForm.addEventListener('submit', function(event) {
    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const message = document.querySelector('textarea[name="message"]').value;

    // Check if the name is too short
    if (name.length < 3) {
        alert("Please enter your full name.");
        event.preventDefault(); // This STOPS the form from sending to Formspree
        return;
    }

    // Check if the message is too short
    if (message.length < 10) {
        alert("Your message is a bit too short! Please give us more detail.");
        event.preventDefault(); 
        return;
    }

    // If everything is fine, the form will submit to Formspree normally!
    console.log("Form is valid. Sending to Halcyon...");
});
const form = document.getElementById('contact-form');
const result = document.getElementById('result');

form.addEventListener('submit', function(e) {
    e.preventDefault(); // Stop the page from refreshing!
    
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    result.innerHTML = "Please wait...";
    result.style.color = "#6366f1"; // Blue while loading

    fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                result.innerHTML = "Message sent successfully!";
                result.style.color = "#00DFD8"; // Cyan for success
                form.reset(); // Clear the form
            } else {
                console.log(response);
                result.innerHTML = json.message;
                result.style.color = "#ff4d4d"; // Red for error
            }
        })
        .catch(error => {
            console.log(error);
            result.innerHTML = "Something went wrong!";
            result.style.color = "#ff4d4d";
        })
        .then(function() {
            // Optional: Hide the message after 5 seconds
            setTimeout(() => {
                result.innerHTML = "";
            }, 5000);
        });
});