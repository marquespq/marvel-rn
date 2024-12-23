import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#B50F16',
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icSearch: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    textAlign: 'right',
  },
  title: {
    fontSize: 20,
    lineHeight: 24,
    color: '#fff',
    fontFamily: 'Barlow Condensed',
    fontWeight: '700',
  },
  searchInput: {
    backgroundColor: 'transparent',
    flex: 1,
    color: '#FFFFFF',
    fontSize: 20,
  },
  iconButton: {
    padding: 10,
  },
  icon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  backgroundStyle: {
    backgroundColor: '#303030',
    flex: 1,
  },
  view: {
    backgroundColor: '#303030',
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  scrollView: {
    padding: 8,
  },
  nameText: {
    color: '#FFFFFF',
    flex: 1,
    fontFamily: 'Barlow-Regular',
    fontSize: 16,
    marginLeft: 10,
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
  details: {
    color: '#b50f16',
    fontSize: 34,
    cursor: 'pointer',
    fontWeight: '400',
  },
});

export default styles;
