import { Dense, Conv2D, Layer, MaxPooling2D, Input, Output } from "./shapes/layer";
import { Draggable } from "./shapes/draggable";
import { Wire } from "./shapes/wire";
import { Shape } from "./shapes/shape";
import { Relu, Sigmoid, Softmax } from "./shapes/activation";
import { windowProperties } from "./window";
import { buildNetwork, train, buildNetworkDAG } from "../model/build_network";
import { mod } from "@tensorflow/tfjs";

document.addEventListener("DOMContentLoaded", function() { 
    // this function runs when the DOM is ready, i.e. when the document has been parsed
    var elmts = document.getElementsByClassName('option');
	for(let elmt of elmts){
		highlightOnMouseOver(elmt);
		dispatchCreationOnClick(elmt);
	}
	
	var elmts = document.getElementsByClassName('train');
	for(let elmt of elmts){
		trainOnHighlight(elmt);
		trainOnClick(elmt)
	}
    
    window.addEventListener('create', function( e ) {
		appendItem(e);
	});

	window.onkeyup = function(event){
		switch(event.key){
			case 'Escape' :
				if(windowProperties.selectedElement){
					windowProperties.selectedElement.unselect();
					windowProperties.selectedElement = null;
				}
				break;
			case 'Delete' :
				if(windowProperties.selectedElement){
					windowProperties.selectedElement.delete();
					windowProperties.selectedElement = null;
				}
				break;
			case 'Enter' :
				// graphToJson();
				train(buildNetwork(svgData.input))
				break;
		}
	};

	svgData.input = new Input();
	svgData.output = new Output();

    
});

function trainOnHighlight(elmt){
	elmt.addEventListener('mouseover',function(e){
		elmt.style.background = '#00008B'
	});
	elmt.addEventListener('mouseout',function(e){
		elmt.style.background = '#447344'
	});
}


function trainOnClick(elmt){
	elmt.addEventListener('click', async function(e){
		let trainingBox = document.getElementById('ti_training');
		trainingBox.children[1].innerHTML = 'Yes'
		elmt.innerHTML = "Training"
		// TODO: Change color during training
		// elmt.style.backgroundColor = '#900000'
		let model = buildNetworkDAG(svgData.output)
		console.log("Built Model... ")
		console.log(model)
		await train(model)
		elmt.innerHTML = "Train"
		trainingBox.children[1].innerHTML = 'No'
		// elmt.style.background = '#007400'
	});
}

function graphToJson() {
	// Initialize queues, dags, and parents (visited) 
	let queue: Layer[] = [svgData.input]
	let visited: Set<Layer> = new Set()
	let json: {}[] = []
	while (queue.length != 0) {
		let current = queue.shift()
		json.push(current.toJson())
		// check each connections of the node
		for (let child of current.children) {
			if (!visited.has(child)) {
				queue.push(child)
				visited.add(child)
			}
		}
	}
	console.log(json)
}

function highlightOnMouseOver(elmt){
	elmt.addEventListener('mouseover',function(e){
		elmt.style.backgroundColor = '#ccc'
	});
	elmt.addEventListener('mouseout',function(e){
		elmt.style.backgroundColor = 'transparent'
	});
}

function dispatchCreationOnClick(elmt){
	elmt.addEventListener('click', function(e){
        var itemType = elmt.parentElement.getAttribute('data-itemType')
        var detail = { itemType : itemType}
        detail[itemType + 'Type'] = elmt.getAttribute('data-'+itemType+'Type')
        var event = new CustomEvent('create', { detail : detail } );
		window.dispatchEvent(event);
	});
}

function appendItem(options){
	var item: Draggable
	switch(options.detail.itemType){
        case 'layer': switch(options.detail.layerType) {
			case "dense": item = new Dense(); console.log("Created Dense Layer"); break;
			case "conv2D": item = new Conv2D(); console.log("Created Conv2D Layer"); break;
			case "maxPooling2D": item = new MaxPooling2D(); console.log("Created MaxPooling2D Layer"); break;
		}
		case 'activation': switch(options.detail.activationType) {
			case 'relu': item = new Relu(); console.log("Created Relu"); break;
			case 'sigmoid': item = new Sigmoid(); console.log("Created Sigmoid"); break;
			case 'softmax': item = new Softmax(); console.log("Created Softmax"); break;
		}
	}
	svgData[options.detail.itemType].push(item);
	// item.index = svgData[options.detail.itemType].length-1;
}


