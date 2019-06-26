import React, {Component} from 'react';
import {
  AppRegistry,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';


type Props = {};
export default class ResultScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
    this.state.obj = this.props.navigation.getParam('obj', {});
    this.state.attrib = this.props.navigation.getParam('attrib','ERROR');
    this.state.num = this.props.navigation.getParam('num','ERROR');
    this.state.delDate = new Date(this.state.obj.Container[0].LineItems[0].RequiredDeliveryDate.value);
    this.state.shipID = this.state.obj.ShipmentID;
    this.state.PONum = this.state.obj.Container[0].LineItems[0].PONumber;
    this.state.ident = (this.state.attrib == 'ShipID') ? "ID " + this.state.num : "PO Number " + this.state.num;
  };
  static navigationOptions = {
    title: 'Lookup Results',
  };

  render() {
    return (
      <View style={styles.header}>
        <Text>{`\n`}</Text>
        <Image style={{width:230, height:70, justifyContent: 'flex-start'}} resizeMethod={'resize'} source={require('./images/Syngenta_Logo.png')}/>
          <View style={styles.container}>
            <Text style = {styles.welcome}><Text style={{fontWeight:'bold'}}>{'Your shipment with: \n'}</Text>{'Shipment ID: '}{this.state.shipID}{'\n'}{'PO Number: '}{this.state.PONum}{'\n\n'}<Text style={{fontWeight:'bold'}}>{'Is scheduled to arrive on: \n'}</Text>
            {this.state.delDate.toDateString()}{' | '}{this.state.delDate.getHours()}{':'}{(this.state.delDate.getMinutes() == 0 ? '00' : this.state.delDate.getMinutes())}{'\n\n\n\n\n\n'}</Text>
          </View>
      </View>
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
