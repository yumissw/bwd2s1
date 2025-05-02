import { Link /*useNavigate*/ } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getToken,
  removeToken,
  removeApiKey,
} from "../../utils/localStorageUtils";
import styles from "./Home.module.scss";
import logo from "../../images/l1.png";

function Home() {
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await fetch("http://localhost:3000/public/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (data.message === "Вы вошли как гость") {
            setUser({ message: data.message });
          } else {
            setUser(data);
          }
          if (!response.ok) {
            if (response.status === 401) {
              window.location.href = "/login";
              return;
            }
            throw new Error(`Ошибка HTTP: ${response.status}`);
          }
        } catch (error) {
          console.error("Ошибка при получении данных пользователя:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    removeToken();
    setUser(null);
    removeApiKey();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headertop}>
          <Link to="/" className={styles.logolink1}>
            ୨୧ ‧₊˚⋅
            <img src={logo} alt="Логотип" className={styles.contentImage} />
          </Link>

          <Link to="/events" className={styles.linka}>
            События
          </Link>
          {user?.email ? (
            <div className={styles.userDropdown}>
              <button
                className={styles.dropdownButton}
                onClick={toggleDropdown}
              >
                Вы вошли как: {user?.email || "Гость"}
              </button>
              {isDropdownOpen && (
                <div className={styles.dropdownContent}>
                  <Link to="/profile" className={styles.dropdownLink}>
                    Профиль
                  </Link>
                  <Link
                    to="/"
                    onClick={handleLogout}
                    className={styles.dropdownLink}
                  >
                    Выйти
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className={styles.linka}>
                Авторизация
              </Link>
              <Link to="/register" className={styles.linka}>
                Регистрация
              </Link>
              <p className={styles.p1}> Вы вошли как:'Гость'</p>
            </>
          )}
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.container}>
          <h2 className={styles.hh1}>О приложении</h2>
          <div className={styles.logoAndText}>
            <img src={logo} alt="Логотип" className={styles.logo} />
            <span className={styles.descriptionText}>
              <p>
                Данное приложение позволяет пользователям создать мероприятие,
                посмотреть какие мероприятия будут, а также есть возможность
                войти в саму систему.
              </p>
              <p>Выполнила: студентка ПрИ-22 Овчинникова Дарья</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