// let svg;
// let height;
// let width;
let svgData = {
	layer : [],
	activation : [],
	wire : [],
	input: null,
	output: null
}


// function makeJSON(): string{
// 	return '['+svgData.layer.concat([svgData.input]).concat([svgData.output]).map(layer => JSON.stringify(layer.getJSON()))+']';
// }

// function toggleSelect(elmt){
// 	elmt.style.backgroundColor = '#ccc';
// 	// console.log(elmt.parentElement.children[0],elmt)
// 	if(elmt.parentElement.children[0] === elmt){
// 		elmt.parentElement.children[1].style.backgroundColor = 'transparent';
// 	} else {
// 		elmt.parentElement.children[0].style.backgroundColor = 'transparent';
// 	}
// 	switch(elmt.getAttribute('data-makemode')){
// 		case 'add': startAdding(); break;
// 		case 'connect': startWiring(); break;
// 	}
// }

// function bindOptionEvents(){
// 	var elmts = document.getElementsByClassName('option');
// 	for(let elmt of elmts){
// 		highlightOnMouseOver(elmt);
// 		dispatchCreationOnClick(elmt);
// 	}
// 	var elmts = document.getElementsByClassName('optionNC');
// 	for(let elmt of elmts){
// 		highlightOnMouseOver(elmt);
// 	}
// }

// function highlightOnMouseOver(elmt){
// 	elmt.addEventListener('mouseover',function(e){
// 		elmt.style.backgroundColor = '#ccc'
// 	});
// 	elmt.addEventListener('mouseout',function(e){
// 		elmt.style.backgroundColor = 'transparent'
// 	});
// }

// function dispatchCreationOnClick(elmt){
// 	elmt.addEventListener('click', function(e){
// 		var itemType = elmt.parentElement.getAttribute('data-itemType')
// 		var detail = { itemType : itemType}
// 		detail[itemType + 'Type'] = elmt.getAttribute('data-'+itemType+'Type')
// 		var event = new CustomEvent('create', { detail : detail } );
// 		window.dispatchEvent(event);
// 	});
// }

// function appendItem(options){
// 	switch(options.detail.itemType){
// 		case 'layer': let item = new Layer(options.detail); break;
// 		case 'activation': let item = new Activation(options.detail); break;
// 		case 'wire': let item = new Wire(options.detail); break;
// 		case 'input': let item = new Input(options.detail); break;
// 	}
// 	// console.log('ops',options);
// 	svgData[options.detail.itemType].push(item);
// 	// item.index = svgData[options.detail.itemType].length-1;
// 	item.id = (''+Math.random()).substring(2);
// }

// window.mmc = 0

// window.addEventListener('mousedown',function(e){window.mmc=0;})
// window.addEventListener('mouseup',function(e){window.mmc=0;})

// function allowDragging(){
// 	svg.on('mousemove', function(){
// 		window.mmc ++;
// 		if(window.mmc < 3){return;}
// 		if(window.selectState.split('+')[1] !== 'tracking'){return;}
// 		window.selectState = 'abouttounselect+tracking';
// 		let mouse = mousePosition();
// 		window.draggedElement.setPosition(mouse[0] + window.xClickOffset, mouse[1] + window.yClickOffset)
// 	})

// 	window.onkeyup = function(event){
// 		switch(event.key){
// 			case 'Escape' :
// 			if(window.selectedElement){
// 				unselect(window.selectedElement);
// 			}
// 			if(window.draggedElement){
// 				unbindFromMouse(window.draggedElement);
// 			};
// 			window.selectState = 'default'
// 			break;
// 			case 'Delete' :
// 			// case 'Backspace' :
// 			if(window.selectedElement){
// 				window.selectedElement.remove();
// 				window.selectedElement = false;
// 				window.draggedElement = false;
// 			}
// 			window.selectState = 'default';
// 			break;
// 		}
// 	};
// }

// function onresize(){
// 	// svgData.input.svgComponent.attr('y',height()/2-20);
// 	svgData.output.svgComponent.attr('transform','translate('+ (width()-40) +','+ height()/2 +')')
// }

