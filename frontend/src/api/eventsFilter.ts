// utils/eventUtils.js (или любое подходящее имя)

import { useState, useEffect } from 'react';
import { Event } from '../types/eventTypes'; //  Убедитесь, что путь к вашему типу Event верный

export const useEventSortingAndFiltering = () => {
  const [events, setEvents] = useState<Event[]>([]); // Или [] если нет начальных данных
  const [sortedEvents, setSortedEvents] = useState<Event[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null); // Или null
  const [endDate, setEndDate] = useState<string | null>(null);  // Или null

  useEffect(() => {
    if (events.length > 0) {
      const eventsWithDateObjects = events.map((event) => ({
        ...event,
        date: new Date(event.date),
      }));

      const sorted = [...eventsWithDateObjects].sort((a, b) => {
        return a.date.getTime() - b.date.getTime();
      });

      // const sortedEventsWithStringDates = sorted.map((event) => ({
      //   ...event,
      //   date: event.date.toISOString(),
      // }));

      setSortedEvents(sorted);
      //setSortedEvents(sortedEventsWithStringDates); // Не нужно, если не используете строковые даты
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

  return {
    events,
    setEvents, // Добавлено, чтобы компонент мог устанавливать events
    sortedEvents,
    startDate,
    endDate,
    handleStartDateChange,
    handleEndDateChange,
    handleSearch,
  };
};
