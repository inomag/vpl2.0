import React, { useEffect, useState } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import { db } from '../firebase';
import Player from '../playerCard';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';

function Admin({ user, status, purse , roster}) {
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  const availablePlayers =
        (players || []).filter((player) => !roster?.[player.id] && !player.notAvailable) || [];

  useEffect(() => {
    const playerRef = doc(db, 'currentBid', 'player');
    const unsubscribePlayer = onSnapshot(playerRef, (doc) => {
      if (doc.exists()) {
        setCurrentPlayer(doc.data());
      } else {
        setCurrentPlayer(null);
        console.warn('No such document!');
      }
    });

    const fetchPlayers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'players'));
        const playersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlayers(playersList);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
    fetchPlayers();
    return () => {
      unsubscribePlayer();
    };
  }, []);

  const handleStart = async () => {
    if (availablePlayers.length > 0) {
      const randomPlayer =
        availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
      try {
        // Update currentBid collection with latest player snapshot
        await setDoc(
          doc(db, 'currentBid', 'player'),
          {
            id: randomPlayer.id,
            price: 50,
          },
          { merge: true },
        );

        console.log('Updated currentBid with:', randomPlayer.id);
      } catch (error) {
        console.error('Error updating currentBid:', error);
      }
    } else {
      handleResetBid();
    }
  };

  const handleResetBid = async () => {
    try {
      await deleteDoc(doc(db, 'currentBid', 'player'));
      console.log('Player document deleted from currentBid.');

      await setDoc(doc(db, 'currentBid', 'status'), {
        mavericks: false,
        strikers: false,
        titans: false,
        warriors: false,
      });
      console.log('Reset status document in currentBid.');
    } catch (error) {
      console.error('Error deleting player from currentBid:', error);
    }
  };

  const handleIncrease = async () => {
    if (currentPlayer) {
      try {
        let newPrice = currentPlayer.price;
        if (newPrice < 100) {
          newPrice = newPrice + 10;
        } else if (newPrice < 200) {
          newPrice = newPrice + 20;
        } else {
          newPrice = newPrice + 30;
        }
        await setDoc(
          doc(db, 'currentBid', 'player'),
          { price: newPrice },
          { merge: true },
        );
        console.log('Increased price to:', newPrice);
      } catch (error) {
        console.error('Error increasing bid price:', error);
      }
    }
  };

  const handleDecrease = async () => {
    if (currentPlayer) {
      try {
        let newPrice = currentPlayer.price;
        if (newPrice > 200) {
          newPrice = newPrice - 30;
        } else if (newPrice > 100) {
          newPrice = newPrice - 20;
        } else {
          newPrice = newPrice - 10;
        }
        await setDoc(
          doc(db, 'currentBid', 'player'),
          { price: newPrice },
          { merge: true },
        );
        console.log('Decreased price to:', newPrice);
      } catch (error) {
        console.error('Error increasing bid price:', error);
      }
    }
  };

  // const handleResetAuction = async () => {
  //   try {
  //     // 1. Delete the player document from the currentBid collection
  //     await deleteDoc(doc(db, 'currentBid', 'player'));
  //     console.log('Deleted player document from currentBid.');

  //     // 2. Reset the purse document in the currentBid collection
  //     await setDoc(doc(db, 'currentBid', 'purse'), {
  //       mavericks: 1000,
  //       strikers: 1000,
  //       titans: 1000,
  //       warriors: 1000,
  //     });
  //     console.log('Reset purse document in currentBid.');

  //     // 3. Reset the status document in the currentBid collection
  //     await setDoc(doc(db, 'currentBid', 'status'), {
  //       mavericks: false,
  //       strikers: false,
  //       titans: false,
  //       warriors: false,
  //     });
  //       console.log('Reset status document in currentBid.');
        
  //       const querySnapshot = await getDocs(collection(db, 'roster'));

  //   const deletePromises = querySnapshot.docs.map((docSnapshot) =>
  //     deleteDoc(doc(db, 'roster', docSnapshot.id))
  //   );

  //   await Promise.all(deletePromises);
  //   console.log(`Deleted all documents from roster collection`);
  //   } catch (error) {
  //     console.error('Error resetting auction:', error);
  //   }
  // };

  const handleSell = async () => {
    try {
      const pickedTeam = Object.keys(status).find(
        (team) => status[team] === true,
      );

      if (!pickedTeam) {
        console.error('No team has been selected for selling.');
        return;
      }

      if (purse[pickedTeam] < currentPlayer.price) {
        return;
      }

      const updatedPurse = {
        ...purse,
        [pickedTeam]: purse[pickedTeam] - currentPlayer.price,
      };

      // Create a new document in the roster collection with player's ID
      const rosterRef = doc(db, 'roster', currentPlayer.id);
      await setDoc(rosterRef, {
        team: pickedTeam,
        price: currentPlayer.price,
      });

      console.log(
        `Player ${currentPlayer.id} sold to ${pickedTeam} for ${currentPlayer.price}`,
      );
      await setDoc(doc(db, 'currentBid', 'purse'), updatedPurse, {
        merge: true,
      });
      console.log('Purse updated: ', updatedPurse);
      handleResetBid();
    } catch (error) {
      console.error('Error selling player:', error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '480px',
        flexDirection: 'column',
        gap: '48px',
      }}
    >
      <span style={{fontWeight: '700', fontSize:'40px'}}>{`Available Players: ${availablePlayers.length}`}</span>

      {currentPlayer && players?.length && (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {user === 'admin' && <Button
            color="default"
            size="large"
            variant="solid"
            icon={<MinusOutlined />}
            shape="circle"
            onClick={handleDecrease}
          />}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {' '}
            <span style={{ fontSize: '24px' }}>Current Price</span>{' '}
            <span style={{ fontWeight: '700', fontSize: '80px' }}>
              {currentPlayer?.price}
            </span>
          </div>
          {user === 'admin' && <Button
            color="default"
            size="large"
            variant="solid"
            icon={<PlusOutlined />}
            shape="circle"
            onClick={handleIncrease}
          />}
        </div>
      )}

      <Player
        player={
          currentPlayer?.id && players?.length
            ? players.find((player) => player.id === currentPlayer.id)
            : {
                name: 'No Player Selected',
                role: '',
                img: 'https://img.freepik.com/premium-vector/user-profile-people-icon-isolated-white-background_322958-4540.jpg?semt=ais_hybrid',
              }
        }
      />

      {user === 'admin' && availablePlayers.length > 0 && <div style={{ display: 'flex', gap: '8px' }}>
        {!currentPlayer ? (
          <Button color="default" variant="solid" onClick={handleStart}>
            Start
          </Button>
        ) : (
          <Button color="default" variant="solid" onClick={handleResetBid}>
            Reset Bid
          </Button>
        )}

        {Boolean(Object.values(status).filter(Boolean).length === 1) && (
          <Popconfirm
            title="Confirm the Bid"
            description="Are you sure?"
            onConfirm={handleSell}
            okText="Yes"
            cancelText="No"
          >
            <Button color="default" variant="solid">
              Sell
            </Button>
          </Popconfirm>
        )}
        {/* <Popconfirm
          title="Reset the auction"
          description="Are you sure to reset this auction?"
          okText="Yes"
          cancelText="No"
        >
          <Button color="danger" variant="solid">
            Reset Auction
          </Button>
        </Popconfirm> */}
      </div>}
    </div>
  );
}

export default Admin;
