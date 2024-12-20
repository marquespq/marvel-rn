import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {fetchCharacterComics} from '../service/characters';
import {Comic} from '../interfaces/Comic';

const CharacterDetailScreen = ({route}: any) => {
  const {character} = route.params;
  const [isExpanded, setIsExpanded] = useState(false);
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Estado para erros

  const toggleDescription = () => {
    setIsExpanded(prev => !prev);
  };

  const descriptionText =
    character.description ||
    'Our writer is busy saving the Semantics World, so this character doesn’t have a description yet!';
  const isLongDescription = descriptionText.length > 100;

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const characterComics = await fetchCharacterComics(character.id);
        setComics(characterComics);
      } catch (error) {
        setError('Não foi possível carregar os quadrinhos.');
        console.error('Erro ao buscar quadrinhos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, [character.id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

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
        renderItem={({item}) => <ComicItem item={item} />}
        contentContainerStyle={styles.comicList}
      />
    </View>
  );
};

const ComicItem = React.memo(({item}: {item: Comic}) => {
  const comicImageUri = `${item.thumbnail.path}.${item.thumbnail.extension}`;

  return (
    <View style={styles.comicItem}>
      <Image source={{uri: comicImageUri}} style={styles.comicImage} />
      <Text style={styles.comicText}>
        {item.title || 'Título não disponível'}
      </Text>
    </View>
  );
});

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
    padding: 10,
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
    width: '100%',
  },
  comicImage: {
    width: 50,
    height: 75,
    marginRight: 10,
  },
  comicText: {
    color: '#FFFFFF',
    fontSize: 16,
    flexWrap: 'wrap',
    flex: 1,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CharacterDetailScreen;
