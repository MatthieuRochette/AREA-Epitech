import { StyleSheet } from 'react-native';

const DrawerCSS = StyleSheet.create({
  drawerContent: {
    flex: 1
  },

  userInfoSection: {
    paddingLeft: 20
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 3
  },

  email: {
    fontSize: 14,
    lineHeight: 14
  },

  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },

  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15
  },

  paragraph: {
    fontWeight: 'bold',
    marginRight: 15
  },

  drawerSection: {
    marginTop: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1
  },

  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1
  },

  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16
  }
});

export default DrawerCSS;