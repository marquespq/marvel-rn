import {StyleSheet} from 'react-native';

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

export default styles;
