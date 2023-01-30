import { Poppins } from "@next/font/google";
import clsx from "clsx";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Github from "../components/GitHub";

const poppins = Poppins({ weight: "800", subsets: ["latin"] });

const Home: NextPage = () => {
  const [article, setArticle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");

  console.log({ article });
  console.log({ summary });

  const generateSummary = async () => {
    const response = await fetch("/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: article }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setSummary((prev) => prev + chunkValue);
    }
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto pt-20 min-h-screen">
      <Head>
        <title>News summarizer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-between">
        <Link className="flex items-center space-x-3" href="/">
          <Image src="/edit.png" alt="logo" width={34} height={34} />
          <h2 className={clsx("text-3xl", poppins.className)}>
            <span className="text-green-500">News</span> summarizer.
          </h2>
        </Link>
        <a
          href="https://github.com/Nutlope?tab=repositories"
          rel="noreferrer noopener"
          target="_blank"
        >
          <Github />
        </a>
      </div>
      <main className="flex flex-col max-w-5xl mx-auto justify-center content-center mt-20 flex-1">
        <h1 className="max-w-5xl text-3xl sm:text-7xl font-bold text-center">
          Summarize any <span className="text-green-500">TechCrunch</span>{" "}
          article in seconds
        </h1>
        <p className="text-xl sm:text-2xl mt-10 text-center">
          Copy and paste any <span className="text-green-500">TechCrunch </span>
          article link below.
        </p>
        <input
          type="text"
          value={article}
          onChange={(e) => setArticle(e.target.value)}
          className="bg-black border mx-auto sm:mt-10 mt-7 p-3 border-gray-500 rounded-lg w-3/4 outline-white outline-1"
          placeholder="https://techcrunch.com/2023/01/23/spotify-cuts-6-of-its-workforce-impacting-600-people/"
        />
        <button
          className="bg-green-500 mx-auto w-1/3 sm:mt-10 mt-7 p-3 border-gray-500 rounded-2xl z-10 font-bold text-lg hover:bg-green-400 transition"
          onClick={generateSummary}
        >
          Summarize
        </button>
        {summary && (
          <div>
            <h2 className="text-3xl sm:text-5xl mt-12 text-center font-bold">
              Summary
            </h2>
            <p className="mt-6 max-w-3xl mx-auto text-lg leading-7">
              {summary}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;