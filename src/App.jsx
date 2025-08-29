import React from "react";
import AppRoute from "./routes/AppRoute";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <AppRoute />
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;
