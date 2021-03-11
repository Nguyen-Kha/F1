import React from 'react';
import './App.css';
import MenuBar from './components/MenuBar.js';
import { Layout} from 'antd';
import RaceResultsTable from './pages/sort-by-year/race-results/RaceResultsTable';

const { Sider, Content } = Layout;

function App() {
  return (
    <div>
      <Layout>
        <Sider className="Sidebar">
          <MenuBar />
        </Sider>
        <Content>
          <RaceResultsTable />
        </Content>  
      </Layout> 
    </div>
  );
}

export default App;
