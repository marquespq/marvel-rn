import React from 'react';
import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native';
import styles from './CharactersScreenStyles';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSearchActive: boolean;
  setIsSearchActive: (isActive: boolean) => void;
  clearSearch: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  setSearchTerm,
  isSearchActive,
  setIsSearchActive,
  clearSearch,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        {!isSearchActive ? (
          <Text style={styles.title}>Characters</Text>
        ) : (
          <TextInput
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Name of character"
            placeholderTextColor="#FFFFFF8A"
          />
        )}
      </View>
      <TouchableOpacity
        onPress={() =>
          isSearchActive ? clearSearch() : setIsSearchActive(true)
        }
        style={styles.iconButton}>
        <View style={styles.icSearch}>
          {!isSearchActive ? (
            <Image source={require('../../../assets/search.png')} />
          ) : (
            <Text style={styles.icon}>❌</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
