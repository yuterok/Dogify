import { useEffect, useState, useRef } from "react";
import styles from "./app.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../services/data/actions";
import { DogItem } from "../dog-item/dog-item";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Preloader } from "../preloader/preloader";

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
  }, [dogs]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) container.addEventListener("scroll", scrollHandler);

    return () => {
      if (container) container.removeEventListener("scroll", scrollHandler);
    };
  }, [dataRequest]);

  const sortedDogs = sortData(dogs);

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 0 },
      }}
      className={styles.container}
    >
      <Typography
        variant="h2"
        sx={{
          mb: 2,
          fontWeight: 700,
          textShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
          color: "white",
        }}
      >
        Choose your dog
      </Typography>
      {sortedDogs && (
        <div className={styles.outer}>
          <Box
            sx={{
              width: { xs: 1, sm: "60vw", md: 500 },
            }}
            ref={containerRef}
            className={styles.inner}
          >
            {sortedDogs.length > 0 && (
              <FormControl size="small">
                <InputLabel>Sort</InputLabel>
                <Select
                  label="Sort"
                  onChange={(e) => setSortField(e.target.value)}
                  sx={{ mb: 2, borderRadius: "15px" }}
                  value={sortField}
                >
                  <MenuItem value="none">No sorting</MenuItem>
                  <MenuItem value="name">By name</MenuItem>
                  <MenuItem value="weight">By weight</MenuItem>
                </Select>
              </FormControl>
            )}

            {sortedDogs.map((currentDog) => (
              <DogItem key={currentDog.id} dog={currentDog} />
            ))}
            {dataRequest && <Preloader />}
            {dataFailed && (
              <Typography>Error loading data, try again later</Typography>
            )}
          </Box>
        </div>
      )}
      <Typography variant="body2" sx={{ position: "absolute", bottom: "5px" }}>
        Julia Tereschenko ♡ 2024
      </Typography>
    </Box>
  );
}

export default App;
