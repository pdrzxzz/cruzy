const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const form = document.querySelector(".validated-form");

// Function to validate password match
function validatePassword() {
    if (password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity("Passwords do not match.");
        confirmPassword.classList.add("is-invalid");
        confirmPassword.classList.remove("is-valid");
    } else {
        confirmPassword.setCustomValidity("");
        confirmPassword.classList.remove("is-invalid");
        confirmPassword.classList.add("is-valid");
    }
}

// Event listeners for real-time validation
password.addEventListener("input", validatePassword);
confirmPassword.addEventListener("input", validatePassword);

// Prevent form submission if passwords don't match
form.addEventListener("submit", function (event) {
    validatePassword();
    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add("was-validated");
}, false);