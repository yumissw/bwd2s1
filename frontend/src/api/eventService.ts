import { Event } from "../types/eventTypes";
const getAuthToken = () => localStorage.getItem("authToken");
const apiKey = localStorage.getItem("apiKey");

const API_BASE_URL = "http://localhost:3000/private";

export const fetchEvents = async (setEvents: (events: Event[]) => void) => {
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
};

// Создание мероприятия
export const createEvent = async (
  eventData: Omit<Event, "id">
): Promise<Event> => {
  const token = getAuthToken(); 
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey || "",
      Authorization: `Bearer ${token}`, 
    },
    body: JSON.stringify(eventData),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  if (!apiKey) {
    console.log("неправильный апикей");
  }
  return await response.json();
};

// Обновление мероприятия
export const updateEvent = async (
  eventId: number,
  eventData: Omit<Event, "id" | "createdBy">
): Promise<Event> => {
  // Нельзя менять ID и createdBy
  const token = getAuthToken(); // Получаем токен
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey || "",
      Authorization: `Bearer ${token}`, 
    },
    body: JSON.stringify(eventData),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
};

// Получение мероприятия по ID
export const getEvent = async (eventId: number): Promise<Event> => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
};

// Удаление мероприятия
export const deleteEvent = async (eventId: number): Promise<void> => {
  const token = getAuthToken(); // Получаем токен
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "DELETE",
    headers: {
      accept: "application/json",
      "x-api-key": apiKey || "",
      Authorization: `Bearer ${token}`, 
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
};

// получение всех событий
export const getEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch("http://localhost:3000/public/events", {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`ошибка при получении событий: ${response.statusText}`);
    }

    const data = await response.json();
    return data.map((event: Event) => ({
      ...event,
      date: new Date(event.date),
    }));
  } catch (error) {
    console.error("ошибка:", error);
    throw error;
  }
};
