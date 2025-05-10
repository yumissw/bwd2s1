import { User } from '../types/userTypes'; 
import { getToken, removeToken } from '../utils/localStorageUtils'; 
const getAuthToken = () => localStorage.getItem('authToken');
const apiKey = localStorage.getItem('apiKey'); 
const API_BASE_URL = 'http://localhost:3000/private/users'; 

export const updateUser = async (userId: number, userData: Omit<User, 'id' | 'password'>): Promise<User> => {
    const token = getAuthToken();
    console.log('Sending user data:', userData); 
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey || '',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
};

export const deleteUser = async (userId: number): Promise<void> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: 'DELETE',
        headers: {
            'accept': 'application/json',
            'x-api-key': apiKey || '',
            'Authorization': `Bearer ${token}`,
        }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
};

export const getUserById = async (userId: number): Promise<User> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
        headers: {
            'x-api-key': apiKey || '',
            'Authorization': `Bearer ${token}`,
        }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
};


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
          removeToken(); 
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
  

