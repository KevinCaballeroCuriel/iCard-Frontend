import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon, Menu } from "semantic-ui-react";
import { useAuth } from "../../../hooks";
import "./TopMenu.scss";

export function TopMenu() {
  let navigate = useNavigate();
  const { auth, logout } = useAuth();

  const renderName = () => {
    if (auth.me?.first_name && auth.me?.last_name) {
      return `${auth.me.first_name} ${auth.me.last_name}`;
    }
    return auth.me?.email;
  };

  return (
    <Menu fixed="top" className="top-menu-admin">
      <Menu.Item className="top-menu-admin__logo">
        <p>iCard Admin</p>
      </Menu.Item>

      <Menu.Menu position="right">
        <Menu.Item className="top-menu-admin__hola">
          Hola, {renderName()}
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <Icon name="sign-out" />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}
