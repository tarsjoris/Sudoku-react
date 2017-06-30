import React from 'react'
import {connect} from 'react-redux'
import * as constants from './constants.jsx'
import {Options} from './Options.jsx'


/* Reducers */

export const cellReducer = (state, action) => {
	switch (action.type) {
		case constants.GRID_ACTION_TOGGLE:
			if (state.cellX === action.cellX) {
				var index = state.options.indexOf(action.option)
				var options = index === -1 ? [ ...state.options, action.option] : [ ...state.options.slice(0, index), ...state.options.slice(index + 1)]
				return {
					...state,
					options
				}
			} else {
				return state
			}
		default:
			return state
	}
}

/* Components */

export const Cell = ({cell}) => {
	var options = cell.options
	var classes = 'cell'
	switch (cell.cellX % 3) {
		case 0:
			classes += ' hor-first'
			break
		case 2:
			classes += ' hor-last'
			break
	}
	switch (cell.cellY % 3) {
		case 0:
			classes += ' ver-first'
			break
		case 2:
			classes += ' ver-last'
			break
	}
	if (cell.fixed) {
		classes += ' fixed'
	}
	if (options.length === 1) {
		classes += ' final'
		return <div className={classes}>
			<span className="cell-content">{options[0]}</span>
		</div>
	} else {
		return <div className={classes}>
			<Options key={cell.id + 'options'} cellID={cell.id} cellX={cell.cellX} cellY={cell.cellY} options={cell.options} />
		</div>
	}
}