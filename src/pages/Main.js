import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import dislike from "../assets/dislike.png";

import like from "../assets/like.png";
import logo from "../assets/logo.png";
import api from "../services/api";
import AsyncStorage from "@react-native-community/async-storage";

export default function Main({ navigation }) {
  const id = navigation.getParam("user");
  const [profile, setProfile] = useState([]);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function loadProfile() {
      const response = await api.post(`/devs/dev`, null, {
        headers: {
          userid: id,
        },
      });
      setProfile(response.data);
    }
    loadProfile();
  }, []);

  useEffect(
    () => {
      async function loadUsers() {
        const response = await api.get("/devs", {
          headers: {
            user: id,
          },
        });
        setUsers(response.data);
      }
      loadUsers();
    },
    [id]
  );

  async function handleLike() {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/likes`, null, {
      headers: {
        user: id,
      },
    });
    setUsers(rest);
  }

  async function handleDislike() {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/dislikes`, null, {
      headers: {
        user: id,
      },
    });

    setUsers(rest);
  }

  async function handleLogout() {
    await AsyncStorage.clear();
    navigation.navigate("Login");
  }
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image source={logo} style={styles.logo} />
      </TouchableOpacity>
      <View style={styles.user}>
        <Image style={styles.profile} source={{ uri: profile.avatar }} />
        <Text style={styles.name}>{profile.name}</Text>
      </View>
      <View style={styles.cardsContainer}>
        {users.length === 0 ? (
          <Text style={styles.empty}>Acabou :/</Text>
        ) : (
          users.map((user, index) => (
            <View
              key={user._id}
              style={[styles.card, { zIndex: users.length - index }]}
            >
              <Image
                style={styles.avatar}
                source={{
                  uri: user.avatar,
                }}
              />
              <View style={styles.footer}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.bio} numberOfLines={3}>
                  {user.bio}styles.user
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
      {users.length === 0 ? (
        <View />
      ) : (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleDislike}>
            <Image source={dislike} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLike}>
            <Image source={like} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardsContainer: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    maxHeight: 500,
  },
  logo: {
    marginTop: 20,
  },
  user: {
    top: 0,
  },
  profile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignSelf: "center",
    marginHorizontal: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  name: {
    fontWeight: "bold",
  },
  empty: {
    alignSelf: "center",
    color: "#999",
    fontSize: 40,
    fontWeight: "bold",
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 10,
    marginHorizontal: 20,
    overflow: "hidden",
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  avatar: {
    flex: 1,
    height: 300,
  },
  footer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bio: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    lineHeight: 18,
  },
  buttonsContainer: {
    flexDirection: "row",
    marginBottom: 30,
    top: 0,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 45,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});
