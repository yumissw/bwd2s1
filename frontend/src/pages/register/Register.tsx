import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import styles from "./Register.module.scss";

import {
  register,
  resetRegisterState,
} from "../../features/auth/registerSlice";
type Gender = "male" | "female" | "other";
function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lastName, setlastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [gender, setGender] = useState<Gender>("other");
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());
  const [password, setPassword] = useState("");

  const { isLoading, isError } = useAppSelector((state) => state.register);

  // cброс состояния при размонтировании
  useEffect(() => {
    return () => {
      dispatch(resetRegisterState());
    };
  }, [dispatch]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(
      register({
        name,
        email,
        lastName,
        firstName,
        patronymic,
        gender,
        dateOfBirth,
        password,
      })
    )
      .unwrap()
      .then(() => {
        setTimeout(() => navigate("/login"), 1500);
      });
  };

  return (
    <div className={styles.dialog}>
      <h2 className={styles.h2Log}>Регистрация</h2>
      {/*} {error && <p style={{ color: "red" }}>{error}</p>}*/}
      <form onSubmit={handleRegister}>
        <div>
          <input
            type="email"
            placeholder="Почта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div>
          <input
            type="name"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div>
          <input
            type="text"
            value={lastName}
            placeholder="фамилия"
            onChange={(e) => setlastName(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div>
          <input
            type="text"
            value={firstName}
            placeholder="имя"
            onChange={(e) => setFirstName(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div>
          <input
            type="text"
            value={patronymic}
            placeholder="отчество"
            onChange={(e) => setPatronymic(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            required
            className={styles.input}
          >
            <option value="" disabled>
              выберите пол
            </option>
            <option value="male">мужской</option>
            <option value="female">женский</option>
            <option value="other">другой</option>
          </select>
        </div>
        <div>
          <input
            type="date"
            name="date"
            value={dateOfBirth.toISOString().split("T")[0]}
            onChange={(e) => setDateOfBirth(new Date(e.target.value))}
            required
            className={styles.modalInput}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Загрузка..." : "Регистрация"}
        </button>
      </form>

      {isError && <p className={styles.message}>ошибка при регистрации</p>}

      <div>
        <span>Уже есть аккаунт?</span>
        <span>
          <Link
            to="/login"
            className={styles.linkToReg}
            style={{ textDecoration: "underline" }}
          >
            {" "}
            Авторизоваться
          </Link>
        </span>
      </div>
      <p></p>
    </div>
  );
}

export default Register;
