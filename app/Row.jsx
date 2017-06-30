import React from 'react'
import {connect} from 'react-redux'
import * as constants from './constants.jsx'
import {Cell, cellReducer} from './Cell.jsx'


/* Reducers */

export const rowReducer = (state, action) => {
	switch (action.type) {
		case constants.GRID_ACTION_TOGGLE:
			if (state.cellY === action.cellY) {
				return {
					...state,
					cells: state.cells.map(cell => cellReducer(cell, action))
				}
			} else {
				return state
			}
		default:
			return state
	}
}

/* Components */

export const Row = ({row}) => {
	return <div className="row">
		{row.cells.map(cell => <Cell key={cell.id} cell={cell}/>)}
	</div>
}