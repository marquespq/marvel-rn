import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  View,
  SectionList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {fetchMarvelCharacters} from '../service/characters';
import {CharacterSection} from '../interfaces/Character';
import {useNavigation} from '@react-navigation/native';
import styles from './CharactersScreenStyles';

const CharactersScreen = ({}) => {
  const [characterSections, setCharacterSections] = useState<
    CharacterSection[]
  >([]);
  const [offset, setOffset] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        if (debouncedSearchTerm.length >= 3) {
          setCharacterSections([]);
          setOffset(0);
        }

        const newCharacters = await fetchMarvelCharacters(
          offset,
          debouncedSearchTerm,
        );

        const characterMap = new Map();

        [
          ...characterSections.flatMap(section => section.data),
          ...newCharacters,
        ].forEach(character => {
          characterMap.set(character.id, character);
        });

        const updatedSections = Array.from(characterMap.values()).reduce<
          CharacterSection[]
        >((acc, character) => {
          const firstLetter = character.name.charAt(0).toUpperCase();
          const sectionIndex = acc.findIndex(sec => sec.title === firstLetter);

          if (sectionIndex !== -1) {
            acc[sectionIndex].data.push(character);
          } else {
            acc.push({title: firstLetter, data: [character]});
          }

          return acc;
        }, []);

        updatedSections.sort((a, b) => a.title.localeCompare(b.title));

        setCharacterSections(updatedSections);
      } catch (error) {
        console.error('Error fetching characters:', error);
      }
    };

    if (debouncedSearchTerm.length >= 0) {
      loadCharacters();
    }
  }, [offset, debouncedSearchTerm]);

  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setIsSearchActive(false);
  };

  const loadMoreCharacters = () => {
    setOffset(prevOffset => prevOffset + 15);
  };

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
      <SectionList
        sections={characterSections}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View key={item.id.toString()} style={styles.view}>
            <Image
              source={{
                uri: `${item.thumbnail.path}.${item.thumbnail.extension}`,
              }}
              style={styles.thumbnail}
            />
            <Text style={styles.nameText}>{item.name}</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('CharacterDetail', {character: item})
              }>
              <Image source={require('../../assets/go-to-page.png')} />
            </TouchableOpacity>
          </View>
        )}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        onEndReached={loadMoreCharacters}
        onEndReachedThreshold={2}
        contentContainerStyle={styles.scrollView}
      />
    </SafeAreaView>
  );
};

export default CharactersScreen;
