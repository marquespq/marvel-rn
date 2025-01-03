import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Button,
  Modal,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {fetchCharacterComics} from '../../service/characters';
import {Comic} from '../../interfaces/Comic';
import styles from './CharacterDetailScreenStyles';
import CameraComponent from '../Camera/CameraComponent';
import {Camera} from 'react-native-vision-camera';

const CharacterDetailScreen = ({route}: any) => {
  const {character} = route.params;
  const [isExpanded, setIsExpanded] = useState(false);
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCameraVisible, setIsCameraVisible] = useState(false);

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
                  ? require('../../../assets/expandMore.png')
                  : require('../../../assets/noExpand.png')
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

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Permissão de Câmera',
          message: 'Este aplicativo precisa acessar sua câmera.',
          buttonNeutral: 'Pergunte-me depois',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const checkCameraPermission = async () => {
    const status = await Camera.getCameraPermissionStatus();
    return (status as any) === 'authorized';
  };

  const handleOpenCamera = async () => {
    const hasPermission = await checkCameraPermission();
    if (hasPermission) {
      setIsCameraVisible(true);
    } else {
      const permissionGranted = await requestCameraPermission();
      if (permissionGranted) {
        setIsCameraVisible(true);
      } else {
        Alert.alert(
          'Permissão Negada',
          'Você precisa conceder permissão para usar a câmera.',
          [{text: 'OK'}],
        );
      }
    }
  };

  const handleCloseCamera = () => {
    setIsCameraVisible(false);
  };

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
            uri: `https${character.thumbnail.path.substring(4)}.${
              character.thumbnail.extension
            }`,
          }}
          style={styles.thumbnail}
        />
        <Text style={styles.titleName}>{character.name}</Text>
      </View>

      {renderDescription()}

      <Text style={styles.titleComics}>Comics</Text>
      {renderComics()}

      <Button title="Abrir Câmera" onPress={handleOpenCamera} />

      {isCameraVisible && (
        <Modal visible={isCameraVisible}>
          <CameraComponent onClose={handleCloseCamera} />
        </Modal>
      )}
    </View>
  );
};

const ComicItem = React.memo(({item}: {item: Comic}) => {
  const comicImageUri = `https${item.thumbnail.path.substring(4)}.${
    item.thumbnail.extension
  }`;

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
