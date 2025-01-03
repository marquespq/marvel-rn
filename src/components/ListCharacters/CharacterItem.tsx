import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styles from './CharactersScreenStyles';

interface CharacterItemProps {
  character: any;
  isFavorite: boolean;
  onToggleFavorite: (characterId: number) => void;
  navigation: any;
}

const CharacterItem: React.FC<CharacterItemProps> = ({
  character,
  isFavorite,
  onToggleFavorite,
  navigation,
}) => {
  return (
    <View key={character.id.toString()} style={styles.view}>
      <Image
        source={{
          uri: `https${character.thumbnail.path.substring(4)}.${
            character.thumbnail.extension
          }`,
        }}
        style={styles.thumbnail}
        resizeMethod="resize"
        resizeMode="contain"
      />
      <Text style={styles.nameText}>{character.name}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('CharacterDetail', {character})}>
        <Image source={require('../../../assets/go-to-page.png')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onToggleFavorite(character.id)}>
        <Image
          source={
            isFavorite
              ? require('../../../assets/filledstar.png')
              : require('../../../assets/emptystar.png')
          }
          style={styles.favoriteIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CharacterItem;
