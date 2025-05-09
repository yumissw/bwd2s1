import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { login } from "../../features/auth/authSlice";
import styles from "./Login.module.scss";

function Login() {
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem("apiKey") || ""
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, user } = useAppSelector((state) => state.auth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (user) {
      navigate("/events");
    }
  }, [user, navigate]);

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = event.target.value;
    setApiKey(newApiKey);
    localStorage.setItem("apiKey", newApiKey);
  };

  return (
    <div className={styles.dialog}>
      <h2 className={styles.h2Log}>Авторизация</h2>
      {/*{error && <p style={{ color: "red" }}>{error}</p>}*/}
      <form onSubmit={handleLogin}>
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
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Загрузка..." : "Войти"}
        </button>
      </form>
      <div>
        <span>Ещё не зарегистрированы?</span>
        <span>
          <Link
            to="/register"
            className={styles.linkToReg}
            style={{ textDecoration: "underline" }}
          >
            {" "}
            Регистрация
          </Link>
        </span>
      </div>

      <h2 className={styles.h2Api}>Введите API-ключ:</h2>
      <input
        type="text"
        value={apiKey || ""}
        onChange={handleApiKeyChange}
        placeholder="API-ключ"
      />
      <p></p>
    </div>
  );
}

export default Login;
