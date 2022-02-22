import { Folders16 } from '@carbon/icons-react';
import {
  Search,
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
} from 'carbon-components-react';
import React from 'react';

interface IProps {}

const SideNavComponent: React.FC<IProps> = ({}) => {
  return (
    <SideNav
      isRail
      // expanded={true}
      aria-label="Side navigation"
      isChildOfHeader={false}
    >
      <SideNavItems>
        <SideNavMenu title="Lorem Ipsum Dolor Sit Amet" renderIcon={Folders16}>
          <SideNavMenuItem>Lorem Ipsum Dolor Sit Amet 1</SideNavMenuItem>
          <SideNavMenuItem>Lorem Ipsum Dolor Sit Amet 2</SideNavMenuItem>
          <SideNavMenuItem>Lorem Ipsum Dolor Sit Amet 3</SideNavMenuItem>
          <SideNavMenuItem>Lorem Ipsum Dolor Sit Amet 4</SideNavMenuItem>
        </SideNavMenu>
        <SideNavMenu title="Lorem Ipsum Dolor Sit Amet" renderIcon={Folders16}>
          <SideNavMenuItem>Lorem Ipsum Dolor Sit Amet 1</SideNavMenuItem>
          <SideNavMenuItem>Lorem Ipsum Dolor Sit Amet 2</SideNavMenuItem>
          <SideNavMenuItem>Lorem Ipsum Dolor Sit Amet 3</SideNavMenuItem>
        </SideNavMenu>
        <SideNavMenu title="Lorem Ipsum Dolor Sit Amet" renderIcon={Folders16}>
          <SideNavMenuItem>Lorem Ipsum Dolor Sit Amet 1</SideNavMenuItem>
          <SideNavMenuItem>Lorem Ipsum Dolor Sit Amet 2</SideNavMenuItem>
          <SideNavMenuItem>Lorem Ipsum Dolor Sit Amet 3</SideNavMenuItem>
        </SideNavMenu>
        <SideNavMenu title="Lorem Ipsum Dolor Sit Amet" renderIcon={Folders16}>
          <SideNavMenuItem>Lorem Ipsum Dolor Sit Amet 1</SideNavMenuItem>
          <SideNavMenuItem>Lorem Ipsum Dolor Sit Amet 2</SideNavMenuItem>
          <SideNavMenuItem>Lorem Ipsum Dolor Sit Amet 3</SideNavMenuItem>
        </SideNavMenu>
      </SideNavItems>
    </SideNav>
  );
};
export default SideNavComponent;
