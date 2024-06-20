import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { analogusColor, blankColor } from "./colors";

export default function DropDownComponent({ passModelID }) {
  const [placeholderModelID, setPlaceholderModelID] = useState("Dave's Lives");
  const data = [
    {
      label: "Dave's Lives",
      value: "eden-art/Dave",
    },
  ];

  return (
    <Dropdown
      style={styles.dropdown}
      selectedTextStyle={styles.selectedTextStyle}
      placeholderStyle={styles.placeholderStyle}
      data={data}
      labelField="label"
      valueField="value"
      placeholder={placeholderModelID}
      onChange={(item) => {
        passModelID(item.value);
        setPlaceholderModelID(item.label);
      }}
    />
  );
}


const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    width: 340,
    borderBottomColor: analogusColor,
    borderBottomWidth: 3,
  },
  placeholderStyle: {
    color: blankColor,
    fontSize: 25,
    fontFamily: "Sigmar",
    textAlign: "center",
    letterSpacing: 3,
  },
  selectedTextStyle: {
    color: blankColor,
    fontSize: 20,
    fontFamily: "Sigmar",
    letterSpacing: 3,
    textAlign: "center",
  },
});
