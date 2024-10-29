import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import styles from "./app.module.css";

function App() {
  const [photos, setPhotos] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [totalCount, setTotalCount] = useState(172);
  const [sortField, setSortField] = useState("");
  const currentPage = useRef(1);
  const containerRef = useRef(null);
  let key =
    "live_fvCDb6fEUDpokIzXlLOxGpYDbyM2besMsOemYnu30MUM5wSeLXDZbi39vx3ThwBE";
  async function request(url) {
    try {
      let response = await fetch(url, {
        method: "GET",
        headers: { "x-api-key": key },
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

  const sortData = (data) => {
    const uniqueData = data.filter(
      (obj, idx, arr) => idx === arr.findIndex((t) => t.id === obj.id)
    );
    if (sortField === "name") {
      return uniqueData.sort((a, b) =>
        a.breeds[0].name.localeCompare(b.breeds[0].name)
      );
    } else if (sortField === "weight") {
      return uniqueData.sort(
        (a, b) =>
          parseInt(a.breeds[0].weight.metric.split(" - ")[0], 10) -
          parseInt(b.breeds[0]?.weight.metric.split(" - ")[0], 10)
      );
    }
    return uniqueData;
  };

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

  const fetchData = () => {
    request(
      `https://api.thedogapi.com/v1/images/search?has_breeds=1&limit=10&_page=${currentPage.current}`
    ).then((result) => {
      if (result) {
        const sortedData = sortData([...photos, ...result]);
        setPhotos(sortedData);
        currentPage.current += 1;
        setFetching(false);
      }
    });
  };
  useEffect(() => {
    if (photos.length === 0) {
      setFetching(true);
    }
  }, []);

  useEffect(() => {
    if (fetching) {
      fetchData();
    }
  }, [fetching]);

  useEffect(() => {
    setPhotos((prevData) => sortData(prevData));
  }, [sortField]);

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
        <select onChange={(e) => setSortField(e.target.value)}>
          <option value="name"> </option>
          <option value="name">Сортировка по алфавиту</option>
          <option value="weight">Сортировка по весу</option>
        </select>
        {photos && (
          <div ref={containerRef} id="container" className={styles.data}>
            {photos.map((currentDog) => (
              <div key={currentDog.id} className={styles.dog_item}>
                <p className={styles.text}>{currentDog.breeds[0]?.name}</p>
                <img
                  className={styles.photo}
                  src={currentDog.url}
                  alt={currentDog.title}
                />
                <p className={styles.text}>
                  {currentDog.breeds[0]?.temperament}
                </p>
                <p className={styles.text}>
                  Вес: {currentDog.breeds[0]?.weight.metric} кг
                </p>
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
