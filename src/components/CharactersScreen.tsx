import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  SectionList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {fetchMarvelCharacters} from '../service/characters';
import {Character} from '../interfaces/Character';
import {useNavigation} from '@react-navigation/native';

interface CharacterSection {
  title: string;
  data: Character[];
}

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
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const newCharacters = await fetchMarvelCharacters(
          offset,
          debouncedSearchTerm,
        );

        const filteredCharacters = newCharacters.filter(
          (newCharacter: Character) =>
            !characterSections.some(section =>
              section.data.some(
                (existingCharacter: Character) =>
                  existingCharacter.id === newCharacter.id,
              ),
            ),
        );

        const updatedSections = [...characterSections];

        filteredCharacters.forEach((character: Character) => {
          const firstLetter = character.name.charAt(0).toUpperCase();
          const sectionIndex = updatedSections.findIndex(
            sec => sec.title === firstLetter,
          );

          if (sectionIndex !== -1) {
            updatedSections[sectionIndex].data.push(character);
          } else {
            updatedSections.push({title: firstLetter, data: [character]});
          }
        });

        setCharacterSections(updatedSections);
      } catch (error) {
        console.error('Error fetching characters:', error);
      }
    };

    if (debouncedSearchTerm.length >= 3 || offset > 0) {
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
            <Text
              style={styles.details}
              onPress={() =>
                navigation.navigate('CharacterDetail', {character: item})
              }>
              {' > '}
            </Text>
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

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#B50F16',
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icSearch: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    textAlign: 'right',
  },
  title: {
    fontSize: 20,
    lineHeight: 24,
    color: '#fff',
    fontFamily: 'Barlow Condensed',
    fontWeight: '700',
  },
  searchInput: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  icon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 700,
  },
  backgroundStyle: {
    backgroundColor: '#303030',
    flex: 1,
  },
  view: {
    backgroundColor: '#303030',
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  scrollView: {
    padding: 8,
  },
  nameText: {
    color: '#FFFFFF',
    flex: 1,
    fontFamily: 'Barlow-Regular',
    fontSize: 16,
    marginLeft: 10,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 24,
  },
  sectionHeader: {
    color: '#FFFFFF',
    padding: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    color: '#b50f16',
    fontSize: 34,
    cursor: 'pointer',
    fontWeight: '400',
  },
});

export default CharactersScreen;
