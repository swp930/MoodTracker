import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView, Slider, Button } from 'react-native';

import firebase from 'react-native-firebase';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin'
import { thisTypeAnnotation } from '@babel/types';
//import console = require('console');

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      slide1: -1,
      slide2: -1,
      email: "",
      id: "",
      name: ""
    };

    this.googleLogin()
    this.ref = firebase.firestore().collection('mood-user1')
  }

  async componentDidMount() {
    // TODO: You: Do firebase things
    // const { user } = await firebase.auth().signInAnonymously();
    // console.warn('User -> ', user.toJSON());

    // await firebase.analytics().logEvent('foo', { bar: '123'});
  }

  submitData() {
    console.log(this.state)

    db = firebase.firestore().collection("users")
    db.doc(this.state.email).set({
      "name": this.state.name,
      "email": this.state.email
    })

    db = db.doc(this.state.email)
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    db.collection("mooddata").doc(dateTime).set({
      "slider1": this.state.slide1,
      "slider2": this.state.slide2
    })
  }

  async googleLogin() {
    try {
      await GoogleSignin.configure();
      const data = await GoogleSignin.signIn()
      this.setState({
        email: data.user.email,
        id: data.user.id,
        name: data.user.name
      })
      const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
      const firebaseUserCredential = await firebase.auth().signInWithCredential(credential)

      //console.warn(JSON.stringify(firebaseUserCredential.user.toJSON()))
    } catch(e) {
      console.error(e)
    }
  }

  /*
  <GoogleSigninButton
          style={{ width: 192, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={this.googleLogin()}/>
  */

  render() {
    return (
      <ScrollView>
        <Text style={styles.logo}>Mood Tracking App</Text>
        <Text>How relaxed vs anxious do you feel right now?</Text>
        <Slider
          step={1}
          maximumValue={100}
          value={0}
          onValueChange={(value) => this.setState({slide1: value})}
        />
        <Text>{this.state.slide1}</Text>
        <Text>How happy versus sad do you feel right now?</Text>
        <Slider
          step={1}
          maximumValue={100}
          value={0}
          onValueChange={(value) => this.setState({slide2: value})}
        />
        <Text>{this.state.slide2}</Text>
        <Button
            title={'Submit'}
            disabled={this.state.slide1 == -1 || this.state.slide2 == -1}
            onPress={() => this.submitData()}
          />
        <Text>
          {this.state.email}
        </Text>
        <Text>
          {this.state.id}
        </Text>
        <Text>
          {this.state.name}
        </Text>
      </ScrollView>
    );
  }
}

/*
<ScrollView>
        <View style={styles.container}>
          <Image source={require('./assets/ReactNativeFirebase.png')} style={[styles.logo]}/>
          <Text style={styles.welcome}>
            Welcome to {'\n'} React Native Firebase
          </Text>
          <Text style={styles.instructions}>
            To get started, edit App.js
          </Text>
          {Platform.OS === 'ios' ? (
            <Text style={styles.instructions}>
              Press Cmd+R to reload,{'\n'}
              Cmd+D or shake for dev menu
            </Text>
          ) : (
            <Text style={styles.instructions}>
              Double tap R on your keyboard to reload,{'\n'}
              Cmd+M or shake for dev menu
            </Text>
          )}
          <View style={styles.modules}>
            <Text style={styles.modulesHeader}>The following Firebase modules are pre-installed:</Text>
            {firebase.admob.nativeModuleExists && <Text style={styles.module}>admob()</Text>}
            {firebase.analytics.nativeModuleExists && <Text style={styles.module}>analytics()</Text>}
            {firebase.auth.nativeModuleExists && <Text style={styles.module}>auth()</Text>}
            {firebase.config.nativeModuleExists && <Text style={styles.module}>config()</Text>}
            {firebase.crashlytics.nativeModuleExists && <Text style={styles.module}>crashlytics()</Text>}
            {firebase.database.nativeModuleExists && <Text style={styles.module}>database()</Text>}
            {firebase.firestore.nativeModuleExists && <Text style={styles.module}>firestore()</Text>}
            {firebase.functions.nativeModuleExists && <Text style={styles.module}>functions()</Text>}
            {firebase.iid.nativeModuleExists && <Text style={styles.module}>iid()</Text>}
            {firebase.invites.nativeModuleExists && <Text style={styles.module}>invites()</Text>}
            {firebase.links.nativeModuleExists && <Text style={styles.module}>links()</Text>}
            {firebase.messaging.nativeModuleExists && <Text style={styles.module}>messaging()</Text>}
            {firebase.notifications.nativeModuleExists && <Text style={styles.module}>notifications()</Text>}
            {firebase.perf.nativeModuleExists && <Text style={styles.module}>perf()</Text>}
            {firebase.storage.nativeModuleExists && <Text style={styles.module}>storage()</Text>}
          </View>
        </View>
      </ScrollView>
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  logo: {
    height: 120,
    marginBottom: 0,
    marginTop: 64,
    padding: 10,
    width: 200,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  modules: {
    margin: 20,
  },
  modulesHeader: {
    fontSize: 16,
    marginBottom: 8,
  },
  module: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  }
});
