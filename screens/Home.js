import React, { useState, useEffect, useCallback, useMemo } from "react";
import { SafeAreaView, KeyboardAvoidingView, ScrollView, View, Text, TextInput, Image, Pressable, FlatList, StyleSheet, Alert } from "react-native";
import { Searchbar } from "react-native-paper";
import { createTable, getMenuItems, saveMenuItems, filterByQueryAndCategories, fetchAllMenuItems } from "../database";
import Filters from "../components/Filters";

import debounce from "lodash.debounce";
import useUpdate from "../useUpdate";

const API_URL = "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";
const sections = ["starters", "mains", "desserts", "drinks"];

const Home = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [searchBarText, setSearchBarText] = useState("");
  const [query, setQuery] = useState("");
  const [menuData, setMenuData] = useState([]);

  const [filterSelections, setFilterSelections] = useState(sections.map(() => false));

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();

      //setMenuData(json.menu); may change this line or add saveMenuItems here
      return json.menu;
    } catch (error) {
      console.error(error);
    }
    return [];
  };

  //run once on start and subsequent renders
  useEffect(() => {
    (async () => {
      try {
        await createTable();

        // The application only fetches the menu data once from a remote URL
        // and then stores it into a SQLite database.
        // After that, every application restart loads the menu from the database
        let menuItems = await getMenuItems();

        if (!menuItems.length) {
          //on first try, menuItems is empty, save menuItems from api once
          const result = await fetchData();
          await saveMenuItems(result);
          menuItems = await getMenuItems();
        }
        setMenuData(menuItems); //sets MenuData with menuItems which uses name,not title for rendering, wrong
      } catch (e) {
        // Handle error
        Alert.alert(e.message);
      }
    })();
  }, []);

  useUpdate(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        // If all filters are deselected, all categories are active
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(query, activeCategories);
        setMenuData(menuItems); //fix this line confirm menuItems format
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, [filterSelections, query]);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.nav}>
          <View style={styles.logo}>
            <Image style={styles.image} source={require("../assets/images/littlelemonlogo.png")} resizeMode="contain" />
            <Text style={styles.logoText}>Little lemon</Text>
          </View>
          {image ? (
            <Pressable onPress={() => navigation.navigate("Profile")}>
              <Image source={{ uri: image }} style={styles.profileImage} resizeMode="contain" />
            </Pressable>
          ) : (
            <Pressable onPress={() => navigation.navigate("Profile")}>
              <View style={styles.noImage}>
                <Text style={styles.sectionHeading}>
                  {firstName[0]?.toLocaleUpperCase()}
                  {lastName[0]?.toLocaleUpperCase()}
                </Text>
              </View>
            </Pressable>
          )}
        </View>
        <View style={styles.hero}>
          <View style={styles.headingGroup}>
            <Text style={styles.mainHeading}>Little lemon</Text>
            <Text style={styles.subHeading}>Chicago lemon</Text>
          </View>
          <View style={styles.bannerText}>
            <Text style={styles.bodyText}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
            <Image source={require("../assets/images/heroimage.png")} style={styles.heroImage} resizeMode="cover" />
          </View>
          <Searchbar
            placeholder="Search"
            placeholderTextColor="#444"
            onChangeText={handleSearchChange}
            value={searchBarText}
            style={styles.searchBar}
            iconColor="#444"
            inputStyle={{ color: "black" }}
            elevation={0}
          />
        </View>
        <Text style={styles.menuHeading}>Order for delivery</Text>

        <Filters selections={filterSelections} onChange={handleFiltersChange} sections={sections} />

        <FlatList
          style={styles.menuContainer}
          data={menuData}
          renderItem={({ item }) => {
            return (
              <View style={styles.menuItemContainer}>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text>{item.description}</Text>
                  <Text>${item.price}</Text>
                </View>
                <View style={styles.menuInnerContainer}>
                  <Image
                    style={styles.image}
                    source={{
                      uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
                    }}
                    resizeMode="cover"
                  />
                </View>
              </View>
            );
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  innerContainer: {
    marginHorizontal: 2,
    borderColor: "#edefee",
    borderWidth: 1,
    borderRadius: 22,
  },
  menuItemContainer: {
    padding: 10,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#edefee",
  },
  menuItemName: {
    fontSize: 16,
  },
  menuItemText: {
    width: "50%",
  },
  menuHeading: {
    fontSize: 22,
    marginVertical: 10,
  },
  menuBtnStack: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginVertical: 10,
  },
  menuBtn: {
    backgroundColor: "#495E57",
    width: "auto",
    borderRadius: 8,
    padding: 10,
    margin: 4,
  },
  searchBar: {
    marginVertical: 15,
  },
  menuBtnDisabled: {
    backgroundColor: "#edefee",
    width: "auto",
    borderRadius: 8,
    padding: 10,
    margin: 4,
  },
  menuBtnText: {
    fontWeight: "medium",
    color: "white",
  },
  menuBtnTextDisabled: {
    fontWeight: "medium",
    color: "black",
  },
  hero: {
    backgroundColor: "#495E57",
    padding: 10,
  },
  mainHeading: {
    fontSize: 42,
    fontFamily: "",
    color: "#F4CE14",
  },
  subHeading: {
    fontSize: 24,
    fontFamily: "",
    color: "#edefee",
  },
  bodyText: {
    fontSize: 18,
    fontFamily: "",
    color: "#edefee",
    width: "45%",
  },
  bannerText: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingVertical: 16,
  },
  logo: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontWeight: "bold",
  },

  noImage: {
    backgroundColor: "#edefee",
    width: 75,
    height: 75,
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: "50%",
    margin: 20,
  },
  grayHeadingText: {
    fontSize: 14,
    color: "gray",
  },
  checkbox: {
    marginHorizontal: 5,
  },
  backBtn: {
    backgroundColor: "#495E57",
    borderRadius: "50%",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  btnGroup: {
    flexDirection: "row",
    justifyContent: "center",
  },
  standardBtn: {
    backgroundColor: "#495E57",
    borderRadius: 8,
    margin: 10,
    width: "auto",
    paddingHorizontal: 20,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  standardBtnGray: {
    backgroundColor: "#edefee",
    borderRadius: 0,
    margin: 10,
    width: "auto",
    paddingHorizontal: 20,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  standardBtnText: {
    color: "white",
    width: "100%",
    textAlign: "center",
  },
  standardBtnTextGray: {
    color: "black",
    width: "100%",
    textAlign: "center",
  },
  notificationPrefs: {
    marginHorizontal: 20,
  },
  formLabel: {
    fontSize: 16,
  },
  logoutBtn: {
    backgroundColor: "#F4CE14",
    borderRadius: 8,
    margin: 20,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutBtnText: {
    color: "black",
  },
  image: {
    width: 50,
    height: 50,
    margin: 12,
  },
  heroImage: {
    width: "50%",
    height: 200,
    borderRadius: 25,
  },
  input: {
    height: 40,
    backgroundColor: "#EDEFEE",
    margin: 20,
    padding: 10,
    borderRadius: 8,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 20,
    textAlign: "left",
  },
  subscribeBtn: {
    fontSize: 22,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 20,
    backgroundColor: "#004400",
    borderWidth: 2,
    borderRadius: 17,
    alignItems: "center",
    position: "relative",
    top: 50,
  },
  subscribeBtnText: {
    color: "#FFFFCC",
    fontSize: 15,
    fontWeight: "bold",
  },
});
