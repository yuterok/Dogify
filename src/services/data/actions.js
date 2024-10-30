import { BASE_URL } from "../../utils/constants";
import { API_KEY } from "../../utils/key";

export const FETCH_DATA_REQUEST = "FETCH_DATA_REQUEST";
export const FETCH_DATA_SUCCESS = "FETCH_DATA_SUCCESS";
export const FETCH_DATA_FAILURE = "FETCH_DATA_FAILURE";
export const SET_TOTAL_COUNT = "SET_TOTAL_COUNT";
export const DELETE_DATA = "DELETE_DATA";

export const fetchDataRequest = () => ({
  type: FETCH_DATA_REQUEST,
});

export const fetchDataSuccess = (data) => ({
  type: FETCH_DATA_SUCCESS,
  payload: data,
});

export const setTotalCount = (totalCount) => ({
  type: SET_TOTAL_COUNT,
  payload: totalCount,
});

export const fetchDataFailure = (error) => ({
  type: FETCH_DATA_FAILURE,
  payload: error,
});

export const deleteData = (id) => ({
  type: DELETE_DATA,
  payload: id,
});

export const fetchData = (currentPage) => {
  return async (dispatch) => {
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
          dispatch(setTotalCount(totalCountHeader));
        }
        const json = await response.json();
        dispatch(fetchDataSuccess(json));
      } else {
        console.error("HTTP Error: " + response.status);
        dispatch(fetchDataFailure(response.status));
      }
    } catch (error) {
      console.error("Network error:", error);
      dispatch(fetchDataFailure(error));
    }
  };
};
