import React from "react";
import { Menu } from "antd";
export function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

export default function MenuCustom(props) {
  return (
    <Menu
      className={props.className + " " + props.width +" " + props.className + "z-1000"} 
      onClick={props.onClick}
      mode={props.mode || "horizontal"}
      items={props.items}
    />
  );
}
