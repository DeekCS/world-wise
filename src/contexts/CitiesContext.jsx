import {
  useState,
  useEffect,
  createContext,
  useContext,
  useReducer,
} from "react";
const CitiesContext = createContext();

const BASE_URL = "http://localhost:8000/";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  //This should be pure function without side effects
  /*
   * It should have a naming convention like events not setEvents
   * if you don't use a side effect like fetch or async await you can pass the dispatch directly to the component
   */
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded": // Events not just a setters
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
        currentCity: {},
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    dispatch({ type: "loading" });
    const fetchCities = async () => {
      try {
        const response = await fetch(`${BASE_URL}cities/`);
        const data = await response.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (e) {
        console.log(e);
        dispatch({ type: "rejected", payload: e.message });
      }
    };
    fetchCities();
  }, []);

  const getCity = async (id) => {
    try {
      if (Number(id) === currentCity.id) return; // because we already have the city
      dispatch({ type: "loading" });
      const response = await fetch(`${BASE_URL}cities/${id}`);
      const data = await response.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch (e) {
      console.log(e);
      dispatch({ type: "rejected", payload: e.message });
    }
  };

  async function createCity(city) {
    try {
      dispatch({ type: "loading" });
      const response = await fetch(`${BASE_URL}cities/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(city),
      });
      const data = await response.json();
      dispatch({ type: "city/created", payload: data });
    } catch (e) {
      console.log(e);
      dispatch({ type: "rejected", payload: e.message });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      const response = await fetch(`${BASE_URL}cities/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        dispatch({ type: "city/deleted", payload: id });
      }
    } catch (e) {
      console.log(e);
      dispatch({ type: "rejected", payload: e.message });
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