// class Input{
// 	constructor(){
// 		this.svgComponent = svg.append('rect').attr('x',10).attr('height',40).attr('width',40).style('fill','#010180');
// 		this.outputs = [];
// 		this.connectors = [];
// 		this.layerType = 'input';
// 		this.id = 'IN';
// 	}
// 	setPosition(x,y){}
// 	getPosition(){return [parseFloat(this.svgComponent.attr('x')),parseFloat(this.svgComponent.attr('y'))]}
// 	moveToFront(){}
// 	snap(){}
// 	getJSON(){
// 		return {
// 			"layer_name": "Input",
// 			"children_ids": this.outputs.map(layer => layer.id),
// 			"parent_ids": [],
// 			"params": {},
// 			"id": this.id
// 	    };
// 	}
// }

// class Output{
// 	constructor(){
// 		this.svgComponent = svg.append('g');
// 		this.svgComponent.append('circle').attr('cx',0).attr('cy',-60).attr('r',10).style('fill','#010180');
// 		this.svgComponent.append('circle').attr('cx',0).attr('cy',-20).attr('r',10).style('fill','#010180');
// 		this.svgComponent.append('circle').attr('cx',0).attr('cy',+20).attr('r',10).style('fill','#010180');
// 		this.svgComponent.append('circle').attr('cx',0).attr('cy',+60).attr('r',10).style('fill','#010180');
// 		this.inputs = [];
// 		this.connectors = [];
// 		this.layerType = 'output';
// 		this.id = 'OUT';

// 		this.units = 4

// 		this.htmlComponent = createParamBox(this.layerType);

// 		this.htmlComponent.children[1]
// 	}
// 	updateNumberOfUnits(n){
// 		if(this.units == n){
// 			return;
// 		}
// 		this.units = n;
// 		this.svgComponent.remove();
// 		this.svgComponent = svg.append('g');
// 		if(this.units > 10){
// 			this.svgComponent.append('ellipse')
// 			    .attr('cx', 0)  
// 			    .attr('cy', 0) 
// 			    .attr('rx', 10)
// 			    .attr('ry', 100)
// 			    .style('fill', '#010180');
// 		} else {
// 			for(let pos of [...(new Array(this.units)).keys()].map(x => 120/(this.units-1)*x-60)){
// 				this.svgComponent.append('circle').attr('cx',0).attr('cy',pos).attr('r',50/this.units).style('fill','#010180');			
// 			}
// 		}
// 		unselect(this);
// 		makeDraggable(this);
// 		onresize();
// 	}
// 	setPosition(x,y){}

// 	getPosition(){
// 		let transformation = this.svgComponent.attr('transform')
// 		return transformation.substring( transformation.indexOf('(') + 1 , transformation.indexOf(')') ).split(',').map(value => parseInt(value));
// 	}
// 	getJSON(){
// 		return {
// 	        "layer_name": "Output",
// 	        "children_ids": [],
// 	        "parent_ids": this.inputs.map(layer => layer.id),
// 	        "params": {
// 	            "units": 10,
// 	            "activation": "softmax"
// 	        },
// 	        "id": this.id
// 	    };
// 	}

// 	moveToFront(){}
// 	snap(){}
// }

// function createSkeleton(){
// 	svgData.input = new Input();
// 	svgData.input.svgComponent.attr('y',height()/2-20);
// 	svgData.output = new Output();
// 	makeDraggable(svgData.input);
// 	makeDraggable(svgData.output);
// 	onresize();
// }

// var paramtruck;
// var ti = {}
// var tims;
// var defaultparambox;
// var thecoolestfilter;

// function setup(){
// 	bindOptionEvents();
// 	svg = d3.select('svg');

// 	paramtruck = document.getElementById('paramtruck');

// 	ti.acc = document.getElementById('ti_acc');
// 	ti.val_acc = document.getElementById('ti_vacc');
// 	ti.loss = document.getElementById('ti_loss');
// 	ti.val_loss = document.getElementById('ti_vloss');
// 	tims = document.getElementById('ti_status');
// 	defaultparambox = document.getElementById('defaultparambox');

// 	allowDragging();
// 	window.addEventListener('create', function( e ) {
// 		appendItem(e);
// 	});
// 	window.addEventListener('resize',onresize);

// 	// TODO: Load training info
// }

// function populate(){
// 	createSkeleton();
// }