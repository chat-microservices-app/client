import { Slot } from "expo-router";
import React from "react";

export default function Landinglayout() {
  return (
    <Slot
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
