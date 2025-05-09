import { Link /*useNavigate*/ } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchUserData } from "../../api/userService";
import { removeToken, removeApiKey } from "../../utils/localStorageUtils";
import styles from "./Home.module.scss";
import logo from "../../images/l1.png";

function Home() {
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  //загрузка данных
  useEffect(() => {
    fetchUserData(setUser);
  }, []);

  //изменение ширины страницы
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
          <Link to="#" className={styles.logoHome}>
            ୨୧ ‧₊˚⋅
            <img src={logo} alt="Логотип" className={styles.contentImage} />
          </Link>

          {/* Burger Menu Button (Mobile) */}
          {windowWidth <= 768 && ( //  768px или любой другой брейкпоинт для мобильных
            <>
              <div className={styles.mobileMenu}>
                <button
                  className={styles.burgerButton}
                  onClick={toggleMobileMenu}
                >
                  {isMobileMenuOpen ? "x" : "☰"}
                  {/*☰*/}
                </button>

                {isMobileMenuOpen && (
                  <div className={styles.mobileMenuContent}>
                    {user?.email ? (
                      <>
                        <Link to="/profile" className={styles.dropdownLink}>
                          Вы: {user?.name || "Гость"}
                        </Link>
                        <Link to="/events" className={styles.dropdownLink}>
                          События
                        </Link>
                        <Link
                          to="/events"
                          onClick={handleLogout}
                          className={styles.dropdownLink}
                        >
                          Выйти
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="#" className={styles.linka2}>
                          Вы: Гость
                        </Link>
                        <Link to="/events" className={styles.linka2}>
                          События
                        </Link>
                        <Link to="/login" className={styles.linka2}>
                          Авторизация
                        </Link>
                        <Link to="/register" className={styles.linka2}>
                          Регистрация
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Navigation (Desktop) */}
          {windowWidth > 768 && (
            <>
              <Link to="/events" className={styles.linka4}>
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
                        to="/events"
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
                  <Link to="#" className={styles.linka1}>
                    Вы вошли как: Гость
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.container}>
          <h2 className={styles.hh1}>О приложении</h2>

          {windowWidth > 1162 && (
            <>
              <div className={styles.logoAndText}>
                <img src={logo} alt="Логотип" className={styles.logo} />
                <span className={styles.descriptionText}>
                  <p>
                    Данное приложение позволяет пользователям создать
                    мероприятие, посмотреть какие мероприятия будут, а также
                    есть возможность войти в саму систему.
                  </p>
                  <p>Выполнила: студентка ПрИ-22 Овчинникова Дарья</p>
                </span>
              </div>
            </>
          )}

          {windowWidth < 1163 && (
            <>
              <img
                src={logo}
                alt="Логотип"
                className={styles.logo}
                width="450px"
              />
              <span className={styles.descriptionText}>
                <p>
                  Данное приложение позволяет пользователям создать мероприятие,
                  посмотреть какие мероприятия будут, а также есть возможность
                  войти в саму систему.
                </p>
                <p>Выполнила: студентка ПрИ-22 Овчинникова Дарья</p>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
