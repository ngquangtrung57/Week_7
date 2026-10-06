import {useEffect, useState} from "react";
import Layout from "../components/Layout";

const MAX_QUANTITY = 99;

const MENU = [
    {
        id: "java",
        name: "Just Java",
        description: "Regular house blend, decaffeinated coffee, or flavor of the day.",
        options: [{label: "Endless Cup", price: 2.0}]
    },
    {
        id: "cafe",
        name: "Cafe au Lait",
        description: "House blended coffee infused into a smooth, steamed milk.",
        options: [{label: "Single", price: 2.0}, {label: "Double", price: 3.0}]
    },
    {
        id: "cappuccino",
        name: "Iced Cappuccino",
        description: "Sweetened espresso blended with icy-cold milk and served in a chilled glass.",
        options: [{label: "Single", price: 4.75}, {label: "Double", price: 5.75}]
    }
];

// items with a single price need no size choice
const INITIAL_ORDER = Object.fromEntries(
    MENU.map(item => [item.id, {option: item.options.length === 1 ? 0 : null, quantity: "0"}])
);

const money = value => `$${value.toFixed(2)}`;

// returns an error message, or "" if the line is valid
function lineError(item, line){
    if(!/^\d*$/.test(line.quantity)) return "Quantity must be a whole number (0 or more).";
    const quantity = Number(line.quantity);
    if(quantity > MAX_QUANTITY) return `Maximum ${MAX_QUANTITY} per item.`;
    if(quantity > 0 && line.option === null) return `Please choose Single or Double for ${item.name}.`;
    return "";
}

