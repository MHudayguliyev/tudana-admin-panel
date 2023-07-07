import React, { useEffect, useState } from "react";

// custom styles
import styles from "./TopNavbar.module.scss";
import classNames from "classnames/bind";
import {HiOutlineMenu} from "react-icons/hi"
import {GrClose} from "react-icons/gr"

import { Link, useMatch, useNavigate } from "@tanstack/react-location";
import user_image from "../../assets/images/tuat.png";

// fake data for demonstration
import user_menu from "@app/assets/JsonData/user_menus.json";
import languages from "@app/assets/JsonData/language";
// own component library
import { Button, Dropdown} from "@app/compLibrary";
import ThemeMenu from "@components/ThemeMenu/ThemeMenu";
import { SelectLanuageMenu, UserToggle } from "./LanguageDropdown/LanguageDropdown";
// for translation
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@app/hooks/redux_hooks";


import DeleteConfirm from "../Modals/DeleteConfirm/DeleteConfirm";

// Action creators
import {setProductType} from '@redux/actions/ProductAction'

import { MaterialList } from "@app/api/Types/queryReturnTypes"
import ThemeAction from "@app/redux/actions/ThemeAction";
import moment from "moment";

// type TopNavbarProps = {
//   setSidebar: Function
// }
const logout = () => {
  localStorage.removeItem('accessTokenCreatedTime');
  localStorage.removeItem('authUser');
  window.location.reload();
}

const renderNotificationItem = (item: any, index: any) => (
  <div className={styles.notification_item} key={index}>
    <i className={item.icon}></i>
    <span>{item.content}</span>
  </div>
);

const renderUserToggle = () => {
  let userName;
  try {
    const authUser = localStorage.getItem('authUser') || '';
    userName = JSON.parse(authUser);
  } catch (err) {
    userName = { user_name: 'Who are you?' }
  }
  return (
    <div className={styles.topnav__right_user}>
      <div className={styles.topnav__right_user__image}>
        <img src={user_image} alt="" />
      </div>
      <div className={styles.topnav__right_user__name}>{userName.user_name}</div>
    </div>
  )
};

const renderUserMenu = (item: any, index: number) => (
  <Link to={item.href} key={index} onClick={item.href === "#" ? () => logout() : undefined}>
    <div className={styles.notification_item}>
      <i className={item.icon}></i>
      <span>{item.content}</span>
    </div>
  </Link>
);

const cx = classNames.bind(styles);

type TopNavbarProps = {
  setShowModal?: Function | any
  showModal?: boolean;
}
const TopNavbar = (props: TopNavbarProps) => {
  const {
    setShowModal,
    showModal
  } = props

  const isOpenSideBar = useAppSelector(state => state.themeReducer.isOpenSidebar);

  const toggleSidebar = () => {
    dispatch(ThemeAction.toggleSidebar(!isOpenSideBar))
  }

  const dispatch = useAppDispatch()
  const [confirmPage, setConfirmPage] = useState<boolean>(false)

  // for translation
  const { t } = useTranslation()
  // for navigation
  const match = useMatch();
  const navigate = useNavigate();


  return (
    <>

      <div className={styles.topnav}>
        <div className={styles.menuIcon} onClick={() => toggleSidebar()}>
          {isOpenSideBar? <GrClose size={24}/> : <HiOutlineMenu size={24}/> }
        </div>
        <div>
          
          {/* // !isOpenSideBar && */}

          <div style={{ marginRight: '10px' }} className={styles.sideBar}>

            {match.pathname === '/' ? 
              <div className={styles.createProductBtns}>
                <Button type='contained' color='theme' rounded onClick={() => dispatch(setProductType('bouquets'))}>Bouqets</Button>
                <Button type='contained' color='theme' rounded onClick={() => dispatch(setProductType('recepts'))}>Recepts</Button>
              </div>
            : null}

          </div>
        </div>
        
        <div className={styles.topnav__right}>
          <div className={styles.topnav__right_item}>
            {/* User dropdown */}
            <Dropdown
              customToggle={() => renderUserToggle()}
              contentData={user_menu}
              renderItems={(item, index) =>
                renderUserMenu(item, index)
              }
            />
          </div>
          <div className={styles.topnav__right_item}>
            {/* Select language dropdown */}
            <Dropdown
              customToggle={() =>
                <UserToggle data={languages} />
              }
              contentData={languages}
              renderItems={(item, index) =>
                <SelectLanuageMenu {...item} key={index} />
              }
            />
          </div>

          {/* Will be in the future */}
          {/* <div className={styles.topnav__right_item}>
          Notification dropdown
          <Dropdown
            icon="bx bx-bell"
            badge="12"
            contentData={notifications}
            renderItems={(item, index) =>
              renderNotificationItem(item, index)
            }
            renderFooter={() => <Link to="/">View All</Link>}
          />
        </div> */}
          <div className={styles.topnav__right_item}>
            <ThemeMenu />
          </div>
        </div>
      </div>
    </>
  );
};

export default TopNavbar;
