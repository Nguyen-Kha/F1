import React from 'react';
import { Layout, Menu } from 'antd';
import './MenuBar.scss';
import logo from '../assets/f1-logo.png';

const { SubMenu } = Menu;
const { Sider } = Layout;

class MenuBar extends React.Component {
    handleClick = e => {
        console.log('click ', e);
        this.setState({ current: e.key });
    };

render(){
    return(
        <div className="MenuBar">
            <Sider className="Sidebar">
                <img src={logo} alt="Logo"/>
                <Menu theme="dark" onClick={this.handleClick} defaultSelectedKeys={['1']} mode="inline">
                    <SubMenu key="sub1" title="Sort By Year Table">
                        <Menu.Item key="1">Race Results</Menu.Item>
                        <Menu.Item key="2">Driver Results</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" title="Sort By Driver Chart">
                        <Menu.Item key="4">Option 4</Menu.Item>
                        <Menu.Item key="5">Option 5</Menu.Item>
                        <Menu.Item key="6">Option 6</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub3" title="Navigation Three">
                        <Menu.Item key="7">Option 7</Menu.Item>
                        <Menu.Item key="8">Option 8</Menu.Item>
                        <Menu.Item key="9">Option 9</Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
        </div>

        );
    }
};

export default MenuBar;