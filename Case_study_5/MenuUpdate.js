const MAX_QUANTITY = 99;

function field(name) {
    return document.querySelector('input[name="' + name + '"]');
}

function getSubtotal(itemPrefix, itemName, hasFixedPrice) {
    'use strict';
    const raw = field(itemPrefix + "-quantity").value.trim();
    const checked = document.querySelector('input[name="' + itemPrefix + '-price"]:checked');
    
    // Read fixed price from JS state or dynamically from radio selection
    let price = null;
    if (hasFixedPrice) {
        // Reads Just Java fixed price directly if assigned, default to 2.00
        price = 2.0; 
    } else if (checked) {
        price = Number(checked.value);
    }

    const quantity = Number(raw);
    let message = "";

    if (raw === "" || !/^\d+$/.test(raw)) {
        message = "Quantity must be a whole number (0 or more).";
    }
    else if (quantity > MAX_QUANTITY) {
        message = "Maximum " + MAX_QUANTITY + " per item.";
    }
    else if (quantity > 0 && price === null) {
        message = "Please choose Single or Double for " + itemName + ".";
    }

    if (message !== "") {
        return [0, true, message];
    }

    return [price === null ? 0 : price * quantity, false, ""];
}

function syncShotTypes() {
    ['cafe', 'cappuccino'].forEach(prefix => {
        const checked = document.querySelector(`input[name="${prefix}-price"]:checked`);
        const typeInput = document.getElementById(`${prefix}-type`);
        if (typeInput) {
            typeInput.value = checked ? checked.dataset.type : "";
        }
    });
}

function updateMenu(changedPrefix) {
    'use strict';
    const items = [
        { prefix: "java", name: "Just Java", fixed: true },
        { prefix: "cafe", name: "Cafe au Lait", fixed: false },
        { prefix: "cappuccino", name: "Iced Cappuccino", fixed: false }
    ];

    let total = 0;
    let isInvalid = false;

    items.forEach(function (item) {
        const [subtotal, itemInvalid, message] = getSubtotal(item.prefix, item.name, item.fixed);
        
        if (item.prefix === changedPrefix && message !== "") {
            alert(message);
        }

        field(item.prefix + "-subtotal").value = subtotal.toFixed(2);
        total += subtotal;
        if (itemInvalid) {
            isInvalid = true;
        }
    });

    field("total-price").value = total.toFixed(2);
    return [total, isInvalid];
}

['java', 'cafe', 'cappuccino'].forEach(function (prefix) {
    document.querySelectorAll(`input[name="${prefix}-quantity"], input[name="${prefix}-price"]`)
        .forEach(function (input) {
            input.addEventListener("input", function () {
                updateMenu(prefix);
            });
        });
});

updateMenu();

const form = document.getElementById("menu-form");
const formMessage = document.getElementById("form-message");

form.addEventListener("submit", function (event) {
    formMessage.textContent = "";
    syncShotTypes();

    const [totalPrice, isInvalid] = updateMenu();

    if (isInvalid) {
        event.preventDefault();
        event.stopPropagation();
        formMessage.textContent = "Please correct invalid field(s).";
        return false;
    } 

    if (totalPrice === 0) {
        event.preventDefault();
        event.stopPropagation();
        formMessage.textContent = "Order cannot be empty.";
        return false;
    }
});