import React, { useState } from "react";
import { User } from "../types/userTypes";
import styles from "./Modal.module.scss";
interface UserFormProps {
  initialValues: Omit<User, "id" | "password">;
  onSubmit: (values: Omit<User, "id" | "password">) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [values, setValues] =
    useState<Omit<User, "id" | "password">>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<Date>(
    new Date(values.dateOfBirth)
  );
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({
      ...prev,
      dateOfBirth: new Date(e.target.value),
    }));
    const dateString = e.target.value;
    const dateObject = new Date(dateString); // Преобразуем строку в объект Date

    setDateOfBirth(dateObject); // Передаем объект Date
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация
    if (/\d/.test(values.name)) {
      setError("Имя пользователя не должно содержать цифры");
      return;
    }

    if (/\d/.test(values.firstName)) {
      setError("Имя не должно содержать цифры");
      return;
    }

    if (/\d/.test(values.lastName)) {
      setError("Фамилия не должна содержать цифры");
      return;
    }

    if (/\d/.test(values.patronymic)) {
      setError("Отчество не должно содержать цифры");
      return;
    }

    if (!values.email.includes("@")) {
      setError("Некорректный email");
      return;
    }

    setError(null);
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Имя пользователя"
          value={values.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={values.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="lastName"
          placeholder="Фамилия"
          value={values.lastName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="firstName"
          placeholder="Имя"
          value={values.firstName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="patronymic"
          placeholder="Отчество"
          value={values.patronymic}
          onChange={handleChange}
        />
      </div>

      <div className="formGroup">
        <label>Пол: </label>

        <select
          name="gender"
          value={values.gender}
          className={styles.gender}
          onChange={handleChange}
        >
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
          <option value="other">Другой</option>
        </select>
      </div>

      <div className="formGroup1">
        <label>Дата рождения: </label>
        <input
          type="date"
          name="dateOfBirth"
          value={new Date(dateOfBirth).toISOString().split("T")[0]}
          onChange={handleDateChange}
          className={styles.dateOfBirth}
        />
      </div>

      <div className="form-actions">
        <button type="submit">Сохранить</button>
      </div>
    </form>
  );
};

export default UserForm;
