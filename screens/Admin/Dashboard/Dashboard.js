import React from "react";
import { View, Text, Button } from "react-native";
import { BarChart } from "react-native-chart-kit";

const data = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
    },
  ],
};

const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0,${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const Dashboard = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Admin Dashboard</Text>

      <View style={{ marginTop: 20 }}>
        <BarChart
          data={data}
          width={350}
          height={220}
          yAxisLabel="$"
          chartConfig={chartConfig}
          verticalLabelRotation={30}
        />
      </View>
    </View>
  );
};

export default Dashboard;