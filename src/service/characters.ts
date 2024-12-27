import axios from 'axios';
import md5 from 'md5';
import Config from 'react-native-config';

const publicKey = Config.MARVEL_PUBLIC_KEY;
const privateKey = Config.MARVEL_PRIVATE_KEY;
const limit = 15;

export const fetchMarvelCharacters = async (
  offset: number,
  searchTerm: string = '',
) => {
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
          ...(searchTerm && {nameStartsWith: searchTerm}),
        },
      },
    );

    return response.data.data.results;
  } catch (error: any) {
    console.error('Error fetching Marvel characters:', error.message || error);
    throw new Error(
      'Failed to fetch Marvel characters. Please try again later.',
    );
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
