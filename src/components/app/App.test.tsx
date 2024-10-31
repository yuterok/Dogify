import { render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import App from "./App";
import { fetchData } from "../../services/data/actions";
import { RootState } from "../../services/store";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import userEvent from "@testing-library/user-event";

jest.mock("../../services/data/actions");

const mockStore = configureMockStore<
  RootState,
  ThunkDispatch<RootState, void, AnyAction>
>();
const mockDogs = [
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
  {
    id: "2",
    url: "dog2.jpg",
    breeds: [
      {
        name: "Bulldog",
        temperament: "Energetic",
        weight: { metric: "25 - 32" },
      },
    ],
  },
  {
    id: "4",
    url: "dog3.jpg",
    breeds: [
      {
        name: "Collie",
        temperament: "Energetic",
        weight: { metric: "20 - 25" },
      },
    ],
  },
];

describe("App Component", () => {
  let store = mockStore();

  beforeEach(() => {
    store = mockStore({
      data: {
        dogs: mockDogs,
        totalCount: 3,
        dataRequest: false,
        dataFailed: false,
      },
    });
    (fetchData as jest.Mock).mockReturnValue({
      type: "FETCH_DATA_SUCCESS",
      payload: mockDogs,
    });
  });

  it("should render the list of dogs", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText(/Bulldog/i)).toBeInTheDocument();
    expect(screen.getByText(/Labrador/i)).toBeInTheDocument();
    expect(screen.getByText(/Collie/i)).toBeInTheDocument();
  });

  it("should sort dogs by name", async () => {
    const { getAllByTestId } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const selectLabel = /Sort/i;
    const selectEl = await screen.findByLabelText(selectLabel);

    expect(selectEl).toBeInTheDocument();

    userEvent.click(selectEl);

    const optionsPopupEl = await screen.findByRole("listbox", {
      name: selectLabel,
    });

    userEvent.click(within(optionsPopupEl).getByText(/By name/i));

    expect(await screen.findByText(/By name/i)).toBeInTheDocument();

    const dogNames = getAllByTestId("dog-name").map((dog) => dog.textContent);
    expect(dogNames).toStrictEqual(["Bulldog", "Collie", "Labrador"]);
  });

  it("should display an error message if fetch fails", () => {
    store = mockStore({
      data: {
        dogs: [],
        totalCount: 0,
        dataRequest: false,
        dataFailed: true,
      },
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(
      screen.getByText(/Error loading data, try again later/i)
    ).toBeInTheDocument();
  });

  it("should display preloader while fetching", () => {
    store = mockStore({
      data: {
        dogs: [],
        totalCount: 0,
        dataRequest: true,
        dataFailed: false,
      },
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByTestId("preloader")).toBeInTheDocument();
  });
});
