import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

import { CitiesProvider } from "./contexts/CitiesContext.jsx";
import { AuthProvider } from "./contexts/FakeAuthContext.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";

import CityList from "./components/City/CityList.jsx";
import CountriesList from "./components/CountriesList/CountriesList.jsx";
import City from "./components/City/City.jsx";
import Form from "./components/Form/Form.jsx";
import SpinnerFullPage from "./components/Spinner/SpinnerFullPage.jsx";

const Homepage = lazy(() => import("./pages/Homepage.jsx"));
const Pricing = lazy(() => import("./pages/Pricing.jsx"));
const Product = lazy(() => import("./pages/Product.jsx"));
const PageNotFound = lazy(() => import("./pages/PageNotFound.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const AppLayout = lazy(() => import("./pages/AppLayout.jsx"));

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <Suspense fallback={<SpinnerFullPage />}>
          <BrowserRouter>
            <Routes>
              <Route index path={"/"} element={<Homepage />} />
              <Route path={"/login"} element={<Login />} />
              <Route path={"/product"} element={<Product />} />
              <Route path={"/pricing"} element={<Pricing />} />
              <Route
                path={"/app"}
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to={"cities"} replace />} />
                <Route path={"cities"} element={<CityList />} />
                <Route path={"cities/:id"} element={<City />} />

                <Route path={"countries"} element={<CountriesList />} />
                <Route path={"form"} element={<Form />} />
              </Route>
              <Route path={"*"} element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
        </Suspense>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
