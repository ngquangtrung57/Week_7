import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import Layout from "../components/Layout";

const EMPTY_FORM = {name: "", email: "", startdate: "", experience: ""};
const EXPERIENCE_MIN = 20;
const EXPERIENCE_MAX = 500;

function onlyLettersAndSpace(str){
    return /[a-zA-Z]/.test(str) && /^[A-Za-z\s]+$/.test(str);
}

function isValidEmail(str){
    // username starts with a letter; domain has 2-4 parts, last one 2-3 characters
    return /^[a-zA-Z][\w.-]*@(?:\w+\.){1,3}\w{2,3}$/.test(str);
}

// local date as YYYY-MM-DD (toISOString uses UTC and can be off by a day)
function toDateString(date){
    const pad = n => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function addDays(days){
    const date = new Date();
    date.setDate(date.getDate() + days);
    return toDateString(date);
}

function formatDate(value){
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
        weekday: "short", year: "numeric", month: "long", day: "numeric"
    });
}

function validate(form){
    const errors = {};
    const name = form.name.trim();
    const email = form.email.trim();
    const experience = form.experience.trim();

    if(!name) errors.name = "Name is required.";
    else if(!onlyLettersAndSpace(name)) errors.name = "Name can only contain letters and spaces.";
    else if(name.length < 2) errors.name = "Name must be at least 2 letters.";

    if(!email) errors.email = "E-mail is required.";
    else if(!isValidEmail(email)) errors.email = "E-mail format is incorrect (e.g. jane.doe@example.com).";

    // start date is optional, but if given it must be after today and within a year
    // YYYY-MM-DD strings compare correctly as text
    if(form.startdate){
        if(form.startdate < addDays(1)) errors.startdate = "Start date must be after today.";
        else if(form.startdate > addDays(365)) errors.startdate = "Start date must be within the next 12 months.";
    }

    if(!experience) errors.experience = "Please tell us about your experience.";
    else if(experience.length < EXPERIENCE_MIN) errors.experience = `Please write at least ${EXPERIENCE_MIN} characters.`;

    return errors;
}

function Field({id, label, required, hint, error, children}){
    return (
        <div>
            <label htmlFor={id} className="mb-1 block font-bold text-roast-900">
                {label}
                {required && <span className="ml-0.5 text-red-700" aria-hidden="true">*</span>}
            </label>
            {children}
            {error ? (
                <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-700">{error}</p>
            ) : hint ? (
                <p className="mt-1 text-sm text-roast-600">{hint}</p>
            ) : null}
        </div>
    );
}

function inputClass(hasError){
    return `w-full rounded-md border bg-white px-3 py-2 text-roast-900 placeholder:text-roast-400 focus:outline-none focus:ring-2 ${
        hasError
            ? "border-red-600 focus:ring-red-200"
            : "border-roast-300 focus:border-roast-500 focus:ring-roast-300"
    }`;
}

function Jobs(){
    const navigate = useNavigate();
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});
    const fieldRefs = useRef({});

    // re-validate in real time whenever the form changes
    useEffect(() => {
        setErrors(validate(formData));
    }, [formData]);

    // only show an error once the user has left the field (or tried to submit)
    const visibleError = name => (touched[name] ? errors[name] : "");

    function handleChange(event){
        const {name, value} = event.target;
        setFormData(prev => ({...prev, [name]: value}));
    }

    function handleBlur(event){
        const {name} = event.target;
        setTouched(prev => ({...prev, [name]: true}));
    }

    function handleSubmit(event){
        event.preventDefault();
        const currentErrors = validate(formData);
        setTouched({name: true, email: true, startdate: true, experience: true});

        const firstInvalid = Object.keys(EMPTY_FORM).find(key => currentErrors[key]);
        if(firstInvalid){
            fieldRefs.current[firstInvalid]?.focus();
            return;
        }

        navigate("/application-received", {
            state: {
                name: formData.name.trim(),
                email: formData.email.trim(),
                startdate: formData.startdate ? formatDate(formData.startdate) : "",
                experience: formData.experience.trim()
            }
        });
    }

    function handleReset(){
        setFormData(EMPTY_FORM);
        setTouched({});
    }

    const fieldProps = name => ({
        id: name,
        name,
        value: formData[name],
        onChange: handleChange,
        onBlur: handleBlur,
        ref: el => (fieldRefs.current[name] = el),
        "aria-invalid": Boolean(visibleError(name)),
        "aria-describedby": visibleError(name) ? `${name}-error` : undefined,
        className: inputClass(Boolean(visibleError(name)))
    });

    const experienceLength = formData.experience.trim().length;
    const errorCount = Object.keys(errors).filter(key => touched[key]).length;

    return (
        <Layout title="Jobs at JavaJam">
            <p className="mb-6 max-w-prose leading-relaxed">
                Want to work at JavaJam? Fill out the form below to start your application.
                Required fields are marked with <span className="text-red-700">*</span>.
            </p>

            <form
                noValidate
                onSubmit={handleSubmit}
                onReset={handleReset}
                className="max-w-xl space-y-5 rounded-lg border border-roast-300 bg-roast-50 p-5 shadow-sm sm:p-6"
            >
                {errorCount > 0 && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                        Please fix {errorCount === 1 ? "the highlighted field" : `the ${errorCount} highlighted fields`} below.
                    </div>
                )}

                <Field id="name" label="Name" required error={visibleError("name")}>
                    <input
                        type="text"
                        autoComplete="name"
                        placeholder="Jane Doe"
                        {...fieldProps("name")}
                    />
                </Field>

                <Field id="email" label="E-mail" required error={visibleError("email")}>
                    <input
                        type="email"
                        autoComplete="email"
                        placeholder="jane.doe@example.com"
                        {...fieldProps("email")}
                    />
                </Field>

                <Field
                    id="startdate"
                    label="Start Date"
                    hint={`Optional. Earliest start is ${formatDate(addDays(1))}.`}
                    error={visibleError("startdate")}
                >
                    <input
                        type="date"
                        min={addDays(1)}
                        max={addDays(365)}
                        {...fieldProps("startdate")}
                    />
                </Field>

                <Field id="experience" label="Experience" required error={visibleError("experience")}>
                    <textarea
                        rows={5}
                        maxLength={EXPERIENCE_MAX}
                        placeholder="Tell us about any café, barista or customer service experience."
                        {...fieldProps("experience")}
                    />
                    <div className={`mt-1 text-right text-xs ${
                        experienceLength < EXPERIENCE_MIN ? "text-roast-600" : "text-green-700"
                    }`}>
                        {experienceLength}/{EXPERIENCE_MAX}
                        {experienceLength < EXPERIENCE_MIN && ` (min ${EXPERIENCE_MIN})`}
                    </div>
                </Field>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                    <button
                        type="reset"
                        className="rounded-md border border-roast-400 bg-white px-5 py-2 font-bold text-roast-700 hover:bg-roast-100"
                    >
                        Clear
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-roast-700 px-6 py-2 font-bold text-white shadow-sm hover:bg-roast-800 focus:outline-none focus:ring-2 focus:ring-roast-400 focus:ring-offset-2"
                    >
                        Apply Now
                    </button>
                </div>
            </form>
        </Layout>
    );
}

export default Jobs;
