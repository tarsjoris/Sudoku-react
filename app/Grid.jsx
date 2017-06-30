import React from 'react'
import {connect} from 'react-redux'
import * as constants from './constants.jsx'
import {Row, rowReducer} from './Row.jsx'


const aid = true
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

const eliminateCell = (cell, sourceCell, workQueue) => {
	if (cell.cellX === sourceCell.cellX // same column
		|| cell.cellY === sourceCell.cellY // same row
		|| (Math.floor(cell.cellX / 3) === Math.floor(sourceCell.cellX / 3) // same block
			&& Math.floor(cell.cellY / 3) === Math.floor(sourceCell.cellY / 3))) {
		if (cell.options.length > 1) {
			const index = cell.options.indexOf(sourceCell.options[0])
			if (index !== -1) {
				const options = [ ...cell.options.slice(0, index), ...cell.options.slice(index + 1) ]
				const newCell = {
					...cell,
					options
				}
				if (aid && options.length === 1) {
					workQueue.push(newCell)
				}
				return newCell
			}
		}
	}
	return cell
}
const eliminateRow = (row, sourceCell, workQueue) => {
	return {
		...row,
		cells: row.cells.map(cell => eliminateCell(cell, sourceCell, workQueue))
	}
}
const eliminate = (state, workQueue) => {
	var newState = state
	while (workQueue.length > 0) {
		const sourceCell = workQueue.shift()
		newState = {
			...newState,
			rows: newState.rows.map(row => eliminateRow(row, sourceCell, workQueue))
		}
	}
	return newState
}
export const gridReducer = (state = parseOutline(outline), action) => {
	switch (action.type) {
		case constants.GRID_ACTION_TOGGLE:
			history.push(state)
			var newState = {
				...state,
				rows: state.rows.map(row => rowReducer(row, action))
			}
			const cell = newState.rows[action.cellY].cells[action.cellX]
			if (aid && cell.options.length === 1) {
				newState = eliminate(newState, [cell])
			}
			return newState
		case constants.GRID_ACTION_ELIMINATE:
			if (action.cell.options.length === 1) {
				history.push(state)
				return eliminate(state, [action.cell])
			}
			return state
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
const parseOutline = (outline) => {
	var rows = []
	var workQueue = []
	for (var y = 0; y < 9; ++y) {
		var cells = []
		for (var x = 0; x < 9; ++x) {
			const index = y * 9 + x
			const ch = outline.charAt(index)
			const fixed = ch !== '.'
			const cell = {
				id: 'cell-' + index,
				cellX: x,
				cellY: y,
				fixed,
				options: fixed ? [ch - '0'] : [1, 2, 3, 4, 5, 6, 7, 8, 9]
			}
			if (fixed) {
				workQueue.push(cell)
			}
			cells.push(cell)
		}
		rows.push({
			id: 'row-' + y,
			cellY: y,
			cells
		})
	}
	const state = { rows}
	return aid ? eliminate(state, workQueue) : state
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