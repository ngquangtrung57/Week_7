import {useEffect} from "react";
import Header from "./Header";
import Navigation from "./Navigation";
import Footer from "./Footer";

function Layout({title, children}){
    useEffect(() => {
        document.title = title ? `${title} | JavaJam Coffee House` : "JavaJam Coffee House";
    }, [title]);

    return (
        <div className="mx-auto my-0 max-w-5xl overflow-hidden bg-roast-100 shadow-lg sm:my-6 sm:rounded-xl sm:border-4 sm:border-dotted sm:border-roast-500">
            <Header />

            <div className="md:grid md:grid-cols-[170px_1fr]">
                <Navigation />

                <main className="min-h-[420px] px-5 py-6 sm:px-8">
                    {title && (
                        <h2 className="mb-4 text-2xl font-bold text-roast-900">{title}</h2>
                    )}
                    {children}
                </main>
            </div>

            <Footer />
        </div>
    );
}

export default Layout;
