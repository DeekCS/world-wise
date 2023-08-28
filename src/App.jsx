import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage.jsx";
import Pricing from "./pages/Pricing.jsx";
import Product from "./pages/Product.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import Login from "./pages/Login.jsx";
import AppLayout from "./pages/AppLayout.jsx";
import CityList from "./components/City/CityList.jsx";
import CountriesList from "./components/CountriesList/CountriesList.jsx";
import City from "./components/City/City.jsx";
import Form from "./components/Form/Form.jsx";
import { CitiesProvider } from "./contexts/CitiesContext.jsx";

function App() {
  return (
    <CitiesProvider>
      <BrowserRouter>
        <Routes>
          <Route index path={"/"} element={<Homepage />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/product"} element={<Product />} />
          <Route path={"/pricing"} element={<Pricing />} />
          <Route path={"/app"} element={<AppLayout />}>
            <Route index element={<Navigate to={"cities"} replace />} />
            <Route path={"cities"} element={<CityList />} />
            <Route path={"cities/:id"} element={<City />} />

            <Route path={"countries"} element={<CountriesList />} />
            <Route path={"form"} element={<Form />} />
          </Route>
          <Route path={"*"} element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </CitiesProvider>
  );
}

export default App;
