// pages/index.js
import Head from 'next/head';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen bg-[#111827]">
      <Head>
        <title>MapX || Kvj Harsha</title>
        <meta name="description" content="A map search application using Next.js and Leaflet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center py-10">
        <h1 className="text-2xl font-bold mb-6 text-white">MapX || Kvj Harsha</h1>
        <Map />
      </main>
    </div>
  );
}
