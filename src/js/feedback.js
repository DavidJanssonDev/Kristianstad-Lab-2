const formElement = document.getElementById("feedback-form");
const inputFullName = document.getElementById("fb-name");
const inputEmail = document.getElementById("fb-email");
const inputTopic = document.getElementById("fb-topic");
const inputComments = document.getElementById("fb-comments");
const inputWebsite = document.getElementById("fb-website");
const inputCounter = document.querySelector(".comments-wrapper .comments-counter");
const inputStatus = document.getElementById("form-status");
 
const MIN_COMMENT_LENGTH = 15;
const SUCCESS_DURATION_MS = 4000;
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s'’-]*$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


let statusTimer;

// ---------- HELPERS ----------

function errorElement(input) {
    return document.getElementById(`${input.id}-error`);
}

function showFieldError(input, message) {
  input.classList.remove("is-valid");
  input.classList.add("is-invalid");
  input.setAttribute("aria-invalid", "true");
  errorElement(input).textContent = message;
}

function showFieldValid(input) {
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");
  input.removeAttribute("aria-invalid");
  errorElement(input).textContent = "";
}

function clearFieldError(input) {
  input.classList.remove("is-invalid", "is-valid");
  input.removeAttribute("aria-invalid");
  errorElement(input).textContent = "";
}


// ---------- Validation ----------


function validateFullName() {
    if (inputFullName === null) return;

    const FullNameValue = inputFullName.value.trim()

    if (FullNameValue == "") {
        showFieldError(inputFullName, "Please enter your full name.");
        return false
    }

    if (FullNameValue.length <2) {
        showFieldError(inputFullName, "Your name must be at least 2 characters.");
        return false;
    }

    if (!NAME_PATTERN.test(FullNameValue)) {
        showFieldError(inputFullName, "Use only letters, spaces, apostrophes and hyphens.");
        return false;
    }

    showFieldValid(inputFullName);
    return true;
}

function validateEmail() {
    if (inputEmail === null) return;

    const value = inputEmail.value.trim();
    
    if (value === "") {
        showFieldError(inputEmail, "Please enter your email address.");
        return false;
    }
    
    if (!EMAIL_PATTERN.test(value)) {
        showFieldError(inputEmail, "Please enter a valid email, like name@example.com.");
        return false;
    }
    showFieldValid(inputEmail);
    return true;
}

function validateTopic() {
    if (inputTopic === null) return;

    if (inputTopic.value === "") {
        showFieldError(inputTopic, "Please choose a topic.");
        return false;
    }
    showFieldValid(inputTopic);
    return true;
}

function validateComments() {
    if (inputComments === null) return

    const length = inputComments.value.trim().length;
    if (length === 0) {
        showFieldError(inputComments, "Please write a comment.");
        return false;
    }
    if (length < MIN_COMMENT_LENGTH) {
        showFieldError(inputComments, `Your comment must be at least ${MIN_COMMENT_LENGTH} characters.`);
        return false;
    }
    showFieldValid(inputComments);
    return true;
}

function validateWebsite() {
    if (inputWebsite === null) return;

    if (inputWebsite.value.trim() === "") {
        clearFieldError(inputWebsite); 
        return true;
    }
    if (!inputWebsite.checkValidity()) { 
        showFieldError(inputWebsite, "Please enter a full URL, like https://www.example.com.");
        return false;
    }
    showFieldValid(inputWebsite);
    return true;
}


// ---------- Live counter ----------

function updateCounter() {
  const length = inputComments.value.trim().length;
  const reached = length >= MIN_COMMENT_LENGTH;

  inputCounter.textContent = reached
    ? `${length} / ${MIN_COMMENT_LENGTH} min ✓`
    : `${length} / ${MIN_COMMENT_LENGTH} min`;

  inputCounter.classList.toggle("counter-met", reached);
  inputCounter.classList.toggle("counter-short", !reached);
}

// ---------- Status message ----------

function showStatus(message) {
  inputStatus.textContent = message;
  inputStatus.className = "alert alert-success mt-3";
  clearTimeout(statusTimer);
  statusTimer = setTimeout(clearStatus, SUCCESS_DURATION_MS);
}

function clearStatus() {
  clearTimeout(statusTimer);
  inputStatus.textContent = "";
  inputStatus.className = "mt-3";
}


// ---------- Reset to the complete initial state ----------

function resetForm() {
    for (const input of [inputFullName, inputEmail, inputTopic, inputComments, inputWebsite]) {
        clearFieldError(input);
    }
    updateCounter();
}

// ---------- Events ----------

const fields = [
  [inputFullName, validateFullName],
  [inputEmail, validateEmail],
  [inputTopic, validateTopic],
  [inputComments, validateComments],
  [inputWebsite, validateWebsite],
];

for (const [input, validate] of fields) {
  input.addEventListener("blur", validate); // validate once the user leaves the field
  input.addEventListener("input", () => {
    // after a field has been checked, keep its state up to date while typing
    if (input.classList.contains("is-invalid") || input.classList.contains("is-valid")) {
      validate();
    }
  });
}

inputComments.addEventListener("input", updateCounter);

formElement.addEventListener("submit", (event) => {
  event.preventDefault();

  // run every validator (no short-circuit) so all messages show at once
  const results = fields.map(([, validate]) => validate());
  if (results.includes(false)) {
    formElement.querySelector(".is-invalid")?.focus();
    return;
  }

  const name = inputFullName.value.trim();
  formElement.reset();
  resetForm();
  showStatus(`Thanks for your feedback, ${name}!`);
});

// Clear button: the browser empties the values AFTER this event, so wait a tick
formElement.addEventListener("reset", () => {
   clearStatus()
   setTimeout(resetForm, 0)
});


updateCounter();