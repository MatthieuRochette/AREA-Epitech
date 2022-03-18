import { StyleSheet } from "react-native";

const SettingsCSS = StyleSheet.create({
  settings: {
    display: 'flex',
    marginTop: '5%',
    height: '90%',
    width: '90%',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  githubCard: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  trelloCard: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
  },

  deleteAllCard: {
    marginTop: '20%',
    display: 'flex',
    flexWrap: 'wrap'
  }
});

export default SettingsCSS;