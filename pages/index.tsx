import { TroveSearchResult } from "@src/troveHelpers";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import axios from "axios";

const Home: NextPage = () => {
  const [searchResults, setSearchResults] = useState<TroveSearchResult>();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className={styles.container}>
      <Head>
        <title>Trove Search Helper</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Trove Search Test</h1>
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => {
              axios
                .get("/api/trove/search", {
                  params: {
                    query: searchTerm,
                  },
                })
                .then((res) => {
                  setSearchResults(res.data);
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            Search
          </button>
        </div>
        {searchResults && (
          <div>
            <h2>Results</h2>
            {searchResults.response.zone.map((zone) => (
              <div key={zone.name}>
                <h3>{zone.name}</h3>
                <div>
                  {zone.records.work.map((work) => (
                    <div key={work.id}>
                      <h4>
                        {typeof work.title === "string"
                          ? work.title
                          : work.title.value}
                      </h4>
                      <div>
                        {work.category && <p>category: {work.category}</p>}
                        {work.snippet && (
                          <div>
                            {typeof work.snippet === "string" ? (
                              <p>work.snippet</p>
                            ) : (
                              work.snippet.map((s) => <p>{s}</p>)
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
