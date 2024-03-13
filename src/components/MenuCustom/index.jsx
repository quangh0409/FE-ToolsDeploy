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
  const onClick = (e) => {
    console.log("click ", e);
  };
  return (
    <Menu
      className={props.className + " " + props.width +" " + props.className + "z-1000"} 
      onClick={onClick}
      // style={{
      //   width: props.width,
      // }}
      mode={props.mode || "horizontal"}
      items={props.items}
    />
  );
}
