import { useCities } from "../../contexts/CitiesContext";
import styles from "./CityItem.module.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

export default function CityItem({ city }) {
  const { currentCity, deleteCity } = useCities();
  const { id, cityName, emoji, date, position } = city;

  const handleDelete = async (e) => {
    e.preventDefault();
    const alert = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (alert.isConfirmed) {
      deleteCity(id);
      await Swal.fire("Deleted!", "City has been deleted.", "success");
    }
  };

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
        <button onClick={handleDelete} className={styles.deleteBtn}>
          &times;
        </button>
      </Link>
    </li>
  );
}
