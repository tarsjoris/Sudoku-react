import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {combineReducers, createStore} from 'redux'
import {Actions} from './Actions.jsx'
import {Grid, gridReducer} from './Grid.jsx';



const reducers = combineReducers({
	grid: gridReducer
})

const SudokuApp = () => {
	return <div>
		<div className="title"><h1>Sudoku</h1></div>
		<Actions/>
		<Grid/>
	</div>
}

render(
	<Provider store={createStore(reducers)}>
		<SudokuApp />
	</Provider>,
	document.getElementById('app'))