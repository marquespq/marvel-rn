import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';

const CharacterDetailScreen = ({route}: any) => {
  const {character} = route.params;
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const descriptionText =
    character.description ||
    'Our writer is busy saving the Semantics World, so this character doesn’t have a description yet!';
  const isLongDescription = descriptionText.length > 100;

  const comics = character.comics.items || [];

  return (
    <View style={styles.container}>
      <View style={styles.alignImage}>
        <Image
          source={{
            uri: `${character.thumbnail.path}.${character.thumbnail.extension}`,
          }}
          style={styles.thumbnail}
        />
        <Text style={styles.titleName}>{character.name}</Text>
      </View>

      <Text style={styles.description}>
        {isExpanded || !isLongDescription
          ? descriptionText
          : `${descriptionText.substring(0, 100)}...`}
      </Text>
      {isLongDescription && (
        <TouchableOpacity onPress={toggleDescription} style={styles.button}>
          <Text style={styles.buttonText}>{isExpanded ? '▲' : '▼'}</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.titleComics}>Comics</Text>

      <FlatList
        data={comics}
        keyExtractor={item => item.resourceURI}
        renderItem={({item}) => (
          <View style={styles.comicItem}>
            <Image
              source={require('../../assets/cover.png')}
              style={styles.comicImage}
            />
            <Text style={styles.comicText}>{item.name}</Text>
          </View>
        )}
        contentContainerStyle={styles.comicList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#303030',
  },
  alignImage: {
    display: 'flex',
    alignItems: 'center',
  },
  titleName: {
    color: '#FFFFFF',
    fontSize: 20,
    paddingTop: 14,
    fontWeight: '700',
    fontFamily: 'Barlow-Regular',
  },
  thumbnail: {
    marginTop: 20,
    width: 156,
    height: 156,
    borderRadius: 80,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 16,
    paddingTop: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'transparent',
    borderRadius: 5,
  },
  buttonText: {
    color: '#B50F16',
    fontSize: 16,
    textAlign: 'center',
  },
  comicList: {
    padding: 20,
  },
  titleComics: {
    color: '#FFFFFF',
    fontSize: 20,
    paddingTop: 14,
    fontWeight: '700',
    fontFamily: 'Barlow-Regular',
    textAlign: 'center',
  },
  comicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  comicImage: {
    width: 50,
    height: 75,
    marginRight: 10,
  },
  comicText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default CharacterDetailScreen;
