import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  SectionList,
} from 'react-native';
import {fetchMarvelCharacters} from './service/characters';
import {Character} from './interfaces/Character';

interface CharacterSection {
  title: string;
  data: Character[];
}

function App(): React.JSX.Element {
  const [characterSections, setCharacterSections] = useState<
    CharacterSection[]
  >([]);
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const newCharacters = await fetchMarvelCharacters(offset);
        const filteredCharacters = newCharacters.filter(
          (newCharacter: Character) =>
            !characterSections.some(section =>
              section.data.some(
                (existingCharacter: Character) =>
                  existingCharacter.id === newCharacter.id,
              ),
            ),
        );

        const sections: CharacterSection[] = [];
        filteredCharacters.forEach((character: Character) => {
          const firstLetter = character.name.charAt(0).toUpperCase();
          const section = sections.find(sec => sec.title === firstLetter);
          if (section) {
            section.data.push(character);
          } else {
            sections.push({title: firstLetter, data: [character]});
          }
        });

        setCharacterSections(prevSections => [...prevSections, ...sections]);
      } catch (error) {
        console.error('Error fetching characters:', error);
      }
    };

    loadCharacters();
  }, [offset]);

  const loadMoreCharacters = () => {
    setOffset(prevOffset => prevOffset + 15);
  };

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar backgroundColor={'#b50f16'} />
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
          </View>
        )}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        onEndReached={loadMoreCharacters}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.scrollView}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: '#303030',
    flex: 1,
  },
  view: {
    backgroundColor: '#303030',
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  scrollView: {
    padding: 8,
  },
  nameText: {
    color: '#FFFFFF',
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
});

export default App;
