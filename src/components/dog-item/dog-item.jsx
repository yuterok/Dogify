import { useDispatch } from "react-redux";
import { deleteData, editData } from "../../services/data/actions";
import styles from "./dog-item.module.css";
import { useState } from "react";

export const DogItem = (dog) => {
  const dispatch = useDispatch();
  const currentDog = dog.dog;

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(currentDog.breeds[0]?.name);

  const deleteDog = () => {
    dispatch(deleteData(currentDog.id));
  };
  const editDog = () => {
    if (isEditing) {
      dispatch(editData(currentDog.id, newName));
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className={styles.dog_item}>
      <button onClick={deleteDog}>Удалить</button>
      <button onClick={editDog}>
        {isEditing ? "Сохранить" : "Редактировать"}
      </button>
      {isEditing ? (
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className={styles.input}
        />
      ) : (
        <p className={styles.text}>{currentDog.breeds[0]?.name}</p>
      )}
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
