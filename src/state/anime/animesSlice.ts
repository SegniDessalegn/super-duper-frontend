import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Anime {
  rank: number;
  title: string;
  image_url: string;
}

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

        console.log(recieved, typeof(recieved), recieved[0])
        let new_anime = []

        for (let i = 0; i < 25; i++) {
          new_anime.push({
            rank: recieved[i].rank,
            title: recieved[i].title,
            image_url: recieved[i].images.jpg.image_url,
          })
        }
        // state.data = action.payload.map((anime: any) => ({
        //   rank: anime.rank,
        //   title: anime.title,
        //   image_url: anime.image_url,
        // }));

        state.data = new_anime
      })
      // .addCase(fetchTopAnime.rejected, (state, action) => {
      //   state.status = 'failed';
      //   state.error = action.error.message as string;
      // });
  },
});

export default animeSlice.reducer;
