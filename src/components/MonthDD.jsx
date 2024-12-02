import React from "react";
import { StyleSheet, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

const MonthDD = ({ setSelected }) => {
  return (
    <View>
      <SelectList
        setSelected={(val) => setSelected(val)}
        data={[
          { key: 1, value: "Tháng 1" },
          { key: 2, value: "Tháng 2" },
          { key: 3, value: "Tháng 3" },
          { key: 4, value: "Tháng 4" },
          { key: 5, value: "Tháng 5" },
          { key: 6, value: "Tháng 6" },
          { key: 7, value: "Tháng 7" },
          { key: 8, value: "Tháng 8" },
          { key: 9, value: "Tháng 9" },
          { key: 10, value: "Tháng 10" },
          { key: 11, value: "Tháng 11" },
          { key: 12, value: "Tháng 12" },
        ]}
        save="key"
        placeholder="Chọn tháng"
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default MonthDD;
