import { StyleSheet } from "react-native";

const ServicesCSS = StyleSheet.create({
  jobCard: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#808080',
    flexWrap: 'wrap'
  },
  actionCard: {
    width: '50%',
    display: 'flex',
    flexWrap: 'wrap',
  },
  reactionsCard: {
    width: '50%',
    display: 'flex',
    flexWrap: 'wrap'
  },

  triggerCard: {
    width: '50%',
    display: 'flex',
    flexWrap: 'wrap'
  }
});

export default ServicesCSS;