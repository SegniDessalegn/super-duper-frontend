import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopAnime } from "./state/anime/animesSlice";
import { AppDispatch, RootState } from "./state/store";
import TopAnimes from "./componenets/topAnimes";
import AreaChart from "./componenets/areaChart";
import Spinner from "./componenets/spinner";

import "./App.css";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, status, error } = useSelector(
    (state: RootState) => state.anime,
  );

  useEffect(() => {
    const fetchAnime = async () => {
      if (status === "idle") {
        await dispatch(fetchTopAnime());
      }
    };

    fetchAnime();
  }, [dispatch, status]);

  if (status === "loading") {
    return (
      <div className="h-[100vh] w-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-gray-200 flex flex-col gap-20">
      <TopAnimes />
      <AreaChart />
    </div>
  );
}

export default App;
