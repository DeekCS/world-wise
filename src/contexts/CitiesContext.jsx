import { useState, useEffect, createContext, useContext } from "react";
const CitiesContext = createContext();

const BASE_URL = "http://localhost:8000/";

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    setIsLoading(true);
    const fetchCities = async () => {
      try {
        const response = await fetch(`${BASE_URL}cities/`);
        const data = await response.json();
        setCities(data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCities();
  }, []);

  const getCity = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}cities/${id}`);
      const data = await response.json();
      setCurrentCity(data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  async function createCity(city) {
    try {
      const response = await fetch(`${BASE_URL}cities/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(city),
      });
      const data = await response.json();
      setCities((prevCities) => [...prevCities, data]);
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteCity(id) {
    try {
      const response = await fetch(`${BASE_URL}cities/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCities((prevCities) => prevCities.filter((city) => city.id !== id));
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("useCities must be used within a CitiesProvider");
  }
  return context;
}

export { CitiesProvider, useCities };
