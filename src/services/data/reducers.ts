import {
  FETCH_DATA_REQUEST,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
  SET_TOTAL_COUNT,
  DELETE_DATA,
  EDIT_DATA,
  DataActionTypes,
} from "./actions";
import { IDog } from "../../utils/types";

interface DataState {
  dogs: IDog[];
  totalCount: number;
  dataRequest: boolean;
  dataFailed: boolean;
}

export const initialState: DataState = {
  dogs: [],
  totalCount: 0,
  dataRequest: false,
  dataFailed: false,
};

const dataReducer = (state = initialState, action: DataActionTypes) => {
  switch (action.type) {
    case FETCH_DATA_REQUEST: {
      return {
        ...state,
        dataRequest: true,
        dataFailed: false,
      };
    }
    case FETCH_DATA_SUCCESS: {
      return {
        ...state,
        dogs: [...state.dogs, ...action.payload],
        dataRequest: false,
        dataFailed: false,
      };
    }
    case SET_TOTAL_COUNT: {
      return {
        ...state,
        totalCount: action.payload,
      };
    }
    case FETCH_DATA_FAILURE: {
      return {
        ...state,
        dataFailed: true,
        dataRequest: false,
      };
    }
    case DELETE_DATA: {
      return {
        ...state,
        dogs: state.dogs.filter((item) => item.id !== action.payload),
      };
    }
    case EDIT_DATA: {
      return {
        ...state,
        dogs: state.dogs.map((dog) =>
          dog.id === action.payload.id
            ? {
                ...dog,
                breeds: [
                  {
                    ...dog.breeds[0],
                    name: action.payload.newName,
                  },
                ],
              }
            : dog
        ),
      };
    }
    default: {
      return state;
    }
  }
};

export default dataReducer;
