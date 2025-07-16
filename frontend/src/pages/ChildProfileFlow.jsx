import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";

export const ChildDataContext = createContext();

export default function ChildProfileFlow() {
  const [childData, setChildData] = useState({
    report: {},
    details: {},
    medical: {},
    development: {},
    routine: {},
    additional: {}
  });

  return (
    <ChildDataContext.Provider value={{ childData, setChildData }}>
      <Outlet /> {/* This renders each step like ChildReport, ChildDetails, etc. */}
    </ChildDataContext.Provider>
  );
}
