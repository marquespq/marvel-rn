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

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const characterComics = await fetchCharacterComics(character.id);
        setComics(characterComics);
      } catch (fetchError) {
        setError('Não foi possível carregar os quadrinhos.');
        console.error('Erro ao buscar quadrinhos:', fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, [character.id]);

  const toggleDescription = () => {
    setIsExpanded(prev => !prev);
  };

  const renderDescription = () => {
    const descriptionText =
      character.description || 'Descrição não disponível.';
    const isLongDescription = descriptionText.length > 100;

    return (
      <>
        <Text style={styles.description}>
          {isExpanded || !isLongDescription
            ? descriptionText
            : `${descriptionText.substring(0, 100)}...`}
        </Text>
        {isLongDescription && (
          <TouchableOpacity onPress={toggleDescription} style={styles.button}>
            <Image
              source={
                isExpanded
                  ? require('../../assets/expand+.png')
                  : require('../../assets/expand-.png')
              }
              style={styles.buttonExpand}
            />
          </TouchableOpacity>
        )}
      </>
    );
  };

  const renderComics = () => (
    <FlatList
      data={comics}
      keyExtractor={item => item.resourceURI}
      renderItem={({item}) => <ComicItem item={item} />}
      contentContainerStyle={styles.comicList}
    />
  );

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

      {renderDescription()}

      <Text style={styles.titleComics}>Comics</Text>
      {renderComics()}
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
