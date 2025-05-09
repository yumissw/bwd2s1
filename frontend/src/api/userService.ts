// src/api/user.ts
import { User } from '../types/userTypes'; // Предполагаем, что у вас есть тип User
import { getToken, removeToken } from '../utils/localStorageUtils'; // Предполагаем, что эти функции находятся в этом файле

export const fetchUserData = async (setUser: (user: any) => void) => {
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
          removeToken(); // Важно удалить токен при 401
          return;
        }
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error("Ошибка при получении данных пользователя:", error);
    }
  }
};

export const fetchUsers = async (
    setUsers: (users: { [key: number]: User }) => void,
    apiKey: string | null
  ) => {
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
  

