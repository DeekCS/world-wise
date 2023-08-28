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
      console.log(id, "idsss");
      const response = await fetch(`${BASE_URL}cities/${id}`);
      const data = await response.json();
      setCurrentCity(data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CitiesContext.Provider value={{ cities, isLoading, currentCity, getCity }}>
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
