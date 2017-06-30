import React from 'react'
import {connect} from 'react-redux'
import * as constants from './constants.jsx'


/* Action providers */

const createToggleOption = (cellX, cellY, option) => {
	return {
		type: constants.GRID_ACTION_TOGGLE,
		cellX,
		cellY,
		option
	}
}

/* Components */

const OptionBase = ({options, option, onClick}) => {
	var classes = 'options-cell'
	if (options.indexOf(option) === -1) {
		classes += ' hide'
	}
	return <div className={classes} onClick={onClick}><span className="options-content">{option}</span></div>	
}
const mapDispatchToOptionProps = (dispatch, ownProps) => {
	return {
		onClick: () => {
			dispatch(createToggleOption(ownProps.cellX, ownProps.cellY, ownProps.option))
		}
	}
}
const Option = connect(
	null,
	mapDispatchToOptionProps
)(OptionBase)

export const Options = ({cellID, cellX, cellY, options}) => {
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