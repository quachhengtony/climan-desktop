import {
  Accordion,
  AccordionItem,
  Content,
  Tab,
} from 'carbon-components-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import '../styles/xterm.scss';
import { LocalEchoAddon } from '@gytx/xterm-local-echo';

// interface IProps {
//   id: string;
// }

interface IState {
  Command: {
    input: string;
    output: string;
  }[];
}

const XTerm: React.FC = () => {
  var line: string = '';
  const { tabId } = useParams();
  const [commandHistory, setCommandHistory] = useState<IState['Command']>([
    {
      input: 'Start',
      output: 'Hey',
    },
  ]);

  useEffect(() => {
    try {
      var term = new Terminal({
        cursorBlink: true,
        cursorStyle: 'bar',
        windowsMode: true,
        fontFamily: 'Fira Code',
        // cols: 120,
        // rows: 40,
        fontSize: 12,
        fontWeight: 'normal',
        fontWeightBold: 'bold',
        lineHeight: 1,
        letterSpacing: 0,
        theme: {
          foreground: '#eeeeec',
          background: '#262626',
          cursor: '#bbbbbb',

          black: '#2e3436',
          brightBlack: '#555753',

          red: '#cc0000',
          brightRed: '#ef2929',

          green: '#4e9a06',
          brightGreen: '#8ae234',

          yellow: '#c4a000',
          brightYellow: '#fce94f',

          blue: '#3465a4',
          brightBlue: '#729fcf',

          magenta: '#75507b',
          brightMagenta: '#ad7fa8',

          cyan: '#06989a',
          brightCyan: '#34e2e2',

          white: '#d3d7cf',
          brightWhite: '#eeeeec',
        },
      });

      var fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      var termElement = document.getElementById('terminal-container');
      if (termElement) {
        term.open(termElement);
        const localEcho = new LocalEchoAddon();
        term.loadAddon(localEcho);
        fitAddon.fit();

        term.onKey((e) => {
          if (e.key == '\r') {
            term.clear();
          }
        });

        term.onData((data) => {
          const code = data.charCodeAt(0);

          if (code < 32) {
            if (code == 13) {
              setCommandHistory((prevState) => [
                { input: line, output: '...' },
                ...prevState,
              ]);
              line = '';
            }
          } else {
            line += data;
          }

          electron.ipcRenderer.send(`terminal${tabId}-keystroke`, data);
        });

        electron.ipcRenderer.on(
          `terminal${tabId}-incomingData`,
          (event, data) => {
            term.write(data);
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Content
      style={{
        paddingTop: '0',
        backgroundColor: '#262626',
      }}
    >
      <div id="terminal-container"></div>
      <div className="scrollbar-hidden">
        <Accordion style={{ width: '100%' }}>
          {commandHistory.map((command) => (
            <AccordionItem title={command.input}>
              <p>{command.output}</p>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Content>
  );
};
export default XTerm;
