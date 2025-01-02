import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import {fetchMarvelCharacters} from '../service/characters';
import {CharacterSection} from '../interfaces/Character';
import {useNavigation} from '@react-navigation/native';
import styles from './CharactersScreenStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CharactersScreen = ({}) => {
  const [characterSections, setCharacterSections] = useState<
    CharacterSection[]
  >([]);
  const [offset, setOffset] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation<any>();
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debouncedSearchTerm]);

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
          ? newCharacters.filter((char: any) =>
              char.name
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase()),
            )
          : newCharacters;

      setCharacterSections(prevSections => {
        const characterMap = new Map();
        [
          ...prevSections.flatMap(section => section.data),
          ...filteredCharacters,
        ].forEach(character => {
          characterMap.set(character.id, character);
        });

        return Array.from(characterMap.values())
          .reduce<CharacterSection[]>((acc, character) => {
            const firstLetter = character.name.charAt(0).toUpperCase();
            let section = acc.find(sec => sec.title === firstLetter);

            if (!section) {
              section = {title: firstLetter, data: []};
              acc.push(section);
            }
            section.data.push(character);
            return acc;
          }, [])
          .sort((a, b) => a.title.localeCompare(b.title));
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching characters:', error);
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, offset]);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setIsSearchActive(false);
    setOffset(0);
  };

  const loadMoreCharacters = () => {
    if (!isLoading) {
      setOffset(prevOffset => prevOffset + 15);
    }
  };

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
        return new Set(updatedFavorites);
      });

      const updatedFavorites = [...favorites];
      if (favorites.has(characterId)) {
        updatedFavorites.splice(updatedFavorites.indexOf(characterId), 1);
      } else {
        updatedFavorites.push(characterId);
      }
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar backgroundColor={'#b50f16'} />
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {!isSearchActive ? (
            <>
              <Text style={styles.title}>Characters</Text>
            </>
          ) : (
            <>
              <TextInput
                style={styles.searchInput}
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Name of character"
                placeholderTextColor="#FFFFFF8A"
              />
            </>
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            if (!isSearchActive) {
              setIsSearchActive(true);
            } else {
              clearSearch();
            }
          }}
          style={styles.iconButton}>
          <View style={styles.icSearch}>
            {!isSearchActive ? (
              <Image source={require('../../assets/search.png')} />
            ) : (
              <Text style={styles.icon}>❌</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <FlatList
        data={characterSections.flatMap(section => [
          {title: section.title, isHeader: true},
          ...section.data,
        ])}
        keyExtractor={(item: any) =>
          item.isHeader ? `header-${item.title}` : item?.id?.toString()
        }
        renderItem={({item}: any) => {
          if (item.isHeader) {
            return <Text style={styles.sectionHeader}>{item.title}</Text>;
          } else {
            return (
              <View key={item.id.toString()} style={styles.view}>
                <Image
                  source={{
                    uri: `https${item.thumbnail.path.substring(4)}.${
                      item.thumbnail.extension
                    }`,
                  }}
                  style={styles.thumbnail}
                  resizeMethod="resize"
                  resizeMode="contain"
                />
                <Text style={styles.nameText}>{item.name}</Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('CharacterDetail', {character: item})
                  }>
                  <Image source={require('../../assets/go-to-page.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                  <Image
                    source={
                      favorites.has(item.id)
                        ? require('../../assets/filledstar.png')
                        : require('../../assets/emptystar.png')
                    }
                    style={styles.favoriteIcon}
                  />
                </TouchableOpacity>
              </View>
            );
          }
        }}
        onEndReached={loadMoreCharacters}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.scrollView}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
      />
    </SafeAreaView>
  );
};

export default CharactersScreen;
