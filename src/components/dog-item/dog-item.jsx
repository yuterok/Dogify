import { useDispatch } from "react-redux";
import { deleteData } from "../../services/data/actions";
import styles from "./dog-item.module.css";

export const DogItem = (dog) => {
  const currentDog = dog.dog;
  const dispatch = useDispatch();

  const deleteDog = () => {
    dispatch(deleteData(currentDog.id));
  };

  return (
    <div className={styles.dog_item}>
      <button onClick={deleteDog}>Удалить</button>
      <p className={styles.text}>{currentDog.breeds[0]?.name}</p>
      <img
        className={styles.photo}
        src={currentDog.url}
        alt={currentDog.title}
      />
      <p className={styles.text}>{currentDog.breeds[0]?.temperament}</p>
      <p className={styles.text}>
        Вес: {currentDog.breeds[0]?.weight.metric} кг
      </p>
    </div>
  );
};
