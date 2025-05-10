import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import { Event } from "../../types/eventTypes";
import { User } from "../../types/userTypes";

import {
  getToken,
  removeToken,
  removeApiKey,
} from "../../utils/localStorageUtils";

import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../api/eventService";

import { useEventSortingAndFiltering } from "../../api/eventsFilter";
import { fetchUserData, fetchUsers, updateUser } from "../../api/userService";

import Modal from "../../components/Modal";
import EventForm from "../../components/EventForm";
import UserForm from "../../components/UserForm";
import styles from "./Profile.module.scss";
import logo from "../../images/l1.png";

function Profile() {
  const [apiKey] = useState<string | null>(
    localStorage.getItem("apiKey") || ""
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [users, setUsers] = useState<{ [key: number]: User }>({});
  const { events, setEvents, sortedEvents } = useEventSortingAndFiltering();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  //const [userss, setUserss] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchUserData(setUser); //загрузка данных пользователя
    fetchEvents(setEvents); //загрузка событий
    fetchUsers(setUsers, apiKey); //загрузка пользователей
  }, [apiKey]);

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const openManageModal = (event: Event) => {
    setSelectedEvent(event);
    setIsManageModalOpen(true);
  };

  const closeManageModal = () => {
    setIsManageModalOpen(false);
    setSelectedEvent(null);
  };

  const modalRef = useRef<HTMLDivElement | null>(null); // Явно указываем тип useRef

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

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeCreateModal();
    }
    return;
  };

  useEffect(() => {
    if (isCreateModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCreateModalOpen]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleCreateEvent = async (data: Omit<Event, "id" | "createdBy">) => {
    if (!user || !user.email) {
      console.warn("Пользователь не загружен!");
      return;
    }
    try {
      const createdBy = user.id;
      console.log("userId: ", user.id);
      const eventData: Omit<Event, "id"> = { ...data, createdBy }; // Создание
      await createEvent(eventData);
      closeCreateModal();
    } catch (error) {
      console.error("Ошибка при создании мероприятия:", error);
    }
  };

  const handleUpdateUser = async (data: Omit<User, "id" | "password">) => {
    if (!selectedUser) return;

    try {
      const userData: Omit<User, "id" | "password"> = { ...data };
      await updateUser(selectedUser.id, userData);
      //const updatedUser = await updateUser(selectedUser.id, data);
      //setUserss(userss.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      closeEditModal();
    } catch (error) {
      console.error("Update failed:", error);
      alert(
        `Ошибка обновления: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`
      );
    }
  };
  const handleUpdateEvent = async (data: Omit<Event, "id" | "createdBy">) => {
    if (!selectedEvent) return;
    try {
      //const createdBy = user.id;
      const eventData: Omit<Event, "id" | "createdBy"> = { ...data }; // Редактирование
      await updateEvent(selectedEvent.id, eventData);
      closeManageModal();
      // Обновить список мероприятий
    } catch (error) {
      console.error("Ошибка при редактировании мероприятия:", error);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    if (window.confirm("Точно удалить?")) {
      try {
        await deleteEvent(selectedEvent.id);
        closeManageModal();
        // Обновить список мероприятий
      } catch (error) {
        console.error("Ошибка при удалении мероприятия:", error);
      }
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

  const getGender = (gender: string) => {
    switch (gender) {
      case "male":
        return "мужской";
      case "female":
        return "женский";
      case "other":
        return "другой";
      default:
        return "не указано";
    }
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
                        <Link to="#" className={styles.linka3}>
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

          {/* Desktop-версия */}
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
                      <Link to="#" className={styles.linka2}>
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
          <h2 className={styles.hh1}>Профиль</h2>
          <div className={styles.profileInfo}>
            {user ? (
              <>
                <p>Имя пользователя: {user.name || "Неизвестно"}</p>
                <p>Email: {user.email || "Неизвестно"}</p>
                <p>Фамилия: {user.lastName || "Неизвестно"}</p>
                <p>Имя: {user.firstName || "Неизвестно"}</p>
                <p>Отчество: {user.patronymic || "Неизвестно"}</p>
                <p>
                  Пол: {/*{user.gender || "Неизвестно"}*/}
                  {getGender(user.gender)}
                </p>
                <p>
                  Дата рождения: {/*{user.dateOfBirth || "Неизвестно"}*/}{" "}
                  {new Date(user.dateOfBirth).toLocaleDateString()}
                </p>
              </>
            ) : (
              <p>Информация о пользователе не доступна.</p>
            )}
            <div className={styles.forEditButton}>
              <button
                onClick={() => openEditModal(user)}
                className={styles.createb}
              >
                Управление пользователем
              </button>
            </div>
          </div>

          <Modal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            title="Управление пользователем"
          >
            {selectedUser && (
              <div>
                <UserForm
                  initialValues={{
                    name: selectedUser.name,
                    email: selectedUser.email,
                    lastName: selectedUser.lastName,
                    firstName: selectedUser.firstName,
                    patronymic: selectedUser.patronymic,
                    gender: selectedUser.gender,
                    dateOfBirth: selectedUser.dateOfBirth,
                  }}
                  onSubmit={handleUpdateUser}
                  onCancel={closeEditModal}
                />
              </div>
            )}
          </Modal>
          {/* Modal для создания */}
          <Modal
            isOpen={isCreateModalOpen}
            onClose={closeCreateModal}
            title="Создать мероприятие"
          >
            <EventForm
              onSubmit={handleCreateEvent}
              onCancel={closeCreateModal}
            />
          </Modal>

          {/* Modal для управления (редактирование/удаление) */}
          <Modal
            isOpen={isManageModalOpen}
            onClose={closeManageModal}
            title="Управление мероприятием"
          >
            {selectedEvent && (
              <div>
                <EventForm
                  initialValues={{
                    title: selectedEvent.title,
                    description: selectedEvent.description,
                    date: new Date(selectedEvent.date),
                  }}
                  onSubmit={handleUpdateEvent}
                  onCancel={closeManageModal}
                />
                <button onClick={handleDeleteEvent} className={styles.delb}>
                  Удалить
                </button>
              </div>
            )}
          </Modal>

          <h2>Мои мероприятия</h2>
          {sortedEvents.filter((event) => user && user.id === event.createdBy)
            .length === 0 ? (
            <div>
              <p>Вы еще не создали ни одного события.</p>
              <button onClick={openCreateModal} className={styles.createb}>
                Создать мероприятие
              </button>
            </div>
          ) : (
            <div>
              <button onClick={openCreateModal} className={styles.createb}>
                Создать мероприятие
              </button>
              <div className={styles.eventsGrid}>
                {sortedEvents
                  .filter(
                    (event) => user && user.id === event.createdBy // Сравниваем user.id и event.createdBy
                  )
                  .map((event) => {
                    const dateObj = new Date(event.date);
                    const formattedDate = dateObj.toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    });

                    const createdByUserr = user.id;

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
                          Создал: {createdByUserr ? user.name : "Неизвестный"}{" "}
                          (Вы)
                          <button
                            className={styles.upr}
                            onClick={() => openManageModal(event)}
                          >
                            Управление мероприятием
                          </button>
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
