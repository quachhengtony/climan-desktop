import { Close16, NewTab16 } from '@carbon/icons-react';
import {
  Accordion,
  AccordionItem,
  Button,
  Content,
  Tab,
  Tabs,
} from 'carbon-components-react';
import React, { useEffect, useState } from 'react';
import HeaderComponent from 'renderer/components/HeaderComponent';
import '../styles/xterm.scss';

interface IState {
  Tab: {
    id: number;
    name: string;
  }[];
}

const Workspace: React.FC = () => {
  const [tabs, setTabs] = useState<IState['Tab']>([]);
  const [selectedTab, setSelectedTab] = useState<number>();

  const closeWindow = () => {
    electron.windowApi.closeWindow();
  };

  const restoreWindow = () => {
    electron.windowApi.restoreWindow();
  };

  const minimizeWindow = () => {
    electron.windowApi.minimizeWindow();
  };

  const makeId = (length: number) => {
    var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const handleCreateTab = () => {
    try {
      const uid = makeId(5);
      electron.ipcRenderer.send('browserview-create', uid);
      setTabs((tabs) => [...tabs, { id: tabs.length, name: uid }]);
      setSelectedTab(tabs.length);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSwitchTab = (id) => {
    try {
      electron.ipcRenderer.send('browserview-switch', id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTab = (e, id) => {
    e.preventDefault();
    try {
      if (tabs.length > 0) {
        // if (id == selectedTab) {
        //   electron.ipcRenderer.send('browserview-switch', id--);
        // }
        electron.ipcRenderer.send('browserview-delete', id);
        setTabs(tabs.filter((tab) => tab.id !== id));
        // setSelectedTab(tabs.length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      const uid = makeId(5);
      electron.ipcRenderer.send('browserview-create', uid);
      setTabs((tabs) => [...tabs, { id: tabs.length, name: uid }]);
      setSelectedTab(tabs.length);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <HeaderComponent
        closeWindow={closeWindow}
        restoreWindow={restoreWindow}
        minimizeWindow={minimizeWindow}
      />
      <Content
        style={{
          padding: '0',
          height: '100vh',
          width: '100vw',
          backgroundColor: '#262626',
        }}
      >
        {/* <div className="bx--grid bx--grid--condensed">
          <div className="bx--row"> */}
        {/* <div className="bx--col-lg-16"> */}
        <Tabs type="container" selected={selectedTab}>
          {tabs.map((tab) => (
            <Tab
              id={tab.id.toString()}
              key={tab.id.toString()}
              label={tab.name}
              onClick={() => handleSwitchTab(tab.id)}
              onContextMenu={(e) => handleDeleteTab(e, tab.id)}
            ></Tab>
          ))}

          <Button kind="ghost" onClick={handleCreateTab}>
            <NewTab16 />
          </Button>
        </Tabs>
        {/* </div> */}
        {/* </div>
        </div> */}
      </Content>
    </>
  );
};
export default Workspace;
