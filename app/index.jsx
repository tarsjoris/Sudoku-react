import React from 'react';
import {render} from 'react-dom';

let UNKNOWN = -1

let outline =
"........." +
"2.7...4.6" +
"..36.85.." +
".723.416." +
".5.1.9.2." +
".842.579." +
"..98.26.." +
"7.8...9.1" +
".........";

class Option extends React.Component {
	constructor(props) {
    	super(props);
    	this.state = {options: props.options, option: props.option};
		this.toggle = this.toggle.bind(this);
	}

	render() {
		var classes = 'options-cell';
		if (!this.props.options.includes(this.props.option)) {
			classes += ' hide';
		}
		return <div className={classes} onClick={this.toggle}><span className="options-content">{this.props.option}</span></div>;
	}

	toggle() {
		this.setState(prevState => {
			if (prevState.options.includes(prevState.option)) {
				prevState.options.splice(prevState.options.indexOf(prevState.option), 1);
			} else {
				prevState.options.push(prevState.option);
			}
			return prevState;
		});
	}
}

class Options extends React.Component {
	render() {
		var cellID = this.props.cellID;
		var options = this.props.options;
		var rows = [];
		for (var y = 0; y < 3; ++y) {
			var cells = [];
			for (var x = 0; x < 3; ++x) {
				var index = y * 3 + x;
				var key = cellID + '-option-' + index;
				var option = index + 1;
				cells.push(<Option key={key} options={options} option={option}/>);
			}
			rows.push(<div key={cellID + '-options-row-' + y} className="options-row">{cells}</div>);
		}
		return <div className="options">
			{rows}
		</div>;
	}
}

class Cell extends React.Component {
	render() {
		var cell = this.props.cell;
		var values = cell.values;
		var classes = 'cell';
		switch (cell.x % 3) {
			case 0:
				classes += ' hor-first';
				break;
			case 2:
				classes += ' hor-last';
				break;
		}
		switch (cell.y % 3) {
			case 0:
				classes += ' ver-first';
				break;
			case 2:
				classes += ' ver-last';
				break;
		}
		if (cell.fixed) {
			classes += ' fixed';
		}
		if (values.length === 1) {
			classes += ' final';
			return <div className={classes}>
				<span className="cell-content">{values[0]}</span>
			</div>;
		} else {
			return <div className={classes}>
				<Options key={cell.id + 'options'} cellID={cell.id} options={cell.values} />
			</div>;
		}
	}
}

class Row extends React.Component {
	render() {
		return <div className="row">
			{this.props.row.cells.map(cell => <Cell key={cell.id} cell={cell}/>)}
		</div>;
	}
}

class Grid extends React.Component {
	render() {
		return <div className="grid">
				{this.props.grid.rows.map(row => <Row key={row.id} row={row}/>)}
		</div>;
	}
}

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			grid: {
				rows: []
			}
		};
	}

	componentDidMount() {
		this.setState(this.parseOutline(outline));
	}

	render () {
		return <div>
			<div className="title"><h1>Sudoku</h1></div>
			<Grid grid={this.state.grid}/>
		</div>;
	}

	parseOutline(outline) {
		var rows = [];
		for (var y = 0; y < 9; ++y) {
			var cells = [];
			for (var x = 0; x < 9; ++x) {
				var index = y * 9 + x;
				var ch = outline.charAt(index);
				var fixed = ch !== '.';
				cells.push({
					id: 'cell-' + index,
					x: x,
					y: y,
					fixed: fixed,
					values: fixed ? [ch - '0'] : [1, 2, 3, 4, 5, 6, 7, 8, 9]
				});
			}
			rows.push({
				id: 'row-' + y,
				cells: cells
			});
		}
		return {
			grid: {
				rows: rows
			}
		};
	}
}

render(<App/>, document.getElementById('app'));