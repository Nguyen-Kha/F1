import React from 'react';
import './App.css';
import MenuBar from './components/MenuBar.js';
import { Layout} from 'antd';

const { Sider } = Layout;

function App() {
  return (
    <div>
      <Layout>
        <Sider className="Sidebar">
          <MenuBar />
        </Sider>
        <Layout>
        </Layout>  
      </Layout> 
    </div>
  );
}

export default App;
