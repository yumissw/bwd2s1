import { useState, useEffect } from "react";
import { Link /*useNavigate*/ } from "react-router-dom";
import {
  getToken,
  removeToken,
  removeApiKey,
} from "../../utils/localStorageUtils";
import styles from "./Events.module.scss";
import logo from "../../images/l1.png";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  createdBy: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

function Events() {
  const [sortedEvents, setSortedEvents] = useState<Event[]>([]);
  const [apiKey] = useState<string | null>(
    localStorage.getItem("apiKey") || ""
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<{ [key: number]: User }>({});
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

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

    const fetchEvents = async () => {
      /*try {
        const response = await fetch("http://localhost:3000/public/events");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }*/
      /*try {
        let url = "http://localhost:3000/public/events";
        const params = new URLSearchParams();
        if (startDate) {
          params.append("startDate", startDate);
        }
        if (endDate) {
          params.append("endDate", endDate);
        }
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Event[] = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }*/
      try {
        const response = await fetch("http://localhost:3000/public/events"); // Без параметров startDate и endDate
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Event[] = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
      /*try {
        let url = "http://localhost:3000/public/events";
        const params = new URLSearchParams();
        if (startDate) {
          params.append("startDate", startDate);
        }
        if (endDate) {
          params.append("endDate", endDate);
        }
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Event[] = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }*/
    };

    const fetchUsers = async () => {
      try {
        const token = getToken();
        const response = await fetch("http://localhost:3000/private/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": apiKey || "",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data: User[] = await response.json();

        const usersObject: { [key: number]: User } = {};
        data.forEach((user) => {
          usersObject[user.id] = user;
        });

        setUsers(usersObject);
        console.log("Users object loaded:", usersObject);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUserData();
    fetchEvents();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      const eventsWithDateObjects = events.map((event) => ({
        ...event,
        date: new Date(event.date),
      }));

      const sorted = [...eventsWithDateObjects].sort((a, b) => {
        return a.date.getTime() - b.date.getTime();
      });

      const sortedEventsWithStringDates = sorted.map((event) => ({
        ...event,
        date: event.date.toISOString(),
      }));

      setSortedEvents(sortedEventsWithStringDates);
    }
  }, [events]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const handleSearch = async () => {
    try {
      let url = "http://localhost:3000/public/events";
      const params = new URLSearchParams();
      if (startDate) {
        params.append("startDate", startDate);
      }
      if (endDate) {
        params.append("endDate", endDate);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Event[] = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
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
          <Link to="/" className={styles.logo}>
            ୨୧ ‧₊˚⋅
            <img src={logo} alt="Логотип" className={styles.contentImage} />
          </Link>

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
              <p className={styles.p1}> Вы вошли как:'Гость'</p>
            </>
          )}
        </div>
      </div>

      <div className={styles.container}>
        <h2 className={styles.hh1}>События</h2>
        <div>
          <input
            type="date"
            placeholder="Начальная дата"
            value={startDate || ""}
            onChange={handleStartDateChange}
            className={styles.input}
          />
          <input
            type="date"
            placeholder="Конечная дата"
            value={endDate || ""}
            onChange={handleEndDateChange}
            className={styles.input}
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
