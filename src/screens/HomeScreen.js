import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import {
  Badge,
  Button,
  Icon,
  IconButton,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AppPicker from "../components/AppPicker";
import Reminder from "../components/Reminder";
import { AppContext } from "../contexts/AppContext";
import { calculateTotalIncomeAndExpense } from "../utils/calculateIncomeAndExpanse";
import { formatCurrency } from "../utils/formatCurrency";
import { getReminders } from "../utils/getReminders";

export default function HomeScreen() {
  const theme = useTheme();
  const [state] = useContext(AppContext);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const { totalIncome, totalExpense } = calculateTotalIncomeAndExpense(
    state.categories,
    state.activities
  );

  const pieData = [
    { value: totalIncome || 0, color: theme.colors.success },
    { value: totalExpense || 0, color: theme.colors.error },
  ];

  const generateColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  const sumAmountsByCategory = (categories, activities) => {
    const categorySums = {};

    const filteredActivities = selectedVehicle
      ? activities.filter((a) => a.vehicleId === selectedVehicle.value)
      : activities;

    filteredActivities.forEach((activity) => {
      if (!categorySums[activity.categoryId]) {
        categorySums[activity.categoryId] = 0;
      }
      categorySums[activity.categoryId] += Number(activity.amount);
    });

    return categories.map((category) => ({
      text: category.name,
      value: categorySums[category.id] || 0,
      color: generateColor(),
    }));
  };
  const renderDot = (color) => (
    <View
      style={{
        height: 15,
        width: 15,
        borderRadius: 5,
        backgroundColor: color,
        marginRight: 10,
      }}
    />
  );

  const filteredFleet = state.fleet.filter(
    (vehicle) => getReminders(vehicle, state).length > 0
  );

  const chartData =
    state.categories && state.activities
      ? sumAmountsByCategory(state.categories, state.activities)
      : [];
  const validChartData = chartData.filter(
    (item) => !isNaN(item.value) && item.value > 0
  );

  const reminders = state.fleet.flatMap((vehicle) =>
    getReminders(vehicle, state)
  );

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginBottom: 15,
        }}
      >
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon source="bell-outline" size={32} color={theme.colors.primary} />
          {reminders.length > 0 && (
            <Badge
              style={{
                position: "absolute",
                top: -5,
                right: -5,
                backgroundColor: theme.colors.error,
              }}
            >
              {reminders.length}
            </Badge>
          )}
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 15,
          padding: 10,
        }}
      >
        <View style={styles.card}>
          <IconButton
            icon="plus-circle-outline"
            onPress={() => navigation.navigate("VehicleDetails")}
            iconColor={theme.colors.primary}
            size={35}
            style={{
              position: "absolute",
              top: -20,
              right: -25,
            }}
          />
          <Text
            variant="labelLarge"
            style={[styles.text, { color: theme.colors.primary }]}
          >
            Fleet:{"\n"}
            {state.fleet.length}
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          {totalIncome > 0 || totalExpense > 0 ? (
            <View style={{ marginTop: -40, marginBottom: 20 }}>
              <PieChart
                donut
                radius={45}
                innerRadius={35}
                data={pieData}
                centerLabelComponent={() => {
                  return (
                    <Text style={{ fontSize: 20 }}>
                      {totalExpense > 0
                        ? ((totalIncome / totalExpense) * 100).toFixed(0)
                        : 100}
                      %
                    </Text>
                  );
                }}
              />
            </View>
          ) : null}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",

              width: "100%",
            }}
          >
            <Text
              variant="labelLarge"
              style={[styles.text, { color: theme.colors.success }]}
            >
              Income:{"\n"}
              {formatCurrency(totalIncome)}
              {}
            </Text>
            <Text
              variant="labelLarge"
              style={[styles.text, { color: theme.colors.error }]}
            >
              Expenses:{"\n"}
              {formatCurrency(totalExpense)}
            </Text>
          </View>
        </View>
      </View>

      {/* PieChart komponenta */}
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 20,
        }}
      >
        {
          <AppPicker
            selectedItem={selectedVehicle}
            onSelectItem={(item) => setSelectedVehicle(item)}
            items={state?.fleet?.map((v) => ({
              label: `${v.name} - ${v.registrationNumber}`,
              value: v.id,
            }))}
            placeholder="Choose vehicle"
          />
        }
        <View
          style={{
            flexDirection: "row",
            padding: 20,
            marginTop: -30,
          }}
        >
          {validChartData.length !== 0 ? (
            <>
              <PieChart
                data={validChartData
                  .filter((item) => !isNaN(item.value) && item.value > 0)
                  .map((item) => ({
                    value: item.value,
                    color: item.color || "grey",
                  }))}
                radius={100}
                showText
                showValuesAsLabels
                strokeColor="white"
                strokeWidth={4}
                textColor="black"
                donut
                centerLabelComponent={() => (
                  <View style={{ alignItems: "center" }}>
                    <Text>Total:</Text>
                    <Text>{validChartData.length}</Text>
                  </View>
                )}
              />

              {/* Legend */}
              <View style={{ marginLeft: 20 }}>
                <ScrollView
                  contentContainerStyle={{
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  {validChartData.map((category, index) => (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginVertical: 5,
                      }}
                      key={index}
                    >
                      {renderDot(category.color)}
                      <Text>{category.text}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </>
          ) : (
            <Text>No data yet.</Text>
          )}
        </View>
      </View>

      {state.fleet.flatMap((vehicle) => getReminders(vehicle, state, true))
        .length > 0 && (
        <Text
          variant="titleMedium"
          style={[styles.text, { marginTop: 30, alignSelf: "flex-start" }]}
        >
          Coming Soon:
        </Text>
      )}
      <FlatList
        data={state.fleet.flatMap((vehicle) =>
          getReminders(vehicle, state, true).map((reminder) => ({
            reminder,
            vehicle,
          }))
        )}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Reminder
            reminder={item.reminder}
            onPress={() =>
              navigation.navigate("VehicleDetails", { vehicle: item.vehicle })
            }
          />
        )}
      />
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <SafeAreaView
          style={{
            backgroundColor: "grey",
            alignItems: "center",
            justifyContent: "center",
            padding: 30,
            paddingTop: 40,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: "90%",
              height: "100%",
              padding: 20,
              borderRadius: 15,
              marginBottom: -5,
              alignItems: "center",
            }}
          >
            <Button onPress={() => setModalVisible(false)}>Close</Button>
            <FlatList
              data={filteredFleet}
              keyExtractor={(vehicle) => vehicle.id.toString()}
              ListEmptyComponent={<Text>No reminders yet!</Text>}
              renderItem={({ item: vehicle }) => {
                const vehicleReminders = getReminders(vehicle, state);

                if (vehicleReminders.length === 0) return null;
                return (
                  <View
                    style={{
                      marginBottom: 15,
                      padding: 10,
                      backgroundColor: "white",
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                      {vehicle.name} - {vehicle.registrationNumber}
                    </Text>
                    {vehicleReminders.map((reminder, index) => (
                      <Reminder
                        key={index}
                        reminder={reminder}
                        onPress={() => {
                          navigation.navigate("VehicleDetails", { vehicle });
                          setModalVisible(false);
                        }}
                      />
                    ))}
                  </View>
                );
              }}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 25,
  },
  card: {
    width: "30%",
    borderRadius: 25,
    height: 115,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});
