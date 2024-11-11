import React, { useState, useEffect } from 'react';
import {
  Button,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';

function HomeScreen({ navigation }) {
  const [name, setName] = useState('');

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 100,
      }}>
      <Text
        style={{
          color: '#8353E2',
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: 25,
          textTransform: 'uppercase',
        }}>
        Manage your{'\n'} task
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 10,
          padding: 10,
        }}>
        <Image
          source={require('./assets/email.png')}
          style={{ width: 20, height: 20, marginRight: 10 }}
        />
        <TextInput
          style={{
            flex: 1,
            textAlign: 'center',
            paddingHorizontal:40,
            outline: 'none',
          }}
          placeholder="Enter your name"
          placeholderTextColor="gray"
          value={name}
          onChangeText={(value) => setName(value)}
        />
      </View>

      <TouchableOpacity
        style={{
          padding: 10,
          paddingHorizontal: 40,
          backgroundColor: '#00BDD6',
          borderRadius: 10,
        }}
        onPress={() => navigation.navigate('Details', { userName: name })}>
        <Text style={{ color: 'white', textTransform: 'uppercase' }}>
          Get Started ➙
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function DetailsScreen({ navigation, route }) {
  const { userName } = route.params;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = () => {
    axios
      .get('https://64a67e6a096b3f0fcc7fe3e0.mockapi.io/tasks')
      .then((response) => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, [tasks]);


  const handleDelete = (id) => {
    axios
      .delete(`https://64a67e6a096b3f0fcc7fe3e0.mockapi.io/tasks/${id}`)
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
      });
  };
  const handleUpdateTask = (id, newTitle) => {
    axios
      .put(`https://64a67e6a096b3f0fcc7fe3e0.mockapi.io/tasks/${id}`, {
        title: newTitle,
      })
      .then((response) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === id ? response.data : task))
        );
      })
      .catch((error) => {
        console.error('Error updating task:', error);
      });
  };
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00BDD6" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
        justifyContent: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <TouchableOpacity
          style={{
            padding: 10,
          }}
          onPress={() => navigation.goBack()}>
          <Image
            source={require('./assets/back_icon.png')}
            style={{ width: 40, height: 40, marginRight: 10 }}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View>
            <Image
              source={require('./assets/avatar.png')}
              style={{ width: 50, height: 50, marginRight: 10 }}
            />
          </View>
          <View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'gray' }}>
              Hi {userName}
            </Text>
            <Text style={{ fontSize: 14, color: 'gray' }}>
              Have a great day ahead
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 10,
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
          marginBottom: 20,
        }}>
        <Image
          source={require('./assets/search_icon.png')}
          style={{ width: 20, height: 20, marginRight: 10 }}
        />
        <TextInput
          placeholder="Search"
          style={{ flex: 1, fontSize: 16, outline: 'none' }}
        />
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#DEE1E678',
              padding: 10,
              marginVertical: 5,
              borderRadius: 30,
              borderColor: '#9095A0',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 5,
            }}>
            <View>
              <Image
                source={require('./assets/icon_tick.png')}
                style={{ width: 20, height: 20 }}
              />
            </View>
            <TextInput
              style={{
                flex: 1,

                borderBottomColor: '#ccc',
                padding: 5,
                marginRight: 10,
                outline: 'none',
                fontWeight: 'bold',
              }}
              value={item.title}
              onChangeText={(newTitle) => {
                const updatedTasks = tasks.map((task) =>
                  task.id === item.id ? { ...task, title: newTitle } : task
                );
                setTasks(updatedTasks);
              }}
              onEndEditing={() => handleUpdateTask(item.id, item.title)}
            />
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
              }}>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Image
                  source={require('./xoa.png')}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleUpdateTask(item.id, item.title)}>
                <Image
                  source={require('./Frame.png')}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#00BDD6',
            borderRadius: 30,
            width: 60,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5,
            position: 'relative',
          }}
          onPress={() =>
            navigation.navigate('AddTask', { userName: userName })
          }>
          <Image
            source={require('./assets/icon-add.png')}
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function AddTaskScreen({ navigation, route }) {
  const { userName } = route.params;
  const [task, setTask] = useState('');
  const handleAddTask = () => {
    axios
      .post('https://64a67e6a096b3f0fcc7fe3e0.mockapi.io/tasks', {
        title: task,
      })
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => {
        console.error('Error adding task:', error);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          flex: 2,
        }}>
        <TouchableOpacity
          style={{
            padding: 10,
          }}
          onPress={() => navigation.goBack()}>
          <Image
            source={require('./assets/back_icon.png')}
            style={{ width: 40, height: 40, marginRight: 10 }}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View>
            <Image
              source={require('./assets/avatar.png')}
              style={{ width: 40, height: 40, marginRight: 10 }}
            />
          </View>
          <View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'gray' }}>
              Hi {userName}
            </Text>
            <Text style={{ fontSize: 14, color: 'gray' }}>
              Have a great day ahead
            </Text>
          </View>
        </View>
      </View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: 'black',
          textTransform: 'uppercase',
        }}>
        Add your Job
      </Text>
      <TextInput
        style={{
          width: '80%',
          textAlign: 'center',
          borderStyle: 'solid',
          borderWidth: 1,
          borderRadius: 5,
          padding: 10,
        }}
        placeholder="input your task"
        placeholderTextColor="gray"
        value={task}
        onChangeText={(value) => setTask(value)}
      />
      <TouchableOpacity
        style={{
          padding: 10,
          paddingHorizontal: 40,
          backgroundColor: '#00BDD6',
          borderRadius: 10,
        }}
        onPress={handleAddTask}>
        <Text style={{ color: 'white', textTransform: 'uppercase' }}>
          Finish ➙
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flex: 5,
        }}>
        <Image
          source={require('./assets/NoteImage.png')}
          style={{ width: 100, height: 100, marginRight: 10 }}
        />
      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
