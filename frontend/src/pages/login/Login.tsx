import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../api/authService";
import { setToken, getToken } from "../../utils/localStorageUtils";
import styles from "./Login.module.scss";

function Login() {
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem("apiKey") || ""
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token) {
      navigate("/events");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      setToken(data.token);
      navigate("/events");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = event.target.value;
    setApiKey(newApiKey);
    localStorage.setItem("apiKey", newApiKey);
  };

  return (
    <div className={styles.dialog}>
      <h2 className={styles.h2Log}>Авторизация</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
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

        <button type="submit">Войти</button>
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
