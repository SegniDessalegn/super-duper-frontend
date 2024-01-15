import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopAnime } from './state/anime/animesSlice';
import { AppDispatch, RootState } from './state/store';

import './App.css';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, status, error } = useSelector((state: RootState) => state.anime);

  useEffect(() => {
    const fetchAnime = async () => {
      if (status === 'idle') {
        await dispatch(fetchTopAnime());
      }
    };

    fetchAnime();
  }, [dispatch, status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Top Anime</h1>
      {status}
      <ul>
        {data.map((anime) => (
          <li key={anime.rank}>
            <p>Rank: {anime.rank}</p>
            <p>Title: {anime.title}</p>
            <img src={anime.image_url} alt={anime.title} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
