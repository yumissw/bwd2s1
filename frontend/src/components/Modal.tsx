import React, { ReactNode, useRef, useEffect } from "react";
import styles from "./Modal.module.scss";
import close from "../images/close1.svg";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string; // Optional title for the modal
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose(); // Закрываем модальное окно, вызывая onClose
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose(); // Закрываем модальное окно при нажатии Esc
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown); // Добавляем слушатель keydown
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown); // Удаляем слушатель keydown
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown); // Удаляем слушатель keydown
    };
  }, [isOpen, onClose]); // Зависимости: isOpen и onClose

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      {" "}
      {/* Added overlay for background */}
      <div className={styles.modal} ref={modalRef}>
        <div className={styles.cb}>
          <button onClick={onClose} className={styles.closeb}>
            {/*&times;*/}
            <img src={close} alt="Логотип" />
          </button>
        </div>
        <div className={styles.modalheader}>
          {title && <h2 className={styles.h2modal}>{title} </h2>}{" "}
          {/* Display title if provided */}
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
