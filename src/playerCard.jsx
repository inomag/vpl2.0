function Stats({ player }) {
  const { vpl } = player;
  return (
    <div
      style={{
        height: '100px',
        backgroundColor: '#000000',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        fontWeight: 'bold',
        fontSize: '12px',
        color: 'white',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          gap: '4px',
          marginLeft: '8px',
        }}
      >
        <span>Matches : {vpl.matches}</span>
        <span>Runs : {vpl.runs}</span>
        <span>Average : {vpl.average}</span>
        <span>Strike Rate : {vpl.strikeRate}</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          gap: '4px',
          textAlign: 'end',
          marginRight: '8px',
        }}
      >
        <span>Sixes : {vpl.sixes}</span>
        <span>Fours : {vpl.fours}</span>
        <span>Highest : {vpl.hs}</span>
        <span>Wickets : {vpl.wickets}</span>
        <span>Economy : {vpl.economy}</span>
      </div>
    </div>
  );
}

function Player({ player }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '260px',
        background: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <img
        alt="example"
        src={
          player?.img ||
          'https://ca.slack-edge.com/T02J5FE6T-U031N7T5Q91-g79948915796-512'
        }
        style={{ width: '260px', height: '300px', objectFit: 'cover' }}
      />

      <div
        style={{
          writingMode: 'sideways-lr',
          textOrientation: 'mixed',
          backgroundColor: '#000000',
          color: '#fff',
          padding: '20px 10px',
          textAlign: 'center',
          borderRadius: '8px 0px 8px 0px',
          position: 'absolute',
          left: '0',
          top: '0',
        }}
      >
        {player.name}
          </div>
          <div
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          backgroundColor: '#fff',
          color: '#000',
          padding: '20px 10px',
          textAlign: 'center',
          borderRadius: '0px 8px 0px 8px',
          position: 'absolute',
          right: '0',
                  top: '0',
          fontWeight: 'bold'
        }}
      >
        {player.role}
      </div>
      {player.vpl && <Stats player={player} />}
    </div>
  );
}

export default Player;