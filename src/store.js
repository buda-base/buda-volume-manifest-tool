import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
// import events from "./reducers/events"
// import { getAllEvents } from "./services/events"
// import { setAllEvents, startFetchingEvents } from "./actions/events"
import { reducer as formReducer } from 'redux-form'
import manifest from './reducers/index'

const composeWithDevTools =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
    combineReducers({
        manifest,
        form: formReducer,
    }),
    composeWithDevTools(applyMiddleware())
)

// function getEvents(dispatch, getState) {
//     dispatch(startFetchingEvents())
//     getAllEvents(
//         "band_Stop_Light_Observations"
//     ).then(({ data: { docs: allEvents } }) => {
//         dispatch(setAllEvents(allEvents))
//     })
// }

// store.dispatch(getEvents)

export default store