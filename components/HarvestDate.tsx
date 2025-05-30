import React from "react";
import { View, Text } from "react-native";
import { Styles } from "../styles/Styles";

type Props = {
  daysUntilHarvest: number;
  harvestDate: string;
};

export const HarvestDate: React.FC<Props> = ({
  daysUntilHarvest,
  harvestDate,
}) => (
  <View style={Styles.harvestDateContainer}>
    <Text style={Styles.harvestDateTitle}>Perkiraan Tanggal Panen</Text>
    <Text style={Styles.harvestDateValue}>{harvestDate}</Text>
    <Text style={Styles.harvestDaysText}>
      ({daysUntilHarvest} hari dari sekarang)
    </Text>
  </View>
);
