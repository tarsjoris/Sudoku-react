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

const eliminateCell = (cell, cellX, cellY, value) => {
	if (cell.cellX === cellX || cell.cellY === cellY ||
	(Math.floor(cell.cellX / 3) === Math.floor(cellX / 3) && Math.floor(cell.cellY / 3) === Math.floor(cellY / 3))) {
		if (cell.options.length > 1) {
			const index = cell.options.indexOf(value)
			if (index !== -1) {
				const returnv = {
					...cell,
					options: [ ...cell.options.slice(0, index), ...cell.options.slice(index + 1) ]
				}
				return returnv
			}
		}
	}
	return cell
}
const eliminateRow = (row, cellX, cellY, value) => {
	return {
		...row,
		cells: row.cells.map(cell => eliminateCell(cell, cellX, cellY, value))
	}
}
const parseOutline = (outline) => {
	var rows = []
	for (var y = 0; y < 9; ++y) {
		var cells = []
		for (var x = 0; x < 9; ++x) {
			const index = y * 9 + x
			const ch = outline.charAt(index)
			const fixed = ch !== '.'
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
			const cellX = action.cellX
			const cellY = action.cellY
			if (cellY >= 0 && cellY < state.rows.length) {
				const row = state.rows[cellY]
				if (cellX >= 0 && cellX < row.cells.length) {
					const cell = row.cells[cellX]
					if (cell.options.length === 1) {
						return {
							...state,
							rows: state.rows.map(row => eliminateRow(row, cellX, cellY, cell.options[0]))
						}
					}
				}
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