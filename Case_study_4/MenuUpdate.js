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

function showError(item, message) {
    const err = document.getElementById(item.prefix + "-error");
    err.textContent = message;
    field(item.prefix + "-quantity").classList.toggle("invalid", message !== "");
}

// returns the line subtotal, or 0 (with an error shown) if the line is invalid
function getSubtotal(item) {
    'use strict';
    const raw = field(item.prefix + "-quantity").value.trim();
    const checked = document.querySelector('input[name="' + item.prefix + '-price"]:checked');
    const price = item.fixedPrice ?? (checked ? Number(checked.value) : null);

    if (!/^\d*$/.test(raw)) {
        showError(item, "Quantity must be a whole number (0 or more).");
        return 0;
    }
    const quantity = Number(raw);
    if (quantity > MAX_QUANTITY) {
        showError(item, "Maximum " + MAX_QUANTITY + " per item.");
        return 0;
    }
    if (quantity > 0 && price === null) {
        showError(item, "Please choose Single or Double for " + item.name + ".");
        return 0;
    }
    showError(item, "");
    return price === null ? 0 : price * quantity;
}

function updateMenu() {
    'use strict';
    let total = 0;
    ITEMS.forEach(function (item) {
        const subtotal = getSubtotal(item);
        field(item.prefix + "-subtotal").value = subtotal.toFixed(2);
        total += subtotal;
    });
    field("total-price").value = total.toFixed(2);
}

ITEMS.forEach(function (item) {
    document.querySelectorAll('input[name="' + item.prefix + '-quantity"], input[name="' + item.prefix + '-price"]')
        .forEach(function (input) {
            input.addEventListener("input", updateMenu);
        });
});
updateMenu();
