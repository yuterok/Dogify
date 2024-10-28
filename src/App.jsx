import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import styles from "./app.module.css";

function App() {
  const [data, setData] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [totalCount, setTotalCount] = useState(172);
  const currentPage = useRef(1);
  const containerRef = useRef(null);
  let key = 'live_fvCDb6fEUDpokIzXlLOxGpYDbyM2besMsOemYnu30MUM5wSeLXDZbi39vx3ThwBE'
  // let key = ''
  async function request(url) {
    try {
      let response = await fetch(url, {
        method: 'GET',
        headers: {'x-api-key' : key}
         });
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
      photos.length < totalCount &&
      !fetching
    ) {
      setFetching(true);
    }
  };

  useEffect(() => {
    // request('https://api.thedogapi.com/v1/breeds')
    // .then((result)=>{
    //   setData(result)
    // })
    if (photos.length === 0) {
      setFetching(true);
    }
  }, []);

  useEffect(() => {
    if (fetching) {
      setTimeout(() => {
        request(
          `https://api.thedogapi.com/v1/images/search?has_breeds=1&limit=10&_page=${currentPage.current}`
        ).then((result) => {
          if (result) {
            console.log("начали страница", currentPage.current);
            setPhotos((prevData) => [...prevData, ...result]);
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
  }, [photos]);

  return (
    <div className={styles.App}>
      <header className={styles.container}>
        <h1>Выбери себе собаку: </h1>
        {photos && (
          <div ref={containerRef} id="container" className={styles.data}>
            {photos.map((currentDog) => (
              <div key={currentDog.id} className={styles.dog_item}>
                <p>{currentDog.breeds[0]?.name}</p>
                <img
                  className={styles.photo}
                  src={currentDog.url}
                  alt={currentDog.title}
                />
                <p>{currentDog.breeds[0]?.temperament}</p>
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
