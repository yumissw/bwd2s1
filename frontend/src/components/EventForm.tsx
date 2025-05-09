import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Event } from "../types/eventTypes"; // Путь к вашим типам
import styles from "./Modal.module.scss";

interface EventFormProps {
  initialValues?: Omit<Event, "id" | "createdBy">;
  onSubmit: (data: Omit<Event, "id" | "createdBy">) => void; // Corrected type here
  onCancel: () => void;
}

const eventSchema = yup.object().shape({
  title: yup.string().required("Название обязательно"),
  description: yup
    .string()
    .required("Описание обязательно")
    .min(10, "Описание должно быть не менее 10 символов"),
  date: yup
    .date()
    .required("Дата обязательна")
    .min(new Date(), "Дата не может быть в прошлом"),
});

type FormData = yup.InferType<typeof eventSchema>;

const EventForm: React.FC<EventFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(eventSchema),
    defaultValues: initialValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (initialValues) {
      Object.keys(initialValues).forEach((key) => {
        setValue(
          key as keyof FormData,
          initialValues[key as keyof Omit<Event, "id" | "createdBy">]
        );
      });
    }
  }, [initialValues, setValue]);

  const handleFormSubmit: SubmitHandler<FormData> = async (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div>
        <input
          type="text"
          id="title"
          placeholder="Название:" // Label перенесен сюда
          {...register("title")}
        />
        {errors.title && (
          <p className="error-message">{errors.title?.message}</p>
        )}
      </div>

      <div>
        <input
          id="description"
          placeholder="Описание:" // Label перенесен сюда
          {...register("description")}
        />
        {errors.description && (
          <p className="error-message">{errors.description?.message}</p>
        )}
      </div>

      <div>
        <input
          type="date"
          id="date"
          placeholder="Дата:" // Label перенесен сюда
          {...register("date", { valueAsDate: true })}
        />
        {errors.date && <p className="error-message">{errors.date?.message}</p>}
      </div>

      <div className="button-group">
        <button type="submit" className={styles.sohr}>
          Сохранить
        </button>
      </div>
    </form>
  );
};

export default EventForm;
