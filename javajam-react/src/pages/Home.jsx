import {Link} from "react-router-dom";
import Layout from "../components/Layout";

const features = [
    "Specialty Coffee and Tea",
    "Bagels, Muffins, and Organic Snacks",
    "Music and Poetry Readings",
    "Open Mic Night Every Friday"
];

function Home(){
    return (
        <Layout title="Follow the Winding Road to JavaJam">
            <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-center">
                <img
                    src="/images/home-road.jpg"
                    alt="Winding forest road leading to JavaJam Coffee House"
                    className="aspect-[4/3] w-full rounded-lg object-cover shadow-md"
                />

                <div>
                    <ul className="m-0 mb-5 list-none space-y-2 p-0">
                        {features.map(feature => (
                            <li key={feature} className="flex gap-2">
                                <span aria-hidden="true">☕</span>
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <address className="mb-5 rounded-md border-l-4 border-roast-500 bg-roast-50 px-4 py-3 not-italic leading-relaxed">
                        54321 Route 42<br />
                        Ellison Bay, WI 54210<br />
                        <a href="tel:8885558888" className="text-roast-700 underline">888-555-8888</a>
                    </address>

                    <Link
                        to="/menu"
                        className="inline-block rounded-md bg-roast-700 px-5 py-2 font-bold text-white no-underline hover:bg-roast-800"
                    >
                        View the Menu
                    </Link>
                </div>
            </div>

            <p className="mt-6 mb-0 text-xs text-roast-600">
                Road photo courtesy of{" "}
                <a href="https://loremflickr.com/" target="_blank" rel="noopener" className="underline">LoremFlickr</a>.
            </p>
        </Layout>
    );
}

export default Home;
