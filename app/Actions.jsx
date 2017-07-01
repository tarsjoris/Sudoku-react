import React from 'react'
import {connect} from 'react-redux'
import * as common from './common.jsx'


/* Action providers */

const createUndo = () => {
	return {
		type: common.GRID_ACTION_UNDO
	}
}

/* Components */

const ActionsBase = ({undo}) => {
	return <div className="actions"><button onClick={undo}>Undo</button></div>	
}
const mapDispatchToActionsProps = (dispatch, ownProps) => {
	return {
		undo: () => {
			dispatch(createUndo())
		}
	}
}
export const Actions = connect(
	null,
	mapDispatchToActionsProps
)(ActionsBase)