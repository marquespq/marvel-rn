import React from 'react';
import {FlatList, Text} from 'react-native';
import CharacterItem from './CharacterItem';
import styles from './CharactersScreenStyles';

interface CharacterListProps {
  sections: Array<{title: string; data: any[]}>;
  favorites: Set<number>;
  onToggleFavorite: (characterId: number) => void;
  onLoadMore: () => void;
  navigation: any;
  isLoading: boolean;
}

const CharacterList: React.FC<CharacterListProps> = ({
  sections,
  favorites,
  onToggleFavorite,
  onLoadMore,
  navigation,
}) => {
  return (
    <FlatList
      data={sections.flatMap(section => [
        {title: section.title, isHeader: true},
        ...section.data,
      ])}
      keyExtractor={item =>
        item.isHeader ? `header-${item.title}` : item?.id?.toString()
      }
      renderItem={({item}: any) =>
        item.isHeader ? (
          <Text style={styles.sectionHeader}>{item.title}</Text>
        ) : (
          <CharacterItem
            character={item}
            isFavorite={favorites.has(item.id)}
            onToggleFavorite={onToggleFavorite}
            navigation={navigation}
          />
        )
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      contentContainerStyle={styles.scrollView}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={21}
    />
  );
};

export default CharacterList;
