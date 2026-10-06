import Layout from "../components/Layout";

const performances = [
    {
        month: "January",
        artist: "Melanie Morris",
        image: "/images/artist-january.jpg",
        audio: "/audio/january.mp3",
        blurb: "Melanie Morris entertains with her melodic folk style."
    },
    {
        month: "February",
        artist: "Tahoe Greg",
        image: "/images/artist-february.jpg",
        audio: "/audio/february.mp3",
        blurb: "Tahoe Greg is back from his tour. New songs. New stories."
    }
];

function Music(){
    return (
        <Layout title="Music at JavaJam">
            <p className="mb-6 max-w-prose leading-relaxed">
                The first Friday night each month at JavaJam is a special night. Join us from 8pm to 11pm
                for some music you won't want to miss.
            </p>

            <div className="space-y-5">
                {performances.map(show => (
                    <article
                        key={show.month}
                        className="overflow-hidden rounded-lg border border-roast-300 bg-roast-50 shadow-sm"
                    >
                        <h3 className="m-0 bg-roast-400 px-4 py-2 text-sm font-bold tracking-widest text-roast-900 uppercase">
                            {show.month}
                        </h3>
                        <div className="grid gap-4 p-4 sm:grid-cols-[160px_1fr] sm:items-center">
                            <img
                                src={show.image}
                                alt={show.artist}
                                className="aspect-square w-full max-w-[200px] rounded-md object-cover sm:max-w-none"
                            />
                            <div>
                                <p className="m-0 text-lg font-bold text-roast-900">{show.artist}</p>
                                <p className="mt-1 mb-2">{show.blurb}</p>
                                <p className="mt-0 mb-3 font-bold">CDs are available now!</p>
                                <audio controls src={show.audio} className="w-full max-w-sm">
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <p className="mt-6 mb-0 text-xs text-roast-600">
                Artist photos courtesy of{" "}
                <a href="https://loremflickr.com/" target="_blank" rel="noopener" className="underline">LoremFlickr</a>;
                audio samples courtesy of{" "}
                <a href="https://www.soundhelix.com/" target="_blank" rel="noopener" className="underline">SoundHelix</a>.
            </p>
        </Layout>
    );
}

export default Music;
