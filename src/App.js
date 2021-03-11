import React from 'react';
import './App.css';
import MenuBar from './components/MenuBar.js';
import { Layout} from 'antd';

const { Sider } = Layout;

function App() {
  return (
    <div>
      <Sider className="Sidebar">
        <MenuBar />
      </Sider> 
    </div>
  );
}

export default App;
