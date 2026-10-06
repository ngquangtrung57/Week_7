const MAX_QUANTITY = 99;

// prefix matches the input names, e.g. "java-quantity", "cafe-price"
const ITEMS = [
    {prefix: "java", name: "Just Java", fixedPrice: 2.0},
    {prefix: "cafe", name: "Cafe au Lait"},
    {prefix: "cappuccino", name: "Iced Cappuccino"}
];

function field(name) {
    return document.querySelector('input[name="' + name + '"]');
}

// returns the line subtotal, or 0 if the line is invalid
// alerts the problem only for the item the user just changed
function getSubtotal(item, changedItem) {
    'use strict';
    const raw = field(item.prefix + "-quantity").value.trim();
    const checked = document.querySelector('input[name="' + item.prefix + '-price"]:checked');
    const price = item.fixedPrice ?? (checked ? Number(checked.value) : null);

    const quantity = Number(raw);
    let message = "";

    if (!/^\d*$/.test(raw)) message = "Quantity must be a whole number (0 or more).";
    else if (quantity > MAX_QUANTITY) message = "Maximum " + MAX_QUANTITY + " per item.";
    else if (quantity > 0 && price === null) message = "Please choose Single or Double for " + item.name + ".";

    if (message !== "") {
        if (item === changedItem) alert(message);
        return 0;
    }
    return price === null ? 0 : price * quantity;
}

function updateMenu(changedItem) {
    'use strict';
    let total = 0;
    ITEMS.forEach(function (item) {
        const subtotal = getSubtotal(item, changedItem);
        field(item.prefix + "-subtotal").value = subtotal.toFixed(2);
        total += subtotal;
    });
    field("total-price").value = total.toFixed(2);
}

ITEMS.forEach(function (item) {
    document.querySelectorAll('input[name="' + item.prefix + '-quantity"], input[name="' + item.prefix + '-price"]')
        .forEach(function (input) {
            input.addEventListener("input", function () {
                updateMenu(item);
            });
        });
});
updateMenu();
