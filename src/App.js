import React from 'react';
import { connect } from 'react-redux';
import "./App.css";
import alarm from './assets/alarm-sound.mp3';

// alarm geraeusch abspielen lassen bei 00:00

function App(props) {
  return (
    <div className="background center">
      <div className="clock-container">
        <h1 className="center w-100 bg-success text-white m-0" style={{height: "25%"}}>25 + 5 Clock</h1>

        <div className="row w-100 bg-primary ms-0 pt-2" style={{height: "25%"}}>
          <div className="col center-column">
            <div className="w-100 center h-50 text-white align-items-end fs-4" id="break-label">Break Length</div>
            <div className="w-100 center h-50">
              <i className="fa-solid fa-arrow-down text-white fs-2" id="break-decrement" onClick={props.breakDecrement}></i>
              <div className="center text-white mx-3 fs-2" id="break-length">{props.breakLength}</div>
              <i className="fa-solid fa-arrow-up text-white fs-2" id="break-increment" onClick={props.breakIncrement}></i>
            </div>
          </div>
          <div className="col center-column">
            <div className="w-100 center h-50 text-white align-items-end fs-4" id="session-label">Session Length</div>
            <div className="w-100 center h-50">
              <i className="fa-solid fa-arrow-down text-white fs-2" id="session-decrement" onClick={props.sessionDecrement}></i>
              <div className="center text-white mx-3 fs-2" id="session-length">{props.sessionLength}</div>
              <i className="fa-solid fa-arrow-up text-white fs-2" id="session-increment" onClick={props.sessionIncrement}></i>
            </div>
          </div>
        </div>

        <div className="center w-100 bg-primary" style={{height: "40%"}}>
          <div className="border rounded-5 w-50 h-75 py-3">
            <div className="center w-100 text-white fs-3" style={{height: "23%"}} id="timer-label">{props.breakOrSession === 'break' ? 'Break' : 'Session'}</div>
            <div className="text-center w-100 text-white" style={{height: "77%", fontSize: "3.5rem"}} id="time-left">
              {String(Math.floor(props.secondsLeft / 60)).padStart(2, '0') + ':' + String(props.secondsLeft % 60).padStart(2, '0')}
            </div>
            <audio id="beep" src={alarm}></audio>
          </div>
        </div>

        <div className="center w-100 bg-primary pb-3" style={{height: "10%"}}>
          <div id="start_stop" onClick={props.intervalId ? props.pause : props.play}>
            {props.intervalId
            ? <i className="fa-solid fa-pause me-3 fs-2 text-white"></i>
            : <i className="fa-solid fa-play me-3 fs-2 text-white"></i>}
          </div>
          <div id="reset" onClick={props.reset}>
            <i className="fa-solid fa-arrows-rotate ms-3 fs-2 text-white"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

const play = () => {
  return (dispatch, getState) => {
    const intervalId = setInterval(() => {
      const currentState = getState();

      if (currentState.clock.secondsLeft <= 0) {
        const alarm = document.getElementById('beep');
        alarm.play();
        setTimeout(() => {
          alarm.pause();
        }, 3800);

        currentState.clock.breakOrSession === 'session'
        ? dispatch({ type: 'BREAK' })
        : dispatch({ type: 'SESSION' });
      } else {
        dispatch({ type: 'DECREASE_SECONDS' });
      }
    }, 1000)

    dispatch({ type: 'PLAY', payload: intervalId });
  };
};

const pause = () => {
  return (dispatch, getState) => {
    const currentState = getState();

    clearInterval(currentState.clock.intervalId);
    
    dispatch({ type: 'PAUSE' });
  }
}

const reset = () => {
  return (dispatch, getState) => {
    const alarm = document.getElementById('beep');
    alarm.pause();
    alarm.currentTime = 0;

    dispatch(pause());
    dispatch({ type: 'RESET' });
  }
}

const mapStateToProps = (state) => ({
  breakLength: state.clock.breakLength,
  sessionLength: state.clock.sessionLength,
  secondsLeft: state.clock.secondsLeft,
  intervalId: state.clock.intervalId,
  breakOrSession: state.clock.breakOrSession
});

const mapDispatchToProps = (dispatch) => ({
  sessionIncrement: () => dispatch({ type: 'INCREMENT', payload: 'session' }),
  sessionDecrement: () => dispatch({ type: 'DECREMENT', payload: 'session' }),
  breakIncrement: () => dispatch({ type: 'INCREMENT', payload: 'break' }),
  breakDecrement: () => dispatch({ type: 'DECREMENT', payload: 'break' }),
  play: () => dispatch(play()),
  pause: () => dispatch(pause()),
  reset: () => dispatch(reset())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
