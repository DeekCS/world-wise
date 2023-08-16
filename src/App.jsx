import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage.jsx";
import Pricing from "./pages/Pricing.jsx";
import Product from "./pages/Product.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import Login from "./pages/Login.jsx";
import AppLayout from "./pages/AppLayout.jsx";
import CityList from "./components/City/CityList.jsx";
import { useEffect, useState } from "react";
import CountriesList from "./components/CountriesList/CountriesList.jsx";
import City from "./components/City/City.jsx";

const BASE_URL = "http://localhost:8000/";
function App() {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchCities = async () => {
      try {
        const response = await fetch(`${BASE_URL}cities/`);
        const data = await response.json();
        console.log(data);
        setCities(data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCities();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Homepage />} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/product"} element={<Product />} />
        <Route path={"/pricing"} element={<Pricing />} />
        <Route path={"/app"} element={<AppLayout />}>
          <Route
            index
            path={"cities"}
            element={<CityList cities={cities} isLoading={isLoading} />}
          />
          <Route path={"cities/:id"} element={<City />} />

          <Route
            path={"countries"}
            element={<CountriesList cities={cities} isLoading={isLoading} />}
          />
          <Route
            path={"form"}
            element={
              <p>
                Form <p />
              </p>
            }
          />
        </Route>
        <Route path={"*"} element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
