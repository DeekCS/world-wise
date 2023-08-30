import React, { useEffect, useState } from "react";
import styles from "./Form.module.css";
import Button from "../Button/Button.jsx";
import { useNavigate } from "react-router-dom";
import BackButton from "../Button/BackButton";
import { useUrlPosition } from "../../hooks/useUrlPosition.js";
import Message from "../Message/Message.jsx";
import Spinner from "../Spinner/Spinner.jsx";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../../contexts/CitiesContext.jsx";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [lat, lng] = useUrlPosition();
  const navigate = useNavigate();
  const { createCity, isLoading } = useCities();

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [geocodingError, setGeocodingError] = useState(null);

  const getCountry = async () => {
    try {
      setIsLoadingGeocoding(true);
      setGeocodingError(null); // Clear the error state before making a new request

      const response = await fetch(
        `${BASE_URL}?latitude=${lat}&longitude=${lng}`
      );
      const data = await response.json();

      if (!data.countryCode) {
        throw new Error(
          "That doesn't seem to be a city. Click somewhere else. 😀"
        );
      }

      setCountry(data.countryName);
      setCityName(
        data.city || data.locality || data.principalSubdivision || ""
      );
      setDate(data.date);
      setNotes(data.notes);
      setEmoji(convertToEmoji(data.countryCode));
    } catch (e) {
      console.error(e);
      setGeocodingError(e.message);
    } finally {
      setIsLoadingGeocoding(false);
    }
  };

  useEffect(() => {
    if (lat && lng) {
      getCountry();
    }
  }, [lat, lng]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      date,
      notes,
      emoji,
      position: { lat, lng },
    };
    try {
      await createCity(newCity);
      navigate("/app/cities");
    } catch (e) {
      console.error(e);
      setGeocodingError(e.message);
    }
  };

  if (isLoadingGeocoding || isLoading) {
    return <Spinner />;
  }

  if (!lat || !lng) {
    return <Message message="Please click on the map to add a new city" />;
  }

  if (geocodingError) {
    return <Message message={geocodingError} />;
  }

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

export default Form;
