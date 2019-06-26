import React, {Component} from 'react';
import {
  Alert,
  AppRegistry,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import Environments from './environments'

var CryptoJS = require('crypto-js');
var utf8 = require('utf8');


type Props = {};
export default class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.state={};
    this.state.shipID = '';
    this.state.PONum = '';
    this.state.attrib = '';
    this.state.accessKeyID = Environments[0].accessKeyID;
    this.state.userID = Environments[0].userID;
    this.state.dataKey = Environments[0].dataKey;
    this.state.SAC = Environments[0].SAC;
    this.state.loading = false;
    this.shipInp = React.createRef();
    this.POInp = React.createRef();
  };
  static navigationOptions = {
    title: 'Syngenta Shipment Lookup',
  };

  async lookup(btn){
    this.state.loading = true;
    Keyboard.dismiss();
    this.forceUpdate();  //forces render to reload and show loading
    var tofind = '';
    if(btn=="ShipID"){
      tofind = this.state.shipID;
      this.state.attrib = "ShipmentID";
    } else {
      tofind = this.state.PONum;
      this.state.attrib = "PONumber";
    }
    //start hmac 1
    let today = new Date();
    var iso = today.toISOString().toLowerCase();
    //%3d is '=', %27 is "
    var sts = iso + 'get' + '/rest/3.1/asntype/query?oql=' + this.state.attrib + '%3d' + '%27' + tofind + '%27';
    SignToString = utf8.encode(sts.toLowerCase());
    var signature = CryptoJS.HmacSHA256(SignToString,this.state.SAC).toString(CryptoJS.enc.Base64);
    let response = await fetch('https://preprod.gtnexus.com/rest/3.1/ASNType/query?oql=' + this.state.attrib + '%3d' + '%27' + tofind + '%27', {
      method: 'GET',
      headers: {
        'Authorization': 'HMAC_1 ' + this.state.accessKeyID + ':' + signature + ':' + this.state.userID,
        'x-dapi-date': iso,
        'dataKey': this.state.dataKey
      }
    });
    //end hmac 1
    queryjson = await response.json();
    if(!queryjson.result){
      this.state.loading = false;
      Alert.alert("No shipments found with that parameter.  Please try again.",'',[{text: 'OK', onPress:()=>this.forceUpdate()}],{cancelable: false});
      return;
    }
    objUID = queryjson.result[0].__metadata.uid;
    //start hmac 2
    sts2 = iso + 'get' + '/rest/3.1/asntype/' + objUID;
    SignToString2 = utf8.encode(sts2.toLowerCase());
    var signature2 = CryptoJS.HmacSHA256(SignToString2,this.state.SAC).toString(CryptoJS.enc.Base64);
    let object = await fetch('https://preprod.gtnexus.com/rest/3.1/ASNType/'+objUID,{
      method: 'GET',
      headers: {
        'Authorization': 'HMAC_1 ' + this.state.accessKeyID + ':' + signature2 + ':' + this.state.userID,
        'x-dapi-date': iso,
        'dataKey': this.state.dataKey
      }
    });
    //end hmac 2
    objjson = await object.json();
    this.props.navigation.navigate("Result", {obj: objjson, attrib: this.state.attrib, num: tofind});
    this.state.loading = false;
    this.shipInp.clear();
    this.POInp.clear();
    this.forceUpdate();
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.header} behavior={Platform.OS === "ios" ? "padding" : null}>
        <Spinner
          visible={this.state.loading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      <Text>{`\n\n\n`}</Text>
      <Image style={{width:230, height:Platform.OS === "ios" ? 70 : 0, justifyContent: 'flex-start'}} resizeMethod={'resize'} source={require('./images/Syngenta_Logo.png')}/>
        <View style={styles.container}>
          <Image style={{width:230, height:Platform.OS === "ios" ? 0 : 70, justifyContent: 'flex-start'}} resizeMethod={'resize'} source={require('./images/Syngenta_Logo.png')}/>
          <TextInput style={styles.instructions} ref={input => { this.shipInp = input }} placeholder="Shipment ID" onChangeText={(shipID) => this.setState({shipID})}/><Button onPress={() => {this.lookup("ShipID")}} title="Search"/>
          <Text>{`\n\n\n`}</Text>
          <TextInput style={styles.instructions} ref={input => { this.POInp = input }} placeholder="PO Number" onChangeText={(PONum) => this.setState({PONum})}/><Button onPress={() => {this.lookup("PONum")}} title="Search"/>
          <Text>{`\n\n\n\n\n\n`}</Text>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    fontSize: 40,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
});
