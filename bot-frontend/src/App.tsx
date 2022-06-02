import "./App.css";

import { Link, Route, Routes } from "react-router-dom";

import AdminPage from "./pages/AdminPage";
import { BrowserRouter } from "react-router-dom";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import FeedbackPage from "./pages/FeedbackPage";
import { FlowContextProvider } from "./context/FlowProvider";
import OverviewFlow from "./components/Flow/OverviewFlow";
import Sidebar from "./components/Sidebar";
import { SnackbarProvider } from "notistack";
import UserProfile from "./components/UserProfile";
import styled from "styled-components";

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <FlowContextProvider>
        <BrowserRouter>
          <AppWrapper>
            <Routes>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
            </Routes>
          </AppWrapper>
        </BrowserRouter>
      </FlowContextProvider>
    </SnackbarProvider>
  );
}

const AppWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

export default App;
