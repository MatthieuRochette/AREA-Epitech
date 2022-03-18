import React, {
  FC,
  useEffect,
  useState
} from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Button,
  Text,
  TextInput,
  View
} from "react-native";
import Modal from "react-native-modal";
import { requestSignUp } from "./api";
import { APISignUp } from "../../global/result";
import SignUpCSS from "./styles";

const SignUp: FC = () => {
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [confirm_pw, setConfirm] = useState<string>();
  const [disable, setDisable] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<string>();
  const navigation = useNavigation();

  const onBack = () =>
    navigation.goBack();

  const onChangeName = (name: string) => 
    setName(name);

  const onChangeEmail = (email: string) => 
    setEmail(email);

  const onChangePassword = (password: string) => 
    setPassword(password);

  const onChangeConfirm = (confirm: string) => 
    setConfirm(confirm);

  const onSubmit = async () => {
    await requestSignUp(name!, email!, password!, confirm_pw!)
      .then((response) => response.json())
      .then((data: APISignUp) =>
        setModalContent(`
          Welcome 👋 ${data.name}\n
          You can validate your account by using a link that was sent to this email address : ${data.email} !\n
          Then just log in into your account on the login screen with your email: ${data.email} and the password you entered when creating your account !\n
          We hope you'll enjoy using AREA Tirer !\n
          The AREA Tirer team.
        `)).catch((error: Error) => setModalContent(error.toString()));
    setModalVisible(true)
  }
  
  const validate = () => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!name)
      return false;
    if (!email || !re.test(email))
      return false;
    if (!password || password.length < 8)
      return false;
    if (!confirm_pw || confirm_pw.length < 8)
      return false;
    return true;
  }

  useEffect(() => {
    if (validate())
      setDisable(false);
    else
      setDisable(true);
  }, [name, email, password, confirm_pw]);

  return (
    <>
      <View style={SignUpCSS.backButton}> 
        <Button 
          title="←"
          onPress={onBack}
        />
      </View>

      <TextInput
        style={SignUpCSS.nameInput}
        value={name}
        placeholder="Name"
        onChangeText={onChangeName}
        autoCompleteType="name" />

      <TextInput
        style={SignUpCSS.emailInput}
        value={email}
        placeholder="Email Address"
        onChangeText={onChangeEmail}
        autoCompleteType="email" />

      <TextInput
        style={SignUpCSS.passwordInput}
        value={password}
        placeholder="Password"
        onChangeText={onChangePassword}
        autoCompleteType="password"
        secureTextEntry={true} />
      
      <TextInput
        style={SignUpCSS.confirmInput}
        value={confirm_pw}
        placeholder="Confirm password"
        onChangeText={onChangeConfirm}
        autoCompleteType="password"
        secureTextEntry={true} />

      <View style={SignUpCSS.submitButton}>
        <Button
          title="SUBMIT"
          disabled={disable}
          onPress={onSubmit} />
      </View>

      <Text style={SignUpCSS.copyright}>
        © 2021 AREA
      </Text>

      <View>
        <Modal
          isVisible={modalVisible}
          onBackdropPress={() => setModalVisible(false)}
          onBackButtonPress={() => setModalVisible(false)}
        >
          <View style={SignUpCSS.modal}>
            <Text>{modalContent}</Text>
          </View>
        </Modal>
      </View>
  </>
  )
}




export default SignUp;