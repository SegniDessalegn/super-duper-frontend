import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import Anime from '../../types/anime';

interface AnimeState {
  data: Anime[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AnimeState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchTopAnime = createAsyncThunk('anime/fetchTopAnime', async () => {
  const response = await axios.get('https://api.jikan.moe/v4/top/anime');
  return response.data.data;
});

const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopAnime.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTopAnime.fulfilled, (state, action) => {
        state.status = 'succeeded';
        let recieved = action.payload

        let new_animes = []

        for (let i = 0; i < 25; i++) {
          new_animes.push({
            rank: recieved[i].rank,
            title: recieved[i].title,
            image_url: recieved[i].images.jpg.image_url,
            release: recieved[i].year,
            rating: recieved[i].rating,
            latest: recieved[i].broadcast.string,
            airing: recieved[i].airing,
          })
        }

        new_animes.sort((a, b) => a.rank - b.rank);

        state.data = new_animes
      })
      // .addCase(fetchTopAnime.rejected, (state, action) => {
      //   state.status = 'failed';
      //   state.error = action.error.message as string;
      // });
  },
});

export default animeSlice.reducer;
