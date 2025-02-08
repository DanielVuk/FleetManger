import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import PickerItem from "./PickerItem";

const AppPicker = ({
  items,
  onSelectItem,
  placeholder,
  selectedItem,
  disabled,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => !disabled && setModalVisible(true)}
      >
        <View style={[styles.container, disabled && { opacity: 0.6 }]}>
          <Text variant="titleMedium">
            {selectedItem ? selectedItem.label : placeholder}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {selectedItem && !disabled && (
              <MaterialCommunityIcons
                name="close-circle-outline"
                size={25}
                onPress={() => onSelectItem(null)}
                style={{ marginRight: 10 }}
              />
            )}
            <MaterialCommunityIcons name="chevron-down" size={20} />
          </View>
        </View>
      </TouchableWithoutFeedback>

      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView>
          <View style={{ padding: 20, marginBottom: -5 }}>
            <TextInput
              style={styles.searchInput}
              mode="outlined"
              placeholder="Search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              left={<TextInput.Icon icon="magnify" />}
              right={
                searchQuery && (
                  <TextInput.Icon
                    icon="close"
                    onPress={() => setSearchQuery("")}
                  />
                )
              }
            />
          </View>
          <Button onPress={() => setModalVisible(false)}>Close</Button>

          <FlatList
            data={filteredItems}
            keyExtractor={(item) =>
              item.value ? item.value.toString() : "none"
            }
            renderItem={({ item }) => (
              <PickerItem
                label={item.label}
                onPress={() => {
                  setModalVisible(false);
                  onSelectItem(item);
                }}
              />
            )}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 15,
    marginVertical: 10,
  },
});

export default AppPicker;
