# JavaJam Coffee House – Week 7

Two versions of the JavaJam site with the same core behaviour:

- `Case_study_4/` – vanilla HTML/CSS/JS + PHP. Copy the folder into `C:\xampp\htdocs\`, start Apache, open http://localhost/Case_study_4/index.html
- `javajam-react/` – React + React Router + Tailwind CSS (Vite). Run `npm install` then `npm run dev`, open http://localhost:5173

## 1. Core functions (same in both versions)

### Jobs application form
| Field | Rule | Message |
|---|---|---|
| Name | Required | "Name is required." |
| | Letters and spaces only | "Name can only contain letters and spaces." |
| | At least 2 letters | "Name must be at least 2 letters." |
| E-mail | Required | "E-mail is required." |
| | Username starts with a letter; domain has 2–4 parts, last one 2–3 letters | "E-mail format is incorrect (e.g. jane.doe@example.com)." |
| Start Date | Optional | – |
| | Must be **after today** (today and earlier are rejected) | "Start date must be after today." |
| | No more than 12 months ahead | "Start date must be within the next 12 months." |
| Experience | Required | "Please tell us about your experience." |
| | 20–500 characters | "Please write at least 20 characters." |

- The date picker only allows tomorrow through 12 months ahead.
- Dates are compared using the local date, so the "after today" check isn't off by a day near midnight.
- An invalid form is not submitted, and the cursor moves to the first bad field.
- A valid form shows a confirmation page with the submitted details.

### Coffee menu
- **Prices:**
  - Just Java (Endless Cup) $2.00
  - Cafe au Lait: Single $2.00 / Double $3.00
  - Iced Cappuccino: Single $4.75 / Double $5.75
- Quantity must be a whole number from 0 to 99. Otherwise: "Quantity must be a whole number (0 or more)." or "Maximum 99 per item."
- Single or Double must be chosen before a quantity counts. Otherwise: "Please choose Single or Double for <item>."
- Subtotal = price × quantity, and Total = the sum of the subtotals. Both update live as you type or choose a size.
- An invalid line counts as $0.00. All prices show 2 decimals.

### Other pages
- **Home:** the road photo, the four feature bullets, and the address and phone number.
- **Music:** the January (Melanie Morris) and February (Tahoe Greg) performances, each with a photo, description and audio player.

## 2. Vanilla version (`Case_study_4`)

**How it works**
- `formvalidation.js` checks the Jobs form when you click Apply Now. It shows an `alert()` for the first problem, moves the cursor to that field and stops the submission. A valid form posts to `show_post.php`.
- `MenuUpdate.js` recalculates every subtotal and the total on each change. It shows an `alert()` only for the item just changed.
- `show_post.php` shows the submitted application in a table.

**Fixes and improvements**
- **Validation never ran before.** The script loaded in `<head>` before the button existed, so it crashed on load. It's now loaded with `defer` and listens for the form's `submit` event.
- **Invalid forms could still submit.** Returning `false` from a click handler didn't block submission. It now uses `preventDefault()`.
- **Name errors were silent.** An invalid name was rejected with no message. It now shows an alert.
- **Validation rules:** added the stricter rules above (name length, 12-month date limit, 20–500 characters of experience). The date picker also blocks days outside the allowed range.
- **Menu fixes:**
  - Subtotals show 2 decimals.
  - Clearing a quantity resets its subtotal.
  - Quantities are capped at 99.
  - An earlier mistake no longer keeps triggering alerts while other items are edited.
  - Removed a stray `class="subtotal"` on a radio button.
- **Security:** `show_post.php` now escapes submitted values with `htmlspecialchars`, so a visitor can't inject HTML or script into the page.
- **Media:** added the images and audio from Case Study 2.

## 3. React version (`javajam-react`): functional changes

**Built with React's own tools**
- **Jobs:**
  - `useState` holds the form values, which fields have been left ("touched"), and the errors.
  - `useEffect` re-validates the whole form every time a value changes, so validation is real-time.
  - `useRef` lets the form move the cursor to the first invalid field on submit.
- **Menu:**
  - The drinks are defined once as a list (`MENU`), and each card is generated from it.
  - `useState` tracks the chosen size and quantity per item.
  - `useEffect` recalculates the subtotals whenever the order changes.
- **Layout:** `useEffect` sets each page's browser tab title.

**Behaviour**
- **Jobs:** errors appear inline under each field.
  - They show once a field has been left, and update live while typing.
  - On submit, every error shows at once.
  - A summary box at the top shows how many fields need fixing.
  - A character counter appears under Experience.
- **Confirmation page:** shows the submitted details and a readable date such as "Tue, October 20, 2026". Opening it directly without applying redirects to Jobs.
- **Menu:**
  - −/+ buttons change the quantity.
  - Problems show as inline messages, not popups.
  - A "Your Order" summary lists only the items being ordered, and a Clear order button resets everything.
- **Navigation:** React Router `NavLink`s switch pages without reloading the whole site. A mistyped URL goes back to Home.
- **Home and Music:** these were empty placeholders and now have the full content and media.
- **Dev setup:** `vite.config.js` uses file polling so edits show up live when Vite runs in WSL on a Windows drive.

## 4. React version: styling improvements (Tailwind CSS)

1. **One colour palette.**
   - The JavaJam browns are defined once as theme colours, from `roast-50` (cream) to `roast-900` (espresso). This replaces hex codes like `bg-[#c19a6b]` repeated in every file.
   - Fonts are defined once too: Pirata One for the title, Georgia for the text.
   - The original look is kept: the tan header and footer and the dotted border.
2. **A layout that adapts to screen size.**
   - The old `min-w-[800px]` floated layout scrolled sideways on phones. It's now a grid: sidebar and content side by side on desktop, and a horizontal nav bar on top on phones.
   - On phones the outer border is dropped so the content gets the full width.
   - Checked in screenshots at 1280px and 390px wide.
3. **Navigation:** the current page shows as a raised cream "tab", other links get a hover background, and the header title links to Home.
4. **Spacing and type:**
   - Every page heading has the same size and spacing.
   - Paragraph width is limited so lines don't get too long.
   - Spacing is consistent, and content sits on cards with a soft border and shadow.
5. **Jobs form:**
   - Before, labels and inputs ran together on one line with no borders, and the buttons rendered as plain text "ClearApply Now".
   - Now each label sits above a full-width input with rounded corners and a focus ring, and required fields have a red asterisk.
   - Errors get a red border, red text and a summary box, and the experience counter turns green past 20 characters.
   - The Apply Now button is filled and the Clear button is outlined. On phones they stack full-width.
6. **Menu (fixes the width-to-height ratio):**
   - The old 4-column table squeezed descriptions into narrow, tall cells.
   - Each drink is now a wide card: name and price, then the description, then the controls in one row. The size options are a segmented toggle where the chosen one fills dark brown.
   - Quantity has −/+ buttons, and subtotals are right-aligned with digits that line up.
   - A card with a problem gets a red border.
   - The order summary sits beside the menu on desktop and below it on phones, with a large total.
7. **Home:** the photo has rounded corners at a fixed 4:3 shape, next to the feature list. The address is in a highlighted box with a clickable phone number, and there's a "View the Menu" button.
8. **Music:** each month is a card with a coloured month header, a square artist photo, the description and the audio player.
9. **Confirmation page:** a green "Thanks, <first name>!" banner, the details as a clean two-column list, and buttons to Home and the Menu.

## 5. The two versions side by side

| | Vanilla (`Case_study_4`) | React (`javajam-react`) |
|---|---|---|
| Validation rules | Same | Same |
| Error display | `alert()` popup, first error only, on submit | Inline under each field, live, all errors at once |
| Menu feedback | `alert()` popup for the item changed | Inline message and red card border |
| Quantity input | Text box | Text box with −/+ buttons |
| Order summary | Total box | Item list, total and Clear order |
| Form submission | POST to `show_post.php` (needs Apache/PHP) | Client-side route to a confirmation page (no server needed) |
| Layout | Fixed-width table layout | Adapts to desktop and phone |
| Styling | Hand-written `style.css` | Tailwind with a shared colour palette |
