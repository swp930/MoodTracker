import React from 'react';
import { ScrollView, StyleSheet, FlatList, Button, View, Text, TextInput } from 'react-native';

import firebase from 'react-native-firebase';
import Todo from './Todo'


export default class Todos extends React.Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection("cities")
    this.unsubscribe = null

    this.state = {
      textInput: 'Enter info',
      loading: true,
      todos: []
    };
  }

  async componentDidMount() {
    // TODO: You: Do firebase things
    // const { user } = await firebase.auth().signInAnonymously();
    // console.warn('User -> ', user.toJSON());

    // await firebase.analytics().logEvent('foo', { bar: '123'});
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  onCollectionUpdate = (querySnapshot) => {
    // TODO
    const todos = []
    querySnapshot.forEach((doc) => {
      const { title, complete } = doc.data();

      todos.push({
        key: doc.id,
        doc,
        title, 
        complete,
      })
    })

    this.setState({
      todos,
      loading: false,
    })
  }

  updateTextInput(value) {
    this.setState({textInput: value})
  }

  addTodo() {
    /*this.ref.add({
      title: this.state.textInput,
      complete: false,
    })*/
    /*db = firebase.firestore().collection("cities").doc("LA")
    db.collection("newcollection").doc("LA2").set({
      name: "Los Angeles",
      state: "CA",
      country: "USA"
    })
    .then(function() {
      console.log("Document successfully written!");
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });*/

    /*db = firebase.firestore().collection("users").doc("swap2")
    db.collection("data").doc("newdata").set({
      name: "Los Angeles",
      state: "CA",
      country: "USA"
    })
    .then(function() {
      console.log("Document successfully written!");
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });*/

    db = firebase.firestore().collection("users")
    db.doc("sdpatil3@ucsd.edu").set({
      "name": "Swapnil Patil",
      "email": "sdpatil@ucsd.edu"
    })

    db = db.doc("sdpatil3@ucsd.edu")
    var date = new Date()
    var time = "" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    db.collection("mooddata").doc(time).set({
      "slider1": 40,
      "slider2": 70
    })

    this.setState({
      textInput: ''
    })
  }

  render() {
    if(this.state.loading) {
      return null
    }

    return (
      <View>
            <ScrollView style={styles.logo}>
                <Text>List of TODOs</Text>
            </ScrollView>
            <TextInput
                placeholder={'Add TODO'}
                value={this.state.textInput}
                onChangeText={(text) => this.updateTextInput(text)}
            />
            <Button
                title={'Add TODO'}
                disabled={!this.state.textInput.length}
                onPress={() => this.addTodo()}
            />
        </View>
    )
  }
}

/**
 * <View style={{flex: 1, marginTop: 20}}>
          <FlatList
            data={this.state.todos}
            renderItem={({ item }) => <Todo {...item}/>}
          />
          <TextInput
            placeholder={'Add TODO'}
            value={this.state.textInput}
            onChangeText={(text) => this.updateTextInput(text)}
          />
          <Button
            title={'Add TODO'}
            disabled={!this.state.textInput.length}
            onPress={() => this.addTodo()}
          />
        </View>
 */

/**
 * 
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

