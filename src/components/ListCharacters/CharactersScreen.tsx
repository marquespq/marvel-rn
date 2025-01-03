import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {fetchMarvelCharacters} from '../../service/characters';
import styles from './CharactersScreenStyles';
import Header from './Header';
import CharacterList from './CharacterList';

const CharactersScreen = () => {
  const [characterSections, setCharacterSections] = useState([]);
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const navigation = useNavigation();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const loadCharacters = useCallback(async () => {
    try {
      if (debouncedSearchTerm.length >= 3) {
        setCharacterSections([]);
        setOffset(0);
      }

      setIsLoading(true);
      const newCharacters = await fetchMarvelCharacters(
        offset,
        debouncedSearchTerm.length >= 3 ? debouncedSearchTerm : undefined,
      );

      const filteredCharacters =
        debouncedSearchTerm.length >= 3
          ? newCharacters.filter((char: {name: string}) =>
              char.name
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase()),
            )
          : newCharacters;

      setCharacterSections(prevSections => {
        const characterMap = new Map();
        [
          ...prevSections.flatMap((section: {data: any}) => section.data),
          ...filteredCharacters,
        ].forEach(character => characterMap.set(character.id, character));

        return Array.from(characterMap.values())
          .reduce((acc, character) => {
            const firstLetter = character.name.charAt(0).toUpperCase();
            let section = acc.find(
              (sec: {title: any}) => sec.title === firstLetter,
            );

            if (!section) {
              section = {title: firstLetter, data: []};
              acc.push(section);
            }
            section.data.push(character);
            return acc;
          }, [])
          .sort((a: {title: string}, b: {title: any}) =>
            a.title.localeCompare(b.title),
          );
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching characters:', error);
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, offset]);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(new Set(JSON.parse(storedFavorites)));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (characterId: number) => {
    try {
      setFavorites(prevFavorites => {
        const updatedFavorites = new Set(prevFavorites);
        if (updatedFavorites.has(characterId)) {
          updatedFavorites.delete(characterId);
        } else {
          updatedFavorites.add(characterId);
        }
        return updatedFavorites;
      });

      await AsyncStorage.setItem('favorites', JSON.stringify([...favorites]));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar backgroundColor="#b50f16" />
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isSearchActive={isSearchActive}
        setIsSearchActive={setIsSearchActive}
        clearSearch={() => {
          setSearchTerm('');
          setDebouncedSearchTerm('');
          setIsSearchActive(false);
          setOffset(0);
        }}
      />
      <CharacterList
        sections={characterSections}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onLoadMore={() => setOffset(prevOffset => prevOffset + 15)}
        navigation={navigation}
        isLoading={isLoading}
      />
    </SafeAreaView>
  );
};

export default CharactersScreen;
