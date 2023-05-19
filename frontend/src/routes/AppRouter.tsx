import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import { useLoadUserFromLocalStorage } from "../hooks";
import { AuthGuard } from "../components";

export const AppRouter = () => {
  useLoadUserFromLocalStorage();
  return (
    <BrowserRouter>
      <Routes>
        {routes.map(({ Component, path, isPrivate }) => {
          if (isPrivate) {
            return (
              <Route
                key={path}
                element={<AuthGuard Component={Component} redirectPath={"/"} />}
              />
            );
          } else {
            return <Route key={path} path={path} element={<Component />} />;
          }
        })}
        <Route path="/*" element={<Navigate to={routes[0].path} replace />} />
      </Routes>
    </BrowserRouter>
  );
};
