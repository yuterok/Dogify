import { combineReducers } from "redux";
import dataReducer from "./data/reducers";

const rootReducer = combineReducers({
  data: dataReducer,
});

export default rootReducer;
