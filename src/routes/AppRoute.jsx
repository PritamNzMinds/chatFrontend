import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ChatPage from "../pages/ChatPage";
import PrivateRoutes from "./PrivateRoutes";
import { useSelector } from "react-redux";

const AppRoute = () => {
  const auth=useSelector((state)=> state);
  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to={"/login"}/>} /> */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={(auth.user===null) ? <Login/> : <Navigate to={"/"}/>} />
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<ChatPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoute;
