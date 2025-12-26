// Add this at the top of your Login.js
document.getElementById('humanVerify').addEventListener('change', function() {
    const verificationSuccess = document.getElementById('verificationSuccess');
    if(this.checked) {
        verificationSuccess.style.display = 'block';
        // Generate a simple puzzle
        const puzzle = generateSimplePuzzle();
        currentPuzzle = puzzle;
        verificationSuccess.innerHTML = `<i class="fas fa-check-circle"></i> ${puzzle.question}`;
    } else {
        verificationSuccess.style.display = 'none';
    }
});

// Add this function to generate simple puzzles
function generateSimplePuzzle() {
    const puzzles = [
        { 
            question: "What is 3 + 4? (Answer: 7)", 
            answer: "7" 
        },
        { 
            question: "What is the first letter of 'Apple'? (Answer: A)", 
            answer: "A" 
        },
        { 
            question: "How many sides does a triangle have? (Answer: 3)", 
            answer: "3" 
        }
    ];
    return puzzles[Math.floor(Math.random() * puzzles.length)];
}

let currentPuzzle = generateSimplePuzzle();

function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return {
        question: `${num1} + ${num2} = ?`,
        answer: num1 + num2
    };
}
let currentCaptcha = generateCaptcha();
// Initialize CAPTCHA
document.getElementById('captchaQuestion').textContent = currentCaptcha.question;
async function verifyAccess() {
    const humanVerify = document.getElementById('humanVerify');
    const privacyPolicy = document.getElementById('privacyPolicy');
    
    if (!humanVerify.checked) {
        alert('Please complete the human verification');
        return;
    }
    
    if (!privacyPolicy.checked) {
        alert('Please accept the privacy policy');
        return;
    }
    let formData = {
        Adminstration: document.getElementById('ad').value,
        Email: document.getElementById('email').value,
        Pass: document.getElementById('pass').value,
        captchaAnswer: parseInt(document.getElementById('captcha').value),
        errorMessage: document.getElementById('errorMessage'),
        loading: document.getElementById('loading'),
        submitBtn: document.getElementById('submit-btn'),
    };
    // Store email in localStorage for chat initialization
    localStorage.setItem('userEmail', formData.Email);
    eel.Login(formData)
    // Show loading
    formData.submitBtn.style.display = 'none';
    formData.loading.style.display = 'block';

    // Verify CAPTCHA first
    if (formData.captchaAnswer == currentCaptcha.answer) {


        // Call Python function to verify password
        let passwordMatch = await eel.Password(formData)();
        let adminStatus = await eel.Administration(formData)();

        if (passwordMatch && adminStatus) {
            // Successful verification - redirect based on administration type
            document.getElementById('securityOverlay').style.display = 'none';
            if (formData.Adminstration === 'Admin') {
                window.location.href = 'AdminPanel.html';
            } else if (formData.Adminstration === 'Customer') {
                window.location.href = 'CartView.html';
            }
        }
        else {
            // Failed verification
            formData.errorMessage.style.display = 'block';
            currentCaptcha = generateCaptcha();
            document.getElementById('captchaQuestion').textContent = currentCaptcha.question;
            document.getElementById('captcha').value = '';
        }
    } else {
        // CAPTCHA failed
        formData.errorMessage.style.display = 'block';
        currentCaptcha = generateCaptcha();
        document.getElementById('captchaQuestion').textContent = currentCaptcha.question;
        document.getElementById('captcha').value = '';
    }

    // Hide loading
    formData.submitBtn.style.display = 'inline-block';
    formData.loading.style.display = 'none';
}
// Add to Login.js
document.getElementById('privacyPolicyLink').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('privacyModal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('privacyModal').style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('privacyModal')) {
        document.getElementById('privacyModal').style.display = 'none';
    }
});