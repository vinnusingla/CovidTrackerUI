import React from 'react';
import ReactDOM from 'react-dom';
import {get_data} from './backend.js'
import {CanvasJSChart} from 'canvasjs-react-charts'


const transformDataToStackedGraph = (dataArray) => {
	dataArray.sort(function(a, b) {
	  let keyA = Number(a['new_positive']);
	  let keyB = Number(b['new_positive']);
	  if (keyA < keyB) return -1;
	  if (keyA > keyB) return 1;
	  return 0;
	});

	let resultArray = [
		{
			type: "stackedBar",
			name: "Cured",
			showInLegend: true,
			yValueFormatString: "###,###",
			dataPoints: []
		},
		{
			type: "stackedBar",
			name: "Active",
			showInLegend: true,
			yValueFormatString: "###,###",
			dataPoints: []
		},
		{
			type: "stackedBar",
			name: "Deaths",
			showInLegend: true,
			yValueFormatString: "###,###",
			dataPoints: []
		}
	];
	for (let i=0; i < dataArray.length; i++){
		resultArray[0].dataPoints.push({
			label: (dataArray[i]['state_name'] == "") ? "India" : dataArray[i]['state_name'],
			y: Number(dataArray[i]['new_cured'])
		})
		resultArray[1].dataPoints.push({
			label: (dataArray[i]['state_name'] == "") ? "India" : dataArray[i]['state_name'],
			y: Number(dataArray[i]['new_active'])
		})
		resultArray[2].dataPoints.push({
			label: (dataArray[i]['state_name'] == "") ? "India" : dataArray[i]['state_name'],
			y: Number(dataArray[i]['new_death'])
		})
	}
	return resultArray;
}

export default class Visual3 extends React.Component{
	constructor(props) {
		super(props);
		this.toggleDataSeries = this.toggleDataSeries.bind(this);
		this.state = {
			animationEnabled: true,
			exportEnabled: true,
			title: {
				text: "COVID cases by State/UT",
				fontFamily: "verdana"
			},
			axisY: {
				title: "No of cases",
				includeZero: true
			},
			toolTip: {
				shared: true,
				reversed: true
			},
			legend: {
				verticalAlign: "center",
				horizontalAlign: "right",
				reversed: true,
				cursor: "pointer",
				itemclick: this.toggleDataSeries
			},
			data: null
		};
		this.tick();
	}

	componentDidMount() {
		this.timerID = setInterval(
		  () => this.tick(),
		  120000
		);
	}

	componentWillUnmount() {
		clearInterval(this.timerID);
	}

	tick() {
		get_data((data) => {
			this.setState({
				data: transformDataToStackedGraph(data)
			});
		});
	}

	toggleDataSeries(e) {
		if(typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		}
		else {
			e.dataSeries.visible = true;
		}
		this.chart.render();
	}

	render() {
		let x;
		if (this.state.data == null){
			x = <h2>'Loading data ...'</h2>;
		}
		else {
			x = <div>
					<CanvasJSChart options = {this.state}
						onRef={ref => this.chart = ref}
					/>
				</div>
		}
		return (
			<div>
				{x}
			</div>
		);
	}
}
