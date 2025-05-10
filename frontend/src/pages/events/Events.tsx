import { useState, useEffect } from "react";
import { Link /*useNavigate*/ } from "react-router-dom";
import { fetchUserData, fetchUsers } from "../../api/userService";
import { fetchEvents } from "../../api/eventService";
import {
  //getToken,
  removeToken,
  removeApiKey,
} from "../../utils/localStorageUtils";
import styles from "./Events.module.scss";
import logo from "../../images/l1.png";
import { User } from "../../types/userTypes";
import { useEventSortingAndFiltering } from "../../api/eventsFilter";

function Events() {
  const [apiKey] = useState<string | null>(
    localStorage.getItem("apiKey") || ""
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<{ [key: number]: User }>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const {
    //events,
    setEvents,
    sortedEvents,
    startDate,
    endDate,
    handleStartDateChange,
    handleEndDateChange,
    handleSearch,
  } = useEventSortingAndFiltering();

  //загрузка данных
  useEffect(() => {
    fetchUserData(setUser); //загрузка данных пользователя
    fetchEvents(setEvents); //загрузка событий
    fetchUsers(setUsers, apiKey); //загрузка пользователей
  }, [apiKey, setEvents]);

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
    removeApiKey();
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headertop}>
          <Link to="/" className={styles.logo}>
            ୨୧ ‧₊˚⋅
            <img src={logo} alt="Логотип" className={styles.contentImage} />
          </Link>

          {/* Mobile-версия */}
          {windowWidth <= 768 && (
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
                        <Link to="/events" className={styles.linka3}>
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
                        <Link to="#" className={styles.linka3}>
                          Вы: Гость
                        </Link>
                        <Link to="#" className={styles.linka3}>
                          События
                        </Link>
                        <Link to="/login" className={styles.dropdownLink}>
                          Авторизация
                        </Link>
                        <Link to="/register" className={styles.dropdownLink}>
                          Регистрация
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Desktop-версия */}
          {windowWidth > 768 && (
            <>
              <Link to="#" className={styles.linka1}>
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

      <div className={styles.container}>
        <h2 className={styles.hh1}>События</h2>
        <div>
          <label>Начальная дата </label>
          <input
            type="date"
            placeholder="Начальная дата"
            value={startDate || ""}
            onChange={handleStartDateChange}
            className={styles.inputdata}
          />
          <label>Конечная дата </label>
          <input
            type="date"
            placeholder="Конечная дата"
            value={endDate || ""}
            onChange={handleEndDateChange}
            className={styles.inputdata}
          />
          <button onClick={handleSearch} className={styles.searchButton}>
            Поиск
          </button>
        </div>

        <div className={styles.eventsGrid}>
          {sortedEvents.map((event) => {
            const dateObj = new Date(event.date);
            const formattedDate = dateObj.toLocaleDateString("ru-RU", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            const createdByUser = users[event.createdBy];

            return (
              <div
                className={styles.em}
                key={event.id}
                style={{
                  border: "1px solid #ccc",
                  margin: "10px",
                  padding: "10px",
                  width: "200px",
                }}
              >
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>Дата: {formattedDate}</p>
                <p>
                  Создал: {createdByUser ? createdByUser.name : "Неизвестный"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Events;
