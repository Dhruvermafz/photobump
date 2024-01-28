import auth from "../reducers/auth";
import { createStore } from "@reduxjs/toolkit";
const store = createStore(
  auth,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
