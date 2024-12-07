import { deleteData, editData } from "../../services/data/actions";
import styles from "./dog-item.module.css";
import { FC, useState } from "react";
import { IconButton, Input, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IDog } from "../../utils/types";
import { useAppDispatch } from "../../services/store";
import { ModalDog } from "../modal/modal";

interface DogItemProps {
  dog: IDog;
}

export const DogItem: FC<DogItemProps> = ({ dog }) => {
  const dispatch = useAppDispatch();

  const [isModal, setModal] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(dog.breeds[0]?.name);
  const handleOpen = () => setModal(true);
  const deleteDog = () => {
    dispatch(deleteData(dog.id));
  };
  const editDog = () => {
    if (isEditing) {
      dispatch(editData(dog.id, newName));
    }
    setIsEditing(!isEditing);
  };
  return (
    <Card
      elevation={0}
      sx={{ p: 2, pt: 3, position: "relative", borderRadius: "15px" }}
    >
      <div className={styles.buttons}>
        <IconButton onClick={editDog} sx={{}}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={deleteDog} sx={{ p: 0 }}>
          <DeleteIcon />
        </IconButton>
      </div>
      {isEditing ? (
        <Input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              editDog();
            }
          }}
          sx={{
            fontSize: { xs: "1.25rem", sm: "1.3118rem", md: "1.4993rem" },
            mb: 1,
          }}
        />
      ) : (
        <Typography sx={{ mb: 2 }} variant="h5" data-testid="dog-name">
          {dog.breeds[0]?.name}
        </Typography>
      )}
      <CardMedia
        onClick={handleOpen}
        sx={{
          height: 300,
          borderRadius: "15px",
          "&:hover": { cursor: "pointer" },
        }}
        image={dog.url}
      />
      <Typography sx={{ mt: 2, mb: 1, lineHeight: 1.2 }}>
        <b>Temperament:</b> {dog.breeds[0]?.temperament}
      </Typography>
      <Typography>
        <b>Weight:</b> {dog.breeds[0]?.weight.metric} kg
      </Typography>
      {isModal && <ModalDog dog={dog} setModal={setModal} />}
    </Card>
  );
};
