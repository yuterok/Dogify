import { BASE_URL } from "../../utils/constants";
import { API_KEY } from "../../utils/key";
import { IDog } from "../../utils/types";
import { AppDispatch } from "../store";

export const FETCH_DATA_REQUEST = "FETCH_DATA_REQUEST";
export const FETCH_DATA_SUCCESS = "FETCH_DATA_SUCCESS";
export const FETCH_DATA_FAILURE = "FETCH_DATA_FAILURE";
export const SET_TOTAL_COUNT = "SET_TOTAL_COUNT";
export const DELETE_DATA = "DELETE_DATA";
export const EDIT_DATA = "EDIT_DATA";

export const DEFAULT_ACTION_TYPE = "DEFAULT_ACTION_TYPE";

interface IFetchDataRequest {
  readonly type: typeof FETCH_DATA_REQUEST;
}
interface IDefaultAction {
  readonly type: typeof DEFAULT_ACTION_TYPE;
}

interface IFetchDataSuccess {
  readonly type: typeof FETCH_DATA_SUCCESS;
  payload: Array<IDog>;
}

interface IFetchDataFailure {
  readonly type: typeof FETCH_DATA_FAILURE;
  payload: string;
}

interface ISetTotalCount {
  type: typeof SET_TOTAL_COUNT;
  payload: number;
}

interface IDeleteData {
  type: typeof DELETE_DATA;
  payload: string;
}
interface IEditData {
  type: typeof EDIT_DATA;
  payload: { id: string; newName: string };
}

export type DataActionTypes =
  | IFetchDataRequest
  | IFetchDataSuccess
  | IFetchDataFailure
  | ISetTotalCount
  | IDeleteData
  | IEditData
  | IDefaultAction;

export const fetchDataRequest = (): IFetchDataRequest => ({
  type: FETCH_DATA_REQUEST,
});

export const fetchDataSuccess = (data: IDog[]): IFetchDataSuccess => ({
  type: FETCH_DATA_SUCCESS,
  payload: data,
});

export const setTotalCount = (totalCount: number): ISetTotalCount => ({
  type: SET_TOTAL_COUNT,
  payload: totalCount,
});

export const fetchDataFailure = (error: string): IFetchDataFailure => ({
  type: FETCH_DATA_FAILURE,
  payload: error,
});

export const deleteData = (id: string): IDeleteData => ({
  type: DELETE_DATA,
  payload: id,
});

export const editData = (id: string, newName: string): IEditData => ({
  type: EDIT_DATA,
  payload: { id, newName },
});

export const fetchData = (currentPage: number) => {
  return async (dispatch: AppDispatch) => {
    dispatch(fetchDataRequest());
    try {
      let response = await fetch(
        `${BASE_URL}/images/search?has_breeds=1&limit=10&_page=${currentPage}`,
        {
          method: "GET",
          headers: { "x-api-key": API_KEY },
        }
      );
      if (response.ok) {
        const totalCountHeader = response.headers.get("pagination-count");
        if (totalCountHeader) {
          dispatch(setTotalCount(Number(totalCountHeader)));
        }
        const json = await response.json();
        dispatch(fetchDataSuccess(json));
      } else {
        console.error("HTTP Error: " + response.status);
        dispatch(fetchDataFailure(response.status.toString()));
      }
    } catch (error) {
      console.error("Network error:", error);
      dispatch(
        fetchDataFailure(
          error instanceof Error ? error.message : "Unknown error"
        )
      );
    }
  };
};
