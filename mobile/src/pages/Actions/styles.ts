import { StyleSheet } from "react-native";

const ActionsCSS = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },

  itemStyle: {
    fontSize: 15,
    height: 75,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold'
  },

  picker: {
    width: '100%'
  },

  actionCard: {
    display: 'flex',
    width: '90%',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: '#BEBEBE',
    borderTopWidth: 1,
  },

  serviceCard: {
    display: 'flex',
    width: '100%',
    marginBottom: 5,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#808080',
  },

  intervalCard: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },

  daysInput: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },

  timeInput: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25
  }
});

export default ActionsCSS;