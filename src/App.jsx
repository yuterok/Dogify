import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import styles from "./app.module.css";

function App() {
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const currentPage = useRef(1);
  const containerRef = useRef(null);

  async function request(url) {
    try {
      let response = await fetch(url);
      if (response.ok) {
        const totalCountHeader = response.headers.get("x-total-count");
        if (totalCountHeader) setTotalCount(Number(totalCountHeader));

        const json = await response.json();
        return json;
      } else {
        console.error("HTTP Error: " + response.status);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  const scrollHandler = () => {
    const container = containerRef.current;
    if (
      container.scrollHeight - (container.scrollTop + window.innerHeight) <
        100 &&
      data.length < totalCount &&
      !fetching
    ) {
      setFetching(true);
    }
  };

  useEffect(() => {
    if (data.length === 0) {
      setFetching(true);
    }
  }, []);

  useEffect(() => {
    if (fetching) {
      setTimeout(() => {
        request(
          `https://jsonplaceholder.typicode.com/photos?_limit=10&_page=${currentPage.current}`
        ).then((result) => {
          if (result) {
            console.log("начали страница", currentPage.current);
            setData((prevData) => [...prevData, ...result]);
            currentPage.current += 1;
            setFetching(false);
            console.log("закончили");
          }
        });
      }, 1000);
    }
  }, [fetching]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) container.addEventListener("scroll", scrollHandler);

    return () => {
      if (container) container.removeEventListener("scroll", scrollHandler);
    };
  }, [data]);

  return (
    <div className={styles.App}>
      <header className={styles.container}>
        {data && (
          <div ref={containerRef} id="container" className={styles.data}>
            {data.map((item) => (
              <div key={item.id} className={styles.photoItem}>
                <p>{item.id}</p>
                <img
                  className={styles.photo}
                  src={item.thumbnailUrl}
                  alt={item.title}
                />
              </div>
            ))}
            {fetching && <div className={styles.loader}>Loading...</div>}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
