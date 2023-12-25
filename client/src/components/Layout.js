import React from "react";
import "../styles/LayoutStyles.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AdminMenu, UserMenu } from "./../Data/data";
import { Badge, message } from "antd";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  // Logout Function
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    navigate("/login");
  };

  //*********************  DOCTOR MENU ******************** 
  const DoctorMenu = [
    {
      name: 'Home',
      path: '/',
      icon: 'fa-solid fa-house'
    },
    {
      name: 'Appointments',
      path: '/doctor-appointments',
      icon: 'fa-solid fa-list'
    },
    {
      name: 'Profile',
      path: `/doctor/profile/${user?._id}`,
      icon: 'fa-solid fa-user'
    }
  ]

  //*********************  DOCTOR MENU ******************** 


  // Rendering Menu List
  const SidebarMenu = user?.isAdmin ? AdminMenu : user?.isDoctor ? DoctorMenu : UserMenu;

  return (
    <>
      <div className="main">
        <div className="layout">
          <div className="sidebar">
            <div className="logo">
              <h6>Doc App</h6>
              <hr />
            </div>
            <div className="menu">
              {SidebarMenu.map((menu) => {
                const isActive = location.pathname === menu.path;
                return (
                  <>
                    <div className={`menu-item ${isActive && "active"}`}>
                      <i className={menu.icon}></i>
                      <Link to={menu.path}>{menu.name}</Link>
                    </div>
                  </>
                );
              })}
              <div className={`menu-item`} onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <Link to="/login">Logout</Link>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="header">
              <div className="header-content" >
                <div className="notification" style={{ cursor: "pointer" }}>
                  <Badge
                    size="small"
                    count={user && user.notification.length}
                    onClick={() => {
                      navigate("/notification");
                    }}
                  >
                    <i className="fa-solid fa-bell"></i>
                  </Badge>
                </div>
                <Link to="/profile">{user?.name}</Link>
              </div>
            </div>
            <div className="body">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
