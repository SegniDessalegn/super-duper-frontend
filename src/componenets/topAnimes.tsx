import React, { useEffect, ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopAnime } from '../state/anime/animesSlice';
import { AppDispatch, RootState } from '../state/store';

const TopAnimes: React.FC = (): ReactElement => {
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

    return (
        <div className="bg-gray-200 pt-5">
            <div className="flex justify-center items-center flex-wrap gap-5">
            {data.map((anime) => (
            <div className='relative w-[180px] h-[260px] cursor-pointer rounded-lg'>
                <div key={anime.rank} className='bg-white w-[180px] h-full rounded-lg hover:relative hover:-left-10 hover:w-[300px] hover:h-[480px] hover:z-10 transition-all duration-150 ease-in-out'>
                    <p className='absolute top-0 right-0 bg-purple-500 rounded p-[1px] px-2'>{anime.rank}</p>
                    <img src={anime.image_url} alt={anime.title} className='rounded object-cover h-48 w-96'/>
                    <div className="flex justify-center items-center">
                        <p className='m-2 text-sm text-center'>{anime.title}</p>
                    </div>
                </div>
            </div>
            ))}
            </div>

        </div>
    );
};

export default TopAnimes;
