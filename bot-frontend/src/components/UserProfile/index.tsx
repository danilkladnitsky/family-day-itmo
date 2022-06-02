import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import React from "react";
import styled from "styled-components";

const UserProfile = () => {
  return (
    <Profile>
      <Username>Admin</Username>
      <AccountCircleIcon />
    </Profile>
  );
};

const Profile = styled.div`
  display: flex;
  align-items: center;
  z-index: 1;
  background-color: #fff;
  border-radius: 15px;

  justify-content: center;

  padding: 15px;

  position: absolute;
  right: 15px;
  top: 15px;

  gap: 10px;

  svg {
    color: #497fff;
  }
`;

const Username = styled.div`
  font-family: "Medium";
`;

export default UserProfile;
