import { useEffect, useState, useRef } from "react";
import "./App.css";
import styles from "./app.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "./services/data/actions";
import { DogItem } from "./components/dog-item/dog-item";

function App() {
  const [sortField, setSortField] = useState("");
  const currentPage = useRef(1);
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const dogs = useSelector((state) => state.data.dogs);
  const { dataRequest, dataFailed, totalCount } = useSelector(
    (state) => state.data
  );

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
      dogs.length < totalCount &&
      !dataRequest
    ) {
      fetchDogs();
    }
  };

  const fetchDogs = () => {
    dispatch(fetchData(currentPage.current));
    currentPage.current += 1;
  };

  useEffect(() => {
    if (dogs.length === 0) {
      fetchDogs();
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) container.addEventListener("scroll", scrollHandler);

    return () => {
      if (container) container.removeEventListener("scroll", scrollHandler);
    };
  }, [dataRequest]);

  const sortedDogs = sortData(dogs);

  return (
    <div className={styles.App}>
      <header className={styles.container}>
        <h3>Выбери себе собаку</h3>
        <span className={styles.text}>Сортировка: </span>
        <select onChange={(e) => setSortField(e.target.value)}>
          <option value="none"> </option>
          <option value="name">По алфавиту</option>
          <option value="weight">По весу</option>
        </select>
        {sortedDogs && (
          <div ref={containerRef} id="container" className={styles.data}>
            {sortedDogs.map((currentDog) => (
              <DogItem key={currentDog.id}dog={currentDog}/>
            ))}
            {dataRequest && <div className={styles.loader}>Loading...</div>}
            {dataFailed && (
              <div className={styles.loader}>
                Ошибка загрузки данных, попробуйте позже
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
