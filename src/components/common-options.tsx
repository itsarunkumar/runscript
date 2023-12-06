// @ts-nocheck

import React, { Dispatch } from "react";
import CommandPalette, { getItemIndex } from "react-cmdk";
import "react-cmdk/dist/cmdk.css";

export default function CommonOptions({
  setPage,
}: {
  setPage: Dispatch<React.SetStateAction<string>>;
}) {
  const commonOptions = [
    {
      heading: "Home",
      id: "home",
      items: [
        {
          id: "home",
          children: "Home",
          icon: "HomeIcon",
          closeOnSelect: false,
          onClick: () => {
            setPage("root");
          },
        },
        {
          id: "settings",
          children: "Settings",
          icon: "CogIcon",
          href: "#",
        },
        {
          id: "projects",
          children: "Projects",
          icon: "RectangleStackIcon",
          closeOnSelect: false,
          onClick: () => {
            setPage("projects");
          },
        },
      ],
    },
  ];
  return (
    <>
      {commonOptions.map((list) => (
        <CommandPalette.List key={list.id} heading={list.heading}>
          {list.items.map(({ id, ...rest }) => (
            <CommandPalette.ListItem
              key={id}
              index={getItemIndex(commonOptions, id)}
              {...rest}
            />
          ))}
        </CommandPalette.List>
      ))}
    </>
  );
}
