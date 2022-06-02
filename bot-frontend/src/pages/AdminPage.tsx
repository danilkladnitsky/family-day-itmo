import ControlPanel from "../components/ControlPanel/ControlPanel";
import OverviewFlow from "../components/Flow/OverviewFlow";
import React from "react";
import Sidebar from "../components/Sidebar";
import UserProfile from "../components/UserProfile";

const AdminPage = () => {
  return (
    <>
      <Sidebar />
      <UserProfile />
      <ControlPanel />
      <OverviewFlow />
    </>
  );
};

export default AdminPage;
