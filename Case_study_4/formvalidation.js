function onlyLettersAndSpace(str) {
    // only letters and spaces, with at least 1 letter
    return /[a-zA-Z]/.test(str) && /^[A-Za-z\s]+$/.test(str);
}

function isValidEmail(str) {
    // username starts with a letter, then word characters, "-" or "."
    // domain has 2-4 extensions separated by ".", last one 2-3 characters
    return /^[a-zA-Z][\w.-]*@(?:\w+\.){1,3}\w{2,3}$/.test(str);
}

// local date as YYYY-MM-DD (toISOString would use UTC and can be off by a day)
function toDateString(d) {
    const pad = (n) => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

function addDays(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return toDateString(d);
}

const EXPERIENCE_MIN = 20;

function setError(input, message) {
    const err = document.getElementById(input.id + "-error");
    err.textContent = message;
    input.classList.toggle("invalid", message !== "");
    return message === "";
}

function validateName(input) {
    const v = input.value.trim();
    if (v === "") return setError(input, "Name is required.");
    if (!onlyLettersAndSpace(v)) return setError(input, "Name can only contain letters and spaces.");
    if (v.length < 2) return setError(input, "Name must be at least 2 letters.");
    return setError(input, "");
}

function validateEmail(input) {
    const v = input.value.trim();
    if (v === "") return setError(input, "E-mail is required.");
    if (!isValidEmail(v)) return setError(input, "E-mail format is incorrect (e.g. jane.doe@example.com).");
    return setError(input, "");
}

function validateStartDate(input) {
    // optional field
    if (input.value === "") return setError(input, "");
    // YYYY-MM-DD strings compare correctly as text
    if (input.value < addDays(1)) return setError(input, "Start date must be after today.");
    if (input.value > addDays(365)) return setError(input, "Start date must be within the next 12 months.");
    return setError(input, "");
}

function validateExperience(input) {
    const v = input.value.trim();
    if (v === "") return setError(input, "Please tell us about your experience.");
    if (v.length < EXPERIENCE_MIN) return setError(input, "Please write at least " + EXPERIENCE_MIN + " characters.");
    return setError(input, "");
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("job-form");
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const startdate = document.getElementById("startdate");
    const experience = document.getElementById("experience");

    startdate.min = addDays(1);
    startdate.max = addDays(365);

    const checks = [
        [name, validateName],
        [email, validateEmail],
        [startdate, validateStartDate],
        [experience, validateExperience],
    ];

    // live feedback once the user leaves a field, and again as they fix it
    checks.forEach(function ([input, check]) {
        input.addEventListener("blur", () => check(input));
        input.addEventListener("input", () => {
            if (input.classList.contains("invalid")) check(input);
        });
    });

    form.addEventListener("submit", function (e) {
        // run every check so all errors show at once
        const results = checks.map(([input, check]) => check(input));
        if (results.includes(false)) {
            e.preventDefault();
            checks.find(([input]) => input.classList.contains("invalid"))[0].focus();
        }
    });

    form.addEventListener("reset", function () {
        checks.forEach(([input]) => setError(input, ""));
    });
});
