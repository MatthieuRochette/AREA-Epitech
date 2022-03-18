import { StyleSheet } from "react-native";

const LoginCSS = StyleSheet.create({
  title: {
    margin: 10
  },

  emailInput: {
    margin: 10
  },

  passwordInput: {
    margin: 10
  },

  continueButton: {
    margin: 10
  },

  alternativeLogins: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  
  githubButton: {
    margin: 5,
    width: '46.3%'
  },

  trelloButton: {
    margin: 5,
    width: '46.3%'
  },

  signUpButton: {
    margin: 10
  },

  copyright: {
    margin: 10
  },
  
  modal: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  }
});

export default LoginCSS;