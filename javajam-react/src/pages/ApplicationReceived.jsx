import {useLocation, Navigate, Link} from "react-router-dom";
import Layout from "../components/Layout";

function ApplicationReceived(){
    const location = useLocation();
    const formData = location.state;

    if(!formData){
        return <Navigate to="/jobs" replace />;
    }

    const rows = [
        ["Name", formData.name],
        ["E-mail", formData.email],
        ["Start Date", formData.startdate || "Not specified"],
        ["Experience", formData.experience]
    ];

    return (
        <Layout title="Thank You for Applying">
            <div className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-800">
                Thanks, {formData.name.split(" ")[0]}! We received your application and will be in touch at{" "}
                <strong>{formData.email}</strong>.
            </div>

            <dl className="max-w-xl divide-y divide-roast-300 overflow-hidden rounded-lg border border-roast-300 bg-roast-50">
                {rows.map(([label, value]) => (
                    <div key={label} className="grid gap-1 px-4 py-3 sm:grid-cols-[130px_1fr]">
                        <dt className="font-bold text-roast-900">{label}</dt>
                        <dd className="m-0 whitespace-pre-wrap break-words">{value}</dd>
                    </div>
                ))}
            </dl>

            <div className="mt-6 flex gap-3">
                <Link to="/" className="rounded-md bg-roast-700 px-5 py-2 font-bold text-white no-underline hover:bg-roast-800">
                    Back to Home
                </Link>
                <Link to="/menu" className="rounded-md border border-roast-400 bg-white px-5 py-2 font-bold text-roast-700 no-underline hover:bg-roast-100">
                    See the Menu
                </Link>
            </div>
        </Layout>
    );
}

export default ApplicationReceived;
