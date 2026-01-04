import { combineReducers } from 'redux';

const initialState = {
  sessionLength: 25,
  breakLength: 5,
  intervalId: null,
  breakOrSession: 'session',
  secondsLeft: 1500
};


const clockReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      if (!state.intervalId) {
        return action.payload === 'break'
        ? { ...state, 
          breakLength: state.breakLength < 60
            ? state.breakLength + 1
            : state.breakLength
        }
        : { ...state, 
          sessionLength: state.sessionLength < 60
            ? state.sessionLength + 1
            : state.sessionLength, 
          secondsLeft: state.secondsLeft < 3600
            ? state.secondsLeft + 60
            : state.secondsLeft
        };
      } else {
        return state;
      }
      

    case 'DECREMENT':
      if (!state.intervalId) {
        return action.payload === 'break'
          ? { ...state, breakLength: state.breakLength > 1
            ? state.breakLength - 1
            : state.breakLength
          }
          : { ...state, 
            sessionLength: state.sessionLength > 1
              ? state.sessionLength - 1
              : state.sessionLength, 
            secondsLeft: state.secondsLeft > 119
              ? state.secondsLeft - 60
              : state.secondsLeft
          };
      } else {
        return state;
      }

    case 'PLAY':
      return { ...state, intervalId: action.payload, isPlaying: true };

    case 'PAUSE':
      return { ...state, intervalId: null, isPlaying: false };

    case 'DECREASE_SECONDS':
      return { ...state, secondsLeft: state.secondsLeft - 1 };

    case 'BREAK':
      return { ...state, secondsLeft: state.breakLength * 60, breakOrSession: 'break'};

    case 'SESSION':
      return { ...state, secondsLeft: state.sessionLength * 60, breakOrSession: 'session'};

    case 'RESET':
      return { ...state, 
        sessionLength: 25,
        breakLength: 5,
        intervalId: null,
        breakOrSession: 'session',
        secondsLeft: 1500
      };

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  clock: clockReducer
});

export default rootReducer;