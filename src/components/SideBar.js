import React from 'react';
import { Menu } from 'antd';
import './SideBar.css';

const { SubMenu } = Menu;

class SideBar extends React.Component {
    handleClick = e => {
        console.log('click ', e);
        this.setState({ current: e.key });
};

render(){
    return(
        <div style={{width: 256}} >
            <Menu theme="dark" onClick={this.handleClick} defaultSelectedKeys={['0']} mode="inline">
                <SubMenu key="sub1" title="Navigation One">
                   <Menu.Item key="1">Option 1</Menu.Item>
                   <Menu.Item key="2">Option 2</Menu.Item>
                   <Menu.Item key="3">Option 3</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" title="Navigation Two">
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
        </div>
        );
    }
};

export default SideBar;