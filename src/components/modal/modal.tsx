import { Modal } from "@mui/material";
import styles from "./modal.module.css";
import { FC, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Typography } from "@mui/material";
import ConfettiExplosion from "react-confetti-explosion";
import frame from "../../img/frame.png";
import { IDog } from "../../utils/types";

interface ModalProps {
  dog: IDog;
  setModal(isModal: boolean): void;
}

export const ModalDog: FC<ModalProps> = ({ dog, setModal }) => {
  const [isExploding, setIsExploding] = useState<boolean>(false);
  const handleClose = () => {
    setModal(false);
  };
  useEffect(() => {
    setIsExploding(true);
  }, []);

  return (
    <Modal
      sx={{ bgcolor: "rgba(255,115,115,0.5)" }}
      open={true}
      onClick={(e) => e.stopPropagation()}
      onClose={handleClose}
      className={styles.background}
    >
      <Box
        id="heart"
        className={styles.container}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.confetti}>
          {isExploding && (
            <ConfettiExplosion
              particleCount={200}
              zIndex={10000}
              duration={3000}
              onComplete={() => setIsExploding(false)}
            />
          )}
        </div>
        <Typography
          variant="h1"
          sx={{
            fontWeight: 700,
            fontSize: {
              xs: "2.8rem",
              sm: "5rem",
              md: "5.3556rem",
              lg: "5.9983rem",
            },
          }}
          className={styles.title}
        >
          You chose me!
        </Typography>
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${dog.url})` }}
        >
          <img className={styles.frame} src={frame} alt="cds" />
        </div>
        <Typography
          variant="h2"
          sx={{ fontWeight: 700 }}
          className={styles.name}
        >
          {dog.breeds[0]?.name}
        </Typography>
      </Box>
    </Modal>
  );
};
