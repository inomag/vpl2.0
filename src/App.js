import React from 'react';
import { Card , Typography} from 'antd';
import PlayerCards from './players';
import cover from './cover.png';
function App() {
  return (
    <div style={{backgroundColor: 'rgb(240, 242, 245)', padding: '48px', display: 'flex', flexDirection: 'column', height: '100%'}}>
      <Card cover={<img alt='Cover' style={{ height: '200px' }} src={cover}
 />}     variant="borderless"
>
       <Typography.Title
        level={2}
        style={{
          margin: 0,
        }}
      >
        Vymo Premier League 2.0
      </Typography.Title>
      </Card>

      <PlayerCards />
      
    </div>
  );
}

export default App;
