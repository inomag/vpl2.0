import React, { useState } from 'react';
import { Card, Typography, Button } from 'antd';
import { TeamOutlined, ControlOutlined, UnorderedListOutlined } from '@ant-design/icons';
import PlayerCards from './players';
import Dashboard from './dashboard';
import Roster from './roster';
import cover from './cover.png';
function App() {

  const [selectedMenu, setSelectedMenu] = useState('list');

  const playerList = (
    <div style={{ backgroundColor: '#ffe3e1', display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', overflow: 'scroll' }}>
      <Card cover={<img alt='Cover' style={{ height: '200px' }} src={cover}
      />} variant="borderless"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.88)' }}
      >
        <Typography.Title
          level={2}
          style={{
            margin: 0,
            color: 'white'
          }}
        >
          Vymo Premier League 2.0 Players List
        </Typography.Title>
      </Card>
      <PlayerCards />
    </div>
  ); 

  const getChild = () => {
    switch (selectedMenu) {
      case 'list':
        return playerList;
      case 'dashboard':
        return <Dashboard />;
      case 'roster':
        return <Roster />;
      default:
        return playerList;
    }
  }

  return (
    <div style={{display: 'flex', height: '100vh', overflow: 'hidden', padding: '16px', gap: '16px', background: '#ffe3e1'}}>

      <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  <Button  variant="solid" shape="circle" icon={<TeamOutlined />} size={'large'} onClick={() => setSelectedMenu('list')} color='default'/>
          <Button variant="solid" shape="circle" icon={<ControlOutlined />} size={'large'} onClick={() => setSelectedMenu('dashboard')} color='default'/>
          <Button variant="solid" shape="circle" icon={<UnorderedListOutlined />} size={'large'} onClick={() => setSelectedMenu('roster')} color='default'/>

      </div>
      {getChild()}
    </div>
  )
}

export default App;
