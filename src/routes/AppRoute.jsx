import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoutes from "./PrivateRoutes";
import { useSelector } from "react-redux";
import { lazy, Suspense } from "react";
import Loading from "../components/Loading";

const ChatPage = lazy(() => import("../pages/ChatPage"));

const AppRoute = () => {
  const {user} = useSelector((state) => state);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={user === null ? <Login /> : <Navigate to="/" replace />}
        />
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<ChatPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoute;

