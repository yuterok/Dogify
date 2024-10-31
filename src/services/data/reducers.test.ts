import dataReducer, { initialState } from "./reducers";
import {
  DataActionTypes,
  FETCH_DATA_FAILURE,
  FETCH_DATA_REQUEST,
  FETCH_DATA_SUCCESS,
} from "./actions";

describe("data actions", () => {
  it("should return the initial state", () => {
    const action: DataActionTypes = { type: "DEFAULT_ACTION_TYPE" };
    expect(dataReducer(undefined, action)).toEqual(initialState);
  });

  it("should handle FETCH_DATA_REQUEST", () => {
    const action: DataActionTypes = { type: "FETCH_DATA_REQUEST" };
    const expectedState = {
      ...initialState,
      dataRequest: true,
      dataFailed: false,
    };
    expect(dataReducer(initialState, action)).toEqual(expectedState);
  });
  it("should handle FETCH_DATA_SUCCESS", () => {
    const data = [
      {
        id: "1",
        url: "dog1.jpg",
        breeds: [
          {
            name: "Labrador",
            temperament: "Friendly",
            weight: { metric: "24 - 30" },
          },
        ],
      },
    ];
    const expectedState = {
      ...initialState,
      dogs: data,
      dataRequest: false,
      dataFailed: false,
    };
    expect(
      dataReducer(initialState, { type: FETCH_DATA_SUCCESS, payload: data })
    ).toEqual(expectedState);
  });

  it("should handle FETCH_DATA_FAILURE", () => {
    const error: string = "Ошибка 404";
    const expectedState = {
      ...initialState,
      dataRequest: false,
      dataFailed: true,
    };
    expect(
      dataReducer(initialState, {
        type: FETCH_DATA_FAILURE,
        payload: error,
      })
    ).toEqual(expectedState);
  });
});
