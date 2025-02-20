import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { db } from '../firebase';
import { doc, onSnapshot, updateDoc, collection } from 'firebase/firestore';
import Admin from './admin';

function AuctionConsole({ user }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    strikers: false,
    warriors: false,
    mavericks: false,
    titans: false,
  });
    
    const [purse, setPurse] = useState({
        strikers: 1000,
        warriors: 1000,
        mavericks: 1000,
        titans: 1000
    })
  
    const [roster, setRoster] = useState({});


  // ✅ Real-time Firestore listener
  useEffect(() => {
      const statusRef = doc(db, 'currentBid', 'status');
      const purseRef = doc(db, 'currentBid', 'purse');

    const unsubscribeStatus = onSnapshot(statusRef, (doc) => {
      if (doc.exists()) {
        setStatus(doc.data());
      } else {
        console.warn('No such document!');
      }
    });
      const unsubscribePurse = onSnapshot(purseRef, (doc) => {
      if (doc.exists()) {
        setPurse(doc.data());
      } else {
        console.warn('No such document!');
      }
      });
    
    const rosterRef = collection(db, 'roster');

    // Listen to real-time updates in the roster collection
    const unsubscribeRoster = onSnapshot(rosterRef, (snapshot) => {
      const updatedRoster = {};
      snapshot.docs.forEach((doc) => {
        updatedRoster[doc.id] = doc.data().team;
      });
      setRoster(updatedRoster);
    });

    // ✅ Clean up listener on unmount
      return () => {
          unsubscribePurse();
        unsubscribeStatus();
        unsubscribeRoster();
    };
  }, []);

  const handleStatusUpdate = async (newStatus) => {
    if (!user) return;

    setLoading(true);
    try {
      const statusRef = doc(db, 'currentBid', 'status'); // Reference to Firestore document
      await updateDoc(statusRef, { [user]: newStatus }); // Update only the user's status
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedPlayers = (team) => 
    Object.values(roster).filter((val) => val ===team).length || 0
  

  return (
    <div
      style={{ width: '100%', height: '90%', padding: '24px', display: 'flex' }}
    >
      <div
        id="teamsA"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: '1',
        }}
      >
        <div
          style={{
            height: '280px',
            background: 'rgba(0, 0, 0, 0.88)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              flex: '1',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              flexDirection: 'column',
            }}
          >
            <span style={{ fontWeight: '700', flex: '1', fontSize: '36px' }}>
              VYMO STRIKERS
            </span>
            <span style={{ fontWeight: '600', flex: '1', fontSize: '24px', color: 'white' }}>
               {`Team Size: 
              ${selectedPlayers('strikers') + 2}`}
            </span>
                      <span style={{ fontWeight: '500', flex: '1', fontSize: '24px', color: 'gold' }}>
              Remaining Purse: {purse.strikers}
            </span>
            {user === 'strikers' && (
              <div style={{ display: 'flex', gap: '16px' }}>
                <Button
                  size="large" variant="solid"
                  onClick={() => handleStatusUpdate(true)}
                  loading={loading}
                >
                  IN
                </Button>
                <Button
                  size="large" variant="solid"
                  onClick={() => handleStatusUpdate(false)}
                  loading={loading}
                >
                  OUT
                </Button>
              </div>
            )}
          </div>
          <div
            style={{
              height: '100%',
              width: '64px',
              background: status.strikers ? '#5CB338' : 'red',
              fontSize: '48px',
              fontWeight: '700',
              writingMode: 'vertical-lr',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ textOrientation: 'upright' }}>
              {status.strikers ? 'IN' : 'OUT'}
            </span>
          </div>
        </div>

        <div
          style={{
            height: '280px',
            background: 'rgba(0, 0, 0, 0.88)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              flex: '1',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              flexDirection: 'column',
            }}
          >
            <span style={{ fontWeight: '700', flex: '1', fontSize: '36px' }}>
              VYMO WARRIORS
            </span>
            <span style={{ fontWeight: '600', flex: '1', fontSize: '24px', color: 'white' }}>
               {`Team Size: 
              ${selectedPlayers('warriors') + 2}`}
            </span>
                      <span style={{ fontWeight: '500', flex: '1', fontSize: '24px', color: 'gold' }}>
              Remaining Purse: {purse.warriors}
            </span>
            {user === 'warriors' && (
              <div style={{ display: 'flex', gap: '16px' }}>
                <Button
                  size="large" variant="solid"
                  onClick={() => handleStatusUpdate(true)}
                  loading={loading}
                >
                  IN
                </Button>
                <Button
                  size="large" variant="solid"
                  onClick={() => handleStatusUpdate(false)}
                  loading={loading}
                >
                  OUT
                </Button>
              </div>
            )}
          </div>
          <div
            style={{
              height: '100%',
              width: '64px',
              background: status.warriors ? '#5CB338' : 'red',
              fontSize: '48px',
              fontWeight: '700',
              writingMode: 'vertical-lr',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ textOrientation: 'upright' }}>
              {status.warriors ? 'IN' : 'OUT'}
            </span>
          </div>
        </div>
      </div>

          <Admin user={user} status={status} purse={purse} roster={roster} />

      <div
        id="teamsB"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: '1',
        }}
      >
        <div
          style={{
            height: '280px',
            background: 'rgba(0, 0, 0, 0.88)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: '64px',
              background: status.mavericks ? '#5CB338' : 'red',
              fontSize: '48px',
              fontWeight: '700',
              writingMode: 'vertical-lr',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ textOrientation: 'upright' }}>
              {status.mavericks ? 'IN' : 'OUT'}
            </span>
          </div>
          <div
            style={{
              flex: '1',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              flexDirection: 'column',
            }}
          >
            <span style={{ fontWeight: '700', flex: '1', fontSize: '36px' }}>
              VYMO MAVERICKS
            </span>
            <span style={{ fontWeight: '600', flex: '1', fontSize: '24px', color: 'white' }}>
               {`Team Size: 
              ${selectedPlayers('mavericks') + 2}`}
            </span>
                      <span style={{ fontWeight: '500', flex: '1', fontSize: '24px', color: 'gold' }}>
              Remaining Purse: {purse.mavericks}
            </span>
            {user === 'mavericks' && (
              <div style={{ display: 'flex', gap: '16px' }}>
                <Button
                  size="large" variant="solid"
                  onClick={() => handleStatusUpdate(true)}
                  loading={loading}
                >
                  IN
                </Button>
                <Button
                  size="large" variant="solid"
                  onClick={() => handleStatusUpdate(false)}
                  loading={loading}
                >
                  OUT
                </Button>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            height: '280px',
            background: 'rgba(0, 0, 0, 0.88)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: '64px',
              background: status.titans ? '#5CB338' : 'red',
              fontSize: '48px',
              fontWeight: '700',
              writingMode: 'vertical-lr',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ textOrientation: 'upright' }}>
              {status.titans ? 'IN' : 'OUT'}
            </span>
          </div>
          <div
            style={{
              flex: '1',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              flexDirection: 'column',
            }}
          >
            <span style={{ fontWeight: '700', flex: '1', fontSize: '36px' }}>
              VYMO TITANS
            </span>
            <span style={{ fontWeight: '600', flex: '1', fontSize: '24px', color: 'white' }}>
              {`Team Size: 
              ${selectedPlayers('titans') + 2}`}
            </span>
                      <span style={{ fontWeight: '500', flex: '1', fontSize: '24px', color: 'gold' }}>
              Remaining Purse: {purse.titans}
            </span>
            {user === 'titans' && (
              <div style={{ display: 'flex', gap: '16px' }}>
                <Button
                  size="large" variant="solid"
                  onClick={() => handleStatusUpdate(true)}
                  loading={loading}
                >
                  IN
                </Button>
                <Button
                  size="large" variant="solid"
                  onClick={() => handleStatusUpdate(false)}
                  loading={loading}
                >
                  OUT
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuctionConsole;
