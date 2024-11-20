import { Modal } from "@mui/material";
import styles from "./modal.module.css";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Typography } from "@mui/material";
import ConfettiExplosion from "react-confetti-explosion";
export const ModalDog = ({ dog, setModal }) => {
  const [isExploding, setIsExploding] = useState(false);
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
      <Box id="heart" className={styles.container}>
        {isExploding && (
          <ConfettiExplosion
            zIndex={10000}
            onComplete={() => setIsExploding(false)}
          />
        )}
        <Typography
          variant="h2"
          sx={{ fontWeight: 700 }}
          className={styles.title}
        >
          You chose me!
        </Typography>
        <img className={styles.image} src={dog.url} alt="your dog" />
      </Box>
    </Modal>
  );
};
