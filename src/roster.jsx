import React, { useState, useEffect } from 'react';
import { Avatar, Typography } from 'antd';
import { captains } from './data';
import { db } from './firebase';
import { onSnapshot , collection, getDocs} from 'firebase/firestore';

function Roster() {
  const [playersList, setPlayerList] = useState([]);
  const [currentRoster, setCurrentRoster] = useState([]);

  const teams = [
    { code: 'mavericks', name: 'Vymo Mavericks' },
    { code: 'strikers', name: 'Vymo Strikers' },
    { code: 'warriors', name: 'Vymo Warriors' },
    {
      code: 'titans',
      name: 'Vymo Titans',
    },
  ];
    
    useEffect(() => {
    // Fetch players from Firestore
    const fetchPlayers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'players'));
        const players = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlayerList(players);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    // Create a real-time snapshot for the roster collection
    const unsubscribe = onSnapshot(collection(db, 'roster'), (snapshot) => {
      const rosterData = {};
      snapshot.forEach((doc) => {
        const playerData = doc.data();
        rosterData[doc.id] = playerData.team; // Store as { playerId: team }
      });
      setCurrentRoster(rosterData);
    });

    fetchPlayers();

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

    const getData = (team) => {
      return [...captains[team], ...(playersList || []).filter((player) => currentRoster[player.id] === team), ]
  };

  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      {teams.map((team) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '300px',
          }}
        >
          <div
            style={{
              height: '100px',
              background: 'rgba(0, 0, 0, 0.88)',
              borderRadius: '16px',
              color: 'white',
              padding: '16px',
              fontSize: '40px',
              fontWeight: '700',
              letterSpacing: '2px',
            }}
          >
            {team.name}
          </div>
          {getData(team.code).map((item) => (
            <div
              style={{
                display: 'flex',
                padding: '8px 12px',
                borderRadius: '16px',
                alignItems: 'center',
                background: 'white',
                justifyContent: 'space-between',
                fontWeight: '600',
              }}
            >
              <div
                style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
              >
                <Avatar
                  src={
                    item.img ||
                    'https://ca.slack-edge.com/T02J5FE6T-U031N7T5Q91-g79948915796-512'
                  }
                />
                <Typography>{item.name}</Typography>
              </div>

              <Typography>{item.role}</Typography>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Roster;
