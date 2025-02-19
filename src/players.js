import React, { useState } from 'react';
import { Typography } from 'antd';
import './App';
import { players } from './data';
import Player from './playerCard';

const { Title } = Typography;


function PlayerCards() {
  const [playersList, ] = useState(players);

  const oldPlayers = playersList.filter((player) => player.vpl);
    const newPlayers = playersList.filter((player) => !player.vpl);


  return (
      <div>
      <Title level={3}>VPL 1.0 Players</Title>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          margin: '16px',
        }}
      >
        {oldPlayers.map((player) => (
          <Player player={player} />
        ))}
      </div>

      <Title level={3}>New Players</Title>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          margin: '16px',
        }}
      >
        {newPlayers.map((player) => (
          <Player player={player} />
        ))}
      </div>
    </div>
  );
}

export default PlayerCards;
