import { useCities } from "../../contexts/CitiesContext";
import styles from "./CityItem.module.css";
import { Link } from "react-router-dom";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

export default function CityItem({ city }) {
  const { currentCity } = useCities();
  const { id, cityName, emoji, date, position } = city;
  return (
    <li>
      <Link
        to={`${id}?lat=${position?.lat}&lng=${position?.lng}`}
        className={`
          ${currentCity?.id === id ? styles["cityItem--active"] : ""}
          ${styles.cityItem}
        `}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h2 className={styles.name}>{cityName}</h2>
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn}>&times;</button>
      </Link>
    </li>
  );
}
