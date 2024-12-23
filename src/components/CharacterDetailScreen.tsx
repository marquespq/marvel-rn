import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {fetchCharacterComics} from '../service/characters';
import {Comic} from '../interfaces/Comic';
import styles from './CharacterDetailScreenStyles';

const CharacterDetailScreen = ({route}: any) => {
  const {character} = route.params;
  const [isExpanded, setIsExpanded] = useState(false);
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

export default CharacterDetailScreen;
