import React from "react";
import { Provider } from "react-redux";
import { CssBaseline } from "@mui/material";
import AppRouter from "./routers/AppRouter";
import store from "./store/configureStore";

export const App = () => (
  <Provider store={store}>
    <CssBaseline>
      <AppRouter />
    </CssBaseline>
  </Provider>
);

export default App;
