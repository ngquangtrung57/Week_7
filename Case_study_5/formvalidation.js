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

// each validator returns an error message, or "" if the value is fine
function validateName(value) {
    const v = value.trim();
    if (v === "") return "Name is required.";
    if (!onlyLettersAndSpace(v)) return "Name can only contain letters and spaces.";
    if (v.length < 2) return "Name must be at least 2 letters.";
    return "";
}

function validateEmail(value) {
    const v = value.trim();
    if (v === "") return "E-mail is required.";
    if (!isValidEmail(v)) return "E-mail format is incorrect (e.g. jane.doe@example.com).";
    return "";
}

function validateStartDate(value) {
    // optional field
    if (value === "") return "";
    // YYYY-MM-DD strings compare correctly as text
    if (value < addDays(1)) return "Start date must be after today.";
    if (value > addDays(365)) return "Start date must be within the next 12 months.";
    return "";
}

function validateExperience(value) {
    const v = value.trim();
    if (v === "") return "Please tell us about your experience.";
    if (v.length < EXPERIENCE_MIN) return "Please write at least " + EXPERIENCE_MIN + " characters.";
    return "";
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("job-form");
    const startdate = document.getElementById("startdate");

    startdate.min = addDays(1);
    startdate.max = addDays(365);

    const checks = [
        ["name", validateName],
        ["email", validateEmail],
        ["startdate", validateStartDate],
        ["experience", validateExperience],
    ];

    form.addEventListener("submit", function (e) {
        // alert the first problem found and stop the submission
        for (const [id, check] of checks) {
            const input = document.getElementById(id);
            const message = check(input.value);
            if (message !== "") {
                e.preventDefault();
                alert(message);
                input.focus();
                return;
            }
        }
    });
});
