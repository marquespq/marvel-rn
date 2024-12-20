import axios from 'axios';
import md5 from 'md5';

const publicKey = '4d8e35d85d38d01db9dabf885ae6d83e';
const privateKey = 'b07fb80cd97cb3a58c308035ff9838382087a595';
const limit = 15;

export const fetchMarvelCharacters = async (offset: number) => {
  const timestamp = new Date().getTime();
  const hash = md5(timestamp + privateKey + publicKey);

  try {
    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/characters`,
      {
        params: {
          ts: timestamp,
          apikey: publicKey,
          hash: hash,
          limit: limit,
          offset: offset,
        },
      },
    );

    return response.data.data.results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchCharacterComics = async (characterId: number | string) => {
  const timestamp = new Date().getTime();
  const hash = md5(timestamp + privateKey + publicKey);

  try {
    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/characters/${characterId}/comics`,
      {
        params: {
          ts: timestamp,
          apikey: publicKey,
          hash: hash,
          limit: limit,
        },
      },
    );

    return response.data.data.results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
