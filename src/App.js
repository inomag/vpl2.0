import React from 'react';
import { Card , Typography} from 'antd';
import PlayerCards from './players';
import cover from './cover.png';
function App() {
  return (
    <div style={{backgroundColor: '#ffe8e7', padding: '48px', display: 'flex', flexDirection: 'column', height: '100%'}}>
      <Card cover={<img alt='Cover' style={{ height: '200px' }} src={cover}
      />} variant="borderless"
        style={{backgroundColor: 'rgba(0, 0, 0, 0.88)'}}
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
}

export default App;
