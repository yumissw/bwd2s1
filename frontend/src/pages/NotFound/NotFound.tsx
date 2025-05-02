import styles from "./NotFound.module.scss";
import err from "../../images/404.png";
function NotFound() {
  return (
    <div className={styles.container}>
      <h2 className={styles.hh1}>404</h2>
      <p className={styles.p1}>Страница не найдена.</p>
      <p className={styles.p1}>
        Возможно, вы ввели неправильный адрес или страница была удалена.
      </p>
      <img src={err} alt="Ошибка" className={styles.err} />
    </div>
  );
}

export default NotFound;