function Menu(){
    const [order, setOrder] = useState(INITIAL_ORDER);
    const [subtotals, setSubtotals] = useState({});

    // recompute every subtotal automatically whenever a size or quantity changes
    useEffect(() => {
        setSubtotals(Object.fromEntries(MENU.map(item => {
            const line = order[item.id];
            if(lineError(item, line) || line.option === null) return [item.id, 0];
            return [item.id, item.options[line.option].price * Number(line.quantity || 0)];
        })));
    }, [order]);

    const total = Object.values(subtotals).reduce((sum, value) => sum + value, 0);
    const itemCount = MENU.reduce((sum, item) =>
        sum + (subtotals[item.id] ? Number(order[item.id].quantity) : 0), 0);

    function updateLine(id, changes){
        setOrder(prev => ({...prev, [id]: {...prev[id], ...changes}}));
    }

    function step(id, delta){
        const current = Number(order[id].quantity) || 0;
        const next = Math.min(MAX_QUANTITY, Math.max(0, current + delta));
        updateLine(id, {quantity: String(next)});
    }

    return (
        <Layout title="Coffee at JavaJam">
            <p className="mb-6 max-w-prose leading-relaxed">
                Choose a size and quantity. Your subtotal and total update as you go.
            </p>

            <div className="grid gap-6 lg:grid-cols-[1fr_260px] lg:items-start">
                <ul className="m-0 list-none space-y-4 p-0">
                    {MENU.map(item => {
                        const line = order[item.id];
                        const error = lineError(item, line);
                        const subtotal = subtotals[item.id] || 0;

                        return (
                            <li
                                key={item.id}
                                className={`rounded-lg border bg-roast-50 p-4 shadow-sm sm:p-5 ${
                                    error ? "border-red-300" : "border-roast-300"
                                }`}
                            >
                                <div className="flex items-baseline justify-between gap-3">
                                    <h3 className="m-0 text-lg font-bold text-roast-900">{item.name}</h3>
                                    <span className="whitespace-nowrap text-sm text-roast-600">
                                        {item.options.length === 1
                                            ? money(item.options[0].price)
                                            : `from ${money(item.options[0].price)}`}
                                    </span>
                                </div>
                                <p className="mt-1 mb-4 text-roast-700">{item.description}</p>

                                <div className="flex flex-wrap items-end justify-between gap-4">
                                    <fieldset className="m-0 border-0 p-0">
                                        <legend className="mb-1 text-xs font-bold tracking-wide text-roast-600 uppercase">
                                            Size
                                        </legend>
                                        <div className="inline-flex overflow-hidden rounded-md border border-roast-400">
                                            {item.options.map((option, index) => {
                                                const selected = line.option === index;
                                                return (
                                                    <label
                                                        key={option.label}
                                                        className={`cursor-pointer px-3 py-1.5 text-sm not-last:border-r not-last:border-roast-400 ${
                                                            selected
                                                                ? "bg-roast-700 text-white"
                                                                : "bg-white text-roast-800 hover:bg-roast-200"
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`${item.id}-size`}
                                                            className="sr-only"
                                                            checked={selected}
                                                            onChange={() => updateLine(item.id, {option: index})}
                                                        />
                                                        {option.label} {money(option.price)}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </fieldset>

                                    <div className="flex items-end gap-5">
                                        <div>
                                            <label
                                                htmlFor={`${item.id}-quantity`}
                                                className="mb-1 block text-xs font-bold tracking-wide text-roast-600 uppercase"
                                            >
                                                Quantity
                                            </label>
                                            <div className="inline-flex overflow-hidden rounded-md border border-roast-400 bg-white">
                                                <button
                                                    type="button"
                                                    aria-label={`Decrease ${item.name}`}
                                                    onClick={() => step(item.id, -1)}
                                                    className="w-8 text-lg text-roast-700 hover:bg-roast-200"
                                                >
                                                    −
                                                </button>
                                                <input
                                                    id={`${item.id}-quantity`}
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={line.quantity}
                                                    onChange={event => updateLine(item.id, {quantity: event.target.value.trim()})}
                                                    className="w-12 border-x border-roast-300 py-1.5 text-center focus:outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    aria-label={`Increase ${item.name}`}
                                                    onClick={() => step(item.id, 1)}
                                                    className="w-8 text-lg text-roast-700 hover:bg-roast-200"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="min-w-[80px] text-right">
                                            <div className="mb-1 text-xs font-bold tracking-wide text-roast-600 uppercase">
                                                Subtotal
                                            </div>
                                            <div className="py-1.5 text-lg font-bold text-roast-900 tabular-nums">
                                                {money(subtotal)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <p role="alert" className="mt-3 mb-0 text-sm text-red-700">{error}</p>
                                )}
                            </li>
                        );
                    })}
                </ul>

                <aside className="rounded-lg border border-roast-300 bg-roast-50 p-5 shadow-sm lg:sticky lg:top-6">
                    <h3 className="m-0 mb-3 text-lg font-bold text-roast-900">Your Order</h3>

                    {itemCount === 0 ? (
                        <p className="m-0 text-sm text-roast-600">No items yet.</p>
                    ) : (
                        <ul className="m-0 list-none space-y-1 p-0 text-sm">
                            {MENU.filter(item => subtotals[item.id] > 0).map(item => {
                                const line = order[item.id];
                                return (
                                    <li key={item.id} className="flex justify-between gap-2">
                                        <span>
                                            {line.quantity} × {item.name}
                                            {item.options.length > 1 && ` (${item.options[line.option].label})`}
                                        </span>
                                        <span className="tabular-nums">{money(subtotals[item.id])}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    <div className="mt-4 flex items-baseline justify-between border-t border-roast-300 pt-3">
                        <span className="font-bold">Total price</span>
                        <span className="text-2xl font-bold text-roast-900 tabular-nums">{money(total)}</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setOrder(INITIAL_ORDER)}
                        disabled={itemCount === 0}
                        className="mt-4 w-full rounded-md border border-roast-400 bg-white px-4 py-2 text-sm font-bold text-roast-700 hover:bg-roast-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Clear order
                    </button>
                </aside>
            </div>
        </Layout>
    );
}

export default Menu;
