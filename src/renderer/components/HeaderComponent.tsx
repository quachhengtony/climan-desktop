import React, { useState } from 'react';
import {
  Button,
  Header,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenu,
  HeaderMenuItem,
  HeaderName,
  HeaderNavigation,
  HeaderPanel,
  Tab,
  Tabs,
} from 'carbon-components-react';
import Search20 from '@carbon/icons-react/lib/search/20';
import Notification20 from '@carbon/icons-react/lib/notification/20';
import AppSwitcher20 from '@carbon/icons-react/lib/app-switcher/20';
import Close20 from '@carbon/icons-react/lib/close/20';
import Scale20 from '@carbon/icons-react/lib/scale/20';
import Subtract20 from '@carbon/icons-react/lib/subtract/20';
import { Help20, UserAvatar20 } from '@carbon/icons-react';
import SideNavComponent from './SidenavComponent';

interface IProps {
  closeWindow: () => void;
  restoreWindow: () => void;
  minimizeWindow: () => void;
}

const HeaderComponent: React.FC<IProps> = ({
  closeWindow,
  restoreWindow,
  minimizeWindow,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleRightPanel = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Header aria-label="Climan Desktop" className="header">
        <HeaderName href="#" prefix="Climan">
          Desktop
        </HeaderName>
        <HeaderNavigation
          aria-label="IBM [Platform]"
          className="headerNavigation"
        >
          <HeaderMenuItem href="#">File</HeaderMenuItem>
          <HeaderMenuItem href="#">Edit</HeaderMenuItem>
          <HeaderMenuItem href="#">View</HeaderMenuItem>
          <HeaderMenuItem href="#">Help</HeaderMenuItem>
          <HeaderMenu aria-label="Workspaces" menuLinkName="Workspaces">
            <HeaderMenuItem href="#">Sub-link 1</HeaderMenuItem>
            <HeaderMenuItem href="#">Sub-link 2</HeaderMenuItem>
            <HeaderMenuItem href="#">Sub-link 3</HeaderMenuItem>
          </HeaderMenu>
        </HeaderNavigation>

        <HeaderGlobalBar className="headerGlobalBar">
          {/* <HeaderGlobalAction
            aria-label="Search"
            onClick={() => {}}
            className="searchButton"
          >
            <Search20 />
          </HeaderGlobalAction> */}

          <HeaderGlobalAction
            aria-label="Help"
            className="helpButton"
            isActive={expanded}
            onClick={toggleRightPanel}
          >
            <Help20 />
          </HeaderGlobalAction>
          <HeaderGlobalAction
            aria-label="Notifications"
            onClick={() => {}}
            className="notificationButton"
          >
            <Notification20 />
          </HeaderGlobalAction>
          <HeaderGlobalAction
            aria-label="Account"
            onClick={() => {}}
            className="accountButton"
          >
            <UserAvatar20 />
          </HeaderGlobalAction>
          <HeaderGlobalAction
            aria-label="Minimize"
            onClick={minimizeWindow}
            className="minimizeButton"
          >
            <Subtract20 />
          </HeaderGlobalAction>
          <HeaderGlobalAction
            aria-label="Restore"
            onClick={restoreWindow}
            className="restoreButton"
          >
            <Scale20 />
          </HeaderGlobalAction>
          <HeaderGlobalAction
            aria-label="Close"
            onClick={closeWindow}
            className="closeButton"
          >
            <Close20 />
          </HeaderGlobalAction>
        </HeaderGlobalBar>

        <HeaderPanel expanded={expanded}></HeaderPanel>
      </Header>
    </>
  );
};

export default HeaderComponent;
