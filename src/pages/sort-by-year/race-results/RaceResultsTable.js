import React from 'react';
import { Button, Table, Dropdown, Menu } from 'antd';
import { DownOutlined} from '@ant-design/icons';
import './RaceResultsTable.scss';

const menu = (
    <Menu>
        <Menu.Item>1st menu item</Menu.Item>
        <Menu.Item>2nd menu item</Menu.Item>
        <Menu.Item>3rd menu item</Menu.Item>
    </Menu>
);;

const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
  ];
  
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];

class RaceResultsTable extends React.Component {

    render(){
        return(
            <div>
                <div className="header">
                    <Dropdown overlay={menu} placement="bottomLeft" arrow>
                        <Button>Select A Year<DownOutlined /></Button>
                    </Dropdown>
                    <Dropdown overlay={menu} placement="bottomLeft" arrow>
                        <Button>Select A Race<DownOutlined /></Button>
                    </Dropdown>
                    <Button type="primary">Confirm</Button>
                </div>
                <Table dataSource={dataSource} columns={columns} pagination={false}/>
            </div>
        );
    };
};

export default RaceResultsTable;