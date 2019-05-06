import React from 'react';
import { Alert, AppState, StyleSheet, Platform, Image, Text, View, ScrollView, Slider, Button } from 'react-native';
import NotifService from './NotifService'

import firebase from 'react-native-firebase';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin'
import { thisTypeAnnotation } from '@babel/types';
//import console = require('console');

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      slide1: 0,
      slide2: 0,
      email: "sdpatil@ucsd.edu",
      id: "sdpatil@ucsd.edu",
      name: "Swapnil Patil",
      checked: false,
      nextWeekChecked: false,
      dates: ["0:00", "0:01", "0:02", "0:03", "0:04", "23:59"],
      appState: AppState.currentState
    };
    //this.ref = firebase.firestore().collection("cities").doc("LA")
    this.isCurrentSlotSubmitted()
    this.isNextWeekChecked()
    this.printDate(new Date())

    this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
    //console.log(this.checkIfUserExists("swp930@gmail.com"))
    this.googleLogin()
  }

  async componentDidMount() {
    // TODO: You: Do firebase things
    // const { user } = await firebase.auth().signInAnonymously();
    // console.warn('User -> ', user.toJSON());

    // await firebase.analytics().logEvent('foo', { bar: '123'});
    //var nextWeekDate = this.getNextFirstWeekDate(new Date())
    //var nextWeekDateStr = (nextWeekDate.getMonth()+1) + "-" + nextWeekDate.getDate()
    //this.unsubscribe = firebase.firestore().collection("config").doc("notifs").collection("weeks").doc(nextWeekDateStr).onSnapshot(this.onCollectionUpdate)
    //console.log("Will mount screen")
    //this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)
    AppState.addEventListener('change', this._handleAppStateChange)
  }

  componentWillUnmount() {
    //this.unsubscribe()
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  /*onCollectionUpdate = (querySnapshot) => {
    console.log("Updated!")
    // TODO
    const todos = []
    console.log(querySnapshot.data())
  }*/

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      //console.log('App has come to the foreground!');
      this.isCurrentSlotSubmitted()
      this.isNextWeekChecked()
    }
    this.setState({appState: nextAppState});
  };

  submitData() {
    var todaysDate = new Date();
    var docDate = "" + todaysDate.getFullYear() + "-" + (todaysDate.getMonth() + 1) + "-" + todaysDate.getDate()
    var slot = "slot" + this.getCurrentSlot()
    //var docDate = "" + todaysDate.getFullYear() + "-" + (5) + "-" + 1
    /*db = firebase.firestore().collection("users").doc("sdpatil@ucsd.edu").collection("mooddata").doc(docDate).collection("data").doc(slot).set({
      "slider1": this.state.slide1,
      "slider2": this.state.slide2,
      checked: true
    })*/
    db = firebase.firestore().collection("users").doc(this.state.email).collection("mooddata").doc(docDate).collection("data").doc(slot).set({
      "slider1": this.state.slide1,
      "slider2": this.state.slide2,
      checked: true
    })

    if(slot === "slot5") {
      console.log("New day")
      this.createNewDay();
      if(!this.state.nextWeekChecked) {
        this.addNewWeek()
        this.scheduleNotifications()
      }
    }
    this.isCurrentSlotSubmitted()
    this.isNextWeekChecked()
  }

  addNewWeek() {
    var nextWeekDate = this.getNextFirstWeekDate(new Date())
    var nextWeekDateStr = (nextWeekDate.getMonth()+1) + "-" + nextWeekDate.getDate()
    /*db = firebase.firestore().collection("config").doc("notifs").collection("weeks").doc(nextWeekDateStr).set({
      checked: "true"
    })*/
    /*db = firebase.firestore().collection("users").doc("sdpatil@ucsd.edu").collection("weeks").doc(nextWeekDateStr).set({
      checked: "true"
    })*/
    db = firebase.firestore().collection("users").doc(this.state.email).collection("weeks").doc(nextWeekDateStr).set({
      checked: "true"
    })
    var weekAfter = new Date(nextWeekDate.getTime() + 7*(24 * 60 * 60 * 1000))
    var weekAfterStr = (weekAfter.getMonth()+1) + "-" + weekAfter.getDate()
    /*db = firebase.firestore().collection("users").doc("sdpatil@ucsd.edu").collection("weeks").doc(nextWeekDateStr).set({
      checked: "false"
    })*/
    db = firebase.firestore().collection("users").doc(this.state.email).collection("weeks").doc(nextWeekDateStr).set({
      checked: "false"
    })
  }

  createNewDay() {
    var times = this.state.dates
    var tomDate = new Date(Date.now() + (24 * 60 * 60 * 1000)) // in 24 * 60 * 60 secs
    var day = tomDate.getFullYear()+'-'+(tomDate.getMonth()+1)+'-'+tomDate.getDate();
    console.log(day)
    this.createDay(day)
    //var day = tomDate.getFullYear()+'-'+(tomDate.getMonth()+1)+'-'+2;

    /*db = firebase.firestore().collection("users").doc(this.state.email).collection("mooddata") // Also works
    db.doc("newdoc").set({
      "key": "value"
    })

    db.doc("newdoc").collection("data").doc("slot1").set({
      "key": "value"
    })*/

    //db = firebase.firestore().collection("users").doc(this.state.email).collection("mooddata") // Also works
    
  }

  createDay(day) {
    /*db = firebase.firestore().collection("users").doc("swp930@gmail.com").collection("mooddata") // Also works
    db.doc(day).set({
      //"key": "value"
    })*/
    db = firebase.firestore().collection("users")
    /*db.doc("sdpatil@ucsd.edu").set({
      "email": "sdpatil@ucsd.edu",
      "name": "Swapnil Patil"
    })*/
    db.doc(this.state.email).set({
      "email": this.state.email,
      "name": this.state.name
    })
    //db = db.doc("sdpatil@ucsd.edu").collection("mooddata")
    db = db.doc(this.state.email).collection("mooddata")
    db.doc(day).set({
    })

    db.doc(day).collection("data").doc("slot1").set({
      "slider1": -1,
      "slider2": -1,
      "checked": false
    })

    db.doc(day).collection("data").doc("slot2").set({
      "slider1": -1,
      "slider2": -1,
      "checked": false
    })

    db.doc(day).collection("data").doc("slot3").set({
      "slider1": -1,
      "slider2": -1,
      "checked": false
    })

    db.doc(day).collection("data").doc("slot4").set({
      "slider1": -1,
      "slider2": -1,
      "checked": false
    })

    db.doc(day).collection("data").doc("slot5").set({
      "slider1": -1,
      "slider2": -1,
      "checked": false
    })
  }

  isNextWeekChecked() {
    var nextWeekDate = this.getNextFirstWeekDate(new Date())
    var nextWeekDateStr = (nextWeekDate.getMonth()+1) + "-" + nextWeekDate.getDate()
    //db = firebase.firestore().collection("config").doc("notifs").collection("weeks").doc(nextWeekDateStr)
    //db = firebase.firestore().collection("users").doc("sdpatil@ucsd.edu").collection("weeks").doc(nextWeekDateStr)
    db = firebase.firestore().collection("users").doc(this.state.email).collection("weeks").doc(nextWeekDateStr)
    db.get().then((doc) => {
      if (doc.exists) {
          console.log("Next week Document data:", doc.data().checked);
          obj = doc.data()
          this.setState({nextWeekChecked: doc.data().checked})
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });
  }

  isCurrentSlotSubmitted() {
    var todaysDate = new Date();
    //var docDate = "" + todaysDate.getFullYear() + "-" + (5) + "-" + 1
    var docDate = "" + todaysDate.getFullYear() + "-" + (todaysDate.getMonth() + 1) + "-" + todaysDate.getDate()
    //console.log(docDate)
    var slot = "slot" + this.getCurrentSlot()
    //console.log(this.getCurrentSlot())
    //db = firebase.firestore().collection("users").doc("sdpatil@ucsd.edu").collection("mooddata").doc(docDate).collection("data").doc(slot)
    db = firebase.firestore().collection("users").doc(this.state.email).collection("mooddata").doc(docDate).collection("data").doc(slot)
    var obj = {};
    db.get().then((doc) => {
      if (doc.exists) {
          console.log("Mooddata document data:", doc.data());
          obj = doc.data()
          this.setState({checked: doc.data().checked})
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });
    //console.log(obj)
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

      if(!this.checkIfUserExists(data.user.email))
        this.createNewUser()

      //console.warn(JSON.stringify(firebaseUserCredential.user.toJSON()))
    } catch(e) {
      console.error(e)
    }
  }

  checkIfUserExists(user) {
    console.log(user)
    db = firebase.firestore().collection("users").where("email", "==", user)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          console.log("User exists!")
          return true
      });
    }).catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    console.log("User doesn't exist!")
    return false
  }

  createNewUser() {
    var times = this.state.dates
    var currDate = new Date() // in 24 * 60 * 60 secs
    var day = currDate.getFullYear()+'-'+(currDate.getMonth()+1)+'-'+currDate.getDate();
    console.log(day)
    this.createDay(day)
    var currWeek = new Date(currDate.getTime()  - currDate.getDay()*(24 * 60 * 60 * 1000))
    var currWeekDay = currWeek.getFullYear()+'-'+(currWeek.getMonth()+1)+'-'+currWeek.getDate();
    //db = db.doc("sdpatil@ucsd.edu").collection("weeks")
    db = db.doc(this.state.email).collection("weeks")
    db.doc(currWeekDay).set({
      "checked": "false"
    })
  }

  getCurrentSlot() {
    var dates = this.state.dates
    datesVars = dates.map((d) => {
      var currDate = new Date();
      time = d.split(":")
      currDate.setHours(parseInt(time[0], 10))
      currDate.setMinutes(parseInt(time[1], 10))
      return currDate;
    })
    /*for(var i = 0; i < datesVars.length; i++)
      this.printDate(datesVars[i])*/
    var currTime = new Date();
    //this.printDate(currTime)
    for(var i = 0; i < dates.length - 1; i++) {
      if(currTime >= datesVars[i] && currTime <= datesVars[i + 1])
        return i + 1
    }
  }

  printDate(inDate) {
    var date = inDate.getFullYear()+'-'+(inDate.getMonth()+1)+'-'+inDate.getDate();
    var time = inDate.getHours() + ":" + inDate.getMinutes() + ":" + inDate.getSeconds();
    var dateTime = date+' '+time;
    console.log(dateTime)
  }

  getNextFirstWeekDate(inDate) {
    var inDate3 = new Date(inDate.getTime() + (7 - inDate.getDay())*(24 * 60 * 60 * 1000))
    return inDate3
  }

  scheduleNotifications() {
    /*var startNW = this.getNextFirstWeekDate(new Date())
    var dates = this.state.dates
    var arr = []
    for(var i = 0; i < 7; i++) {
      var newDate = new Date(startNW.getTime())
      newDate = new Date(newDate.getTime() + i*(24 * 60 * 60 * 1000))
      for(var j = 0; j < dates.length - 1; j++) {
        var currDate = new Date(newDate.getTime())
        var data = dates[j].split(":")
        var hr = parseInt(data[0], 10)
        var min = parseInt(data[1], 10)
        currDate.setHours(hr)
        currDate.setMinutes(min)
        arr.push(currDate)
      }
    }
    for(var i = 0; i < arr.length; i++)
      this.notif.scheduleNotifAtDate(arr[i])*/
    var dateToRunAt = new Date()
    dateToRunAt.setMinutes(43)
    this.notif.scheduleNotifAtDate(dateToRunAt)
    console.log("Scheduled notification to run at:")
    this.printDate(dateToRunAt)
  }

  onRegister(token) {
    Alert.alert("Registered !", JSON.stringify(token));
    console.log(token);
    this.setState({ registerToken: token.token, gcmRegistered: true });
  }

  onNotif(notif) {
    console.log(notif);
    Alert.alert(notif.title, notif.message);
  }

  handlePerm(perms) {
    Alert.alert("Permissions", JSON.stringify(perms));
  }

  render() {
    //this.isNextWeekChecked()
    //this.isCurrentSlotSubmitted()
    //var firstWeekDate = this.getNextFirstWeekDate(new Date())
    //var firstWeekDateStr = (firstWeekDate.getMonth()+1) + "-" + firstWeekDate.getDate()
    //console.log(firstWeekDateStr)
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
            disabled={this.state.checked}
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

        <Text>
          {"" + this.state.checked}
        </Text>
        <Text>
          {"" + this.state.nextWeekChecked}
        </Text>
        <Text>
          Current state is: {this.state.appState}
        </Text>
      </ScrollView>
    );
  }
}

/*<Text>
          {this.getCurrentSlot()}
        </Text>*/

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
