import React from 'react'
import {connect} from 'react-redux'
import * as constants from './constants.jsx'
import {Row, rowReducer} from './Row.jsx'


const outline =
"........." +
"2.7...4.6" +
"..36.85.." +
".723.416." +
".5.1.9.2." +
".842.579." +
"..98.26.." +
"7.8...9.1" +
"........."

let history = []

/* Reducers */

const eliminateCell = (cell, rows) => {
	return cell
}
const eliminateRow = (row, rows) => {
	return {
		...row,
		cells: row.cells.map(cell => eliminateCell(cell, rows))
	}
}
const parseOutline = (outline) => {
	var rows = []
	for (var y = 0; y < 9; ++y) {
		var cells = []
		for (var x = 0; x < 9; ++x) {
			var index = y * 9 + x
			var ch = outline.charAt(index)
			var fixed = ch !== '.'
			cells.push({
				id: 'cell-' + index,
				cellX: x,
				cellY: y,
				fixed,
				options: fixed ? [ch - '0'] : [1, 2, 3, 4, 5, 6, 7, 8, 9]
			})
		}
		rows.push({
			id: 'row-' + y,
			cellY: y,
			cells
		})
	}
	return {
		rows
	}
}
export const gridReducer = (state = parseOutline(outline), action) => {
	switch (action.type) {
		case constants.GRID_ACTION_TOGGLE:
			history.push(state)
			return {
				...state,
				rows: state.rows.map(row => rowReducer(row, action))
			}
		case constants.GRID_ACTION_ELIMINATE:
			history.push(state)
			return {
				...state,
				rows: state.rows.map(row => eliminateRow(row, state.rows))
			}
		case constants.GRID_ACTION_UNDO:
			if (history.length > 0) {
				return history.pop()
			} else {
				return state
			}
		default:
			return state
	}
}

/* Components */

const GridBase = ({grid}) => {
	return <div className="grid">
		{grid.rows.map(row => <Row key={row.id} row={row}/>)}
	</div>
}
const mapStateToGridProps = (state, ownProps) => {
	return {
		grid: state.grid
	}
}
export const Grid = connect(
  mapStateToGridProps
)(GridBase)