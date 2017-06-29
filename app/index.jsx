import React from 'react'
import {render} from 'react-dom'
import {Provider, connect} from 'react-redux'
import {combineReducers, createStore} from 'redux'

const UNKNOWN = -1
const GRID_ACTION_TOGGLE = 'GRID_ACTION_TOGGLE'
const GRID_ACTION_ELIMINATE = 'GRID_ACTION_ELIMINATE'

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

/* Reducers */

const cellReducer = (state, action) => {
	switch (action.type) {
		case GRID_ACTION_TOGGLE:
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

const rowReducer = (state, action) => {
	switch (action.type) {
		case GRID_ACTION_TOGGLE:
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

const eliminateCell = (cell, rows) => {
	return cell
}
const eliminateRow = (row, rows) => {
	return {
		...row,
		cells: row.cells.map(cell => eliminateCell(cell, rows))
	}
}
const gridReducer = (state = parseOutline(outline), action) => {
	switch (action.type) {
		case GRID_ACTION_TOGGLE:
			return {
				...state,
				rows: state.rows.map(row => rowReducer(row, action))
			}
		case GRID_ACTION_ELIMINATE:
			return {
				...state,
				rows: state.rows.map(row => eliminateRow(row, state.rows))
			}
		default:
			return state
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

const sudokuApp = combineReducers({
	grid: gridReducer
})

/* Action providers */

const toggleOption = (cellX, cellY, option) => {
	return {
		type: GRID_ACTION_TOGGLE,
		cellX,
		cellY,
		option
	}
}

/* Components */

const OptionBase = ({options, option,  onClick}) => {
	var classes = 'options-cell'
	if (options.indexOf(option) === -1) {
		classes += ' hide'
	}
	return <div className={classes} onClick={onClick}><span className="options-content">{option}</span></div>	
}
const mapDispatchToOptionProps = (dispatch, ownProps) => {
	return {
		onClick: () => {
			dispatch(toggleOption(ownProps.cellX, ownProps.cellY, ownProps.option))
		}
	}
}
const Option = connect(
	null,
	mapDispatchToOptionProps
)(OptionBase)

const Options = ({cellID, cellX, cellY, options}) => {
	var rows = []
	for (var y = 0; y < 3; ++y) {
		var cells = []
		for (var x = 0; x < 3; ++x) {
			var index = y * 3 + x
			var key = cellID + '-option-' + index
			var option = index + 1
			cells.push(<Option key={key} cellX={cellX} cellY={cellY} options={options} option={option}/>)
		}
		rows.push(<div key={cellID + '-options-row-' + y} className="options-row">{cells}</div>)
	}
	return <div className="options">{rows}</div>
}

const Cell = ({cell}) => {
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

const Row = ({row}) => {
	return <div className="row">
		{row.cells.map(cell => <Cell key={cell.id} cell={cell}/>)}
	</div>
}

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
const Grid = connect(
  mapStateToGridProps
)(GridBase)

const SudokuApp = () => {
	return <div>
		<div className="title"><h1>Sudoku</h1></div>
		<Grid/>
	</div>
}

render(
	<Provider store={createStore(sudokuApp)}>
    	<SudokuApp />
	</Provider>,
	document.getElementById('app'))