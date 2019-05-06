import React, { Component } from 'react'
import { TextInput, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import NotifService from './NotifService'

export default class PushEx extends Component {
    constructor(props) {
        super(props)
        this.state = {}

        this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
    }

    scheduleNotifAtDate() {
      var runAt = new Date()
      runAt.setMinutes(55)
      console.log(runAt)
      this.notif.scheduleNotifAtDate(runAt)
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Example App</Text>
                <View style={styles.spacer}></View>
                <TouchableOpacity style={styles.button} onPress={() => { this.notif.localNotif() }}><Text>Local Notification (now)</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => { this.notif.scheduleNotif() }}><Text>Schedule Notification in 30s</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => { this.scheduleNotifAtDate() }}><Text>Schedule Notification at 12:55</Text></TouchableOpacity>
            </View>
        )
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
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    button: {
      borderWidth: 1,
      borderColor: "#000000",
      margin: 5,
      padding: 5,
      width: "70%",
      backgroundColor: "#DDDDDD",
      borderRadius: 5,
    },
    textField: {
      borderWidth: 1,
      borderColor: "#AAAAAA",
      margin: 5,
      padding: 5,
      width: "70%"
    },
    spacer: {
      height: 10,
    },
    title: {
      fontWeight: "bold",
      fontSize: 20,
      textAlign: "center",
    }
  });