import React from 'react'
import {connect} from 'react-redux'
import * as common from './common.jsx'
import {Cell, cellReducer} from './Cell.jsx'


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

const validateGrid = (state) => {
	const invalidCells = new Set()
	common.ZONES.zonesToCells.forEach((zoneToCells) => {
		for (var value = 0; value < common.SIZE * common.SIZE; ++value) {
			const conflictingCells = zoneToCells.filter(index => state.cells[index].options.length === 1 && state.cells[index].options[0] === value)
			if (conflictingCells.length > 1) {
				conflictingCells.forEach(index => invalidCells.add(index))
			}
		}
	})
	if (invalidCells.size > 0) {
		return {
			...state,
			cells: state.cells.map((cell, index) => {
				if (invalidCells.has(index)) {
					return {
						...cell,
						invalid: true
					}
				} else {
					return cell
				}
			})
		}
	} else {
		return state
	}
}
const eliminateCell = (cell, value, workQueue) => {
	if (cell.options.length > 1) {
		const index = cell.options.indexOf(value)
		if (index !== -1) {
			const newCell = {
				...cell,
				options: [ ...cell.options.slice(0, index), ...cell.options.slice(index + 1) ]
			}
			if (common.AID && newCell.options.length === 1) {
				workQueue.push(newCell)
			}
			return newCell
		}
	}
	return cell
}
const eliminate = (state, workQueue) => {
	var newState = state
	while (workQueue.length > 0) {
		const sourceCell = workQueue.shift()
		const value = sourceCell.options[0]
		const cellToZones = common.ZONES.cellsToZones[common.cellIndex(sourceCell.cellX, sourceCell.cellY)]
		cellToZones.forEach(zone =>
			common.ZONES.zonesToCells[zone].forEach(index => {
				newState = {
					...newState,
					cells: [
						...newState.cells.slice(0, index),
						eliminateCell(newState.cells[index], value, workQueue),
						...newState.cells.slice(index + 1)
					]
				}
			}))
	}
	return newState
}
export const gridReducer = (state = parseOutline(outline), action) => {
	switch (action.type) {
		case common.GRID_ACTION_TOGGLE:
			history.push(state)
			var newState = {
				...state,
				cells: state.cells.map(cell => cellReducer(cell, action))
			}
			const cell = newState.cells[common.cellIndex(action.cellX, action.cellY)]
			if (common.AID && cell.options.length === 1) {
				newState = eliminate(newState, [cell])
			}
			return validateGrid(newState)
		case common.GRID_ACTION_ELIMINATE:
			if (action.cell.options.length === 1) {
				history.push(state)
				return validateGrid(eliminate(state, [action.cell]))
			}
			return state
		case common.GRID_ACTION_UNDO:
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
	var cells = []
	var workQueue = []
	for (var y = 0; y < common.SIZE * common.SIZE; ++y) {
		for (var x = 0; x < common.SIZE * common.SIZE; ++x) {
			const index = common.cellIndex(x, y)
			const ch = outline.charAt(index)
			const fixed = ch !== '.'
			const cell = {
				id: 'cell-' + index,
				cellX: x,
				cellY: y,
				fixed,
				invalid: false,
				options: fixed ? [ch - '0'] : [1, 2, 3, 4, 5, 6, 7, 8, 9]
			}
			if (fixed) {
				workQueue.push(cell)
			}
			cells.push(cell)
		}
	}
	var state = { cells }
	if (common.AID) {
		state = eliminate(state, workQueue)
	}
	state = validateGrid(state)
	return state
}

/* Components */

const GridBase = ({grid}) => {
	const rows = []
	for (var y = 0; y < common.SIZE * common.SIZE; ++y) {
		const cells = []
		for (var x = 0; x < common.SIZE * common.SIZE; ++x) {
			const cell = grid.cells[common.cellIndex(x, y)]
			cells.push(<Cell key={cell.id} cell={cell}/>)
		}
		const rowID = 'row-' + y
		rows.push(<div key={rowID} className="row">{cells}</div>)
	}
	return <div className="grid">{rows}</div>
}
const mapStateToGridProps = (state, ownProps) => {
	return {
		grid: state.grid
	}
}
export const Grid = connect(
  mapStateToGridProps
)(GridBase)