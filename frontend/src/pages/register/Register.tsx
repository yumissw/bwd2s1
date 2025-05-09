/*import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../api/authService";

import styles from "./Register.module.scss";
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const data = await register(email, name, password);
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };*/
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import styles from "./Register.module.scss";

import {
  register,
  resetRegisterState,
} from "../../features/auth/registerSlice";

function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        {/*<div>
          <input
            type="password"
            placeholder="Подтвердить пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>*/}

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
