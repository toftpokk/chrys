<!-- use bottom one https://www.d3indepth.com/force-layout/ -->
<script lang="ts">
	import { onMount, tick } from 'svelte';
	import * as d3 from 'd3';
	import type { ScaleLinear, SimulationNodeDatum } from 'd3';

	let vis : HTMLDivElement; // binding with div for visualization

	export let data: {
            nodes: {name: string, id: number, x?: number, y?: number}[],
            links: {source: number, target: number}[],
        }

	let xScale = d3.scaleLinear().domain([0, 10]);
	let yScale = d3.scaleLinear().domain([0, 10]);
	let width: number;
	let height: number;
	const margin = {
		top: 20,
		right: 20,
		bottom: 30,
		left: 30
	};
	
	onMount(() => {
		redraw();
		window.addEventListener('resize', redraw);
	})

	function redraw(): void {
		console.log("RD")
		// empty vis div
		d3.select(vis).html(null); 

		const node =  d3.select(vis).node()
		if(!node){
			return
		}

		// determine width & height of parent element and subtract the margin
		width = node.getBoundingClientRect().width - margin.left - margin.right;
		height = node.getBoundingClientRect().height - margin.top - margin.bottom;

		// init scales according to new width & height
		xScale.range([0, width]);
		yScale.range([height, 0]);

		// create svg and create a group inside that is moved by means of margin
		const svg = d3.select(vis)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.attr('transform', `translate(${[margin.left, margin.top]})`)			
		svg.append('g').attr("class", "links")
		svg.append('g').attr("class","nodes")
		svg.append("svg:defs").append("svg:marker")
			.attr("id", "arrow")
			.attr("viewBox", "0 -5 10 10")
			.attr('refX', -20)//so that it comes towards the center.
			.attr("markerWidth", 5)
			.attr("markerHeight", 5)
			.attr("orient", "auto")
		.append("svg:path")
			.attr("d", "M0,-5L10,0L0,5");

		const updateNodes = ()=>{
			let u = d3.select('.nodes')
				.selectAll('text')
				.data(data.nodes)
				.join('text')
				.text(function(d) {
					return d.id
				})
				.attr('x', function(d) {
					return d.x
				})
				.attr('y', function(d) {
					return d.y
				})
				.attr('dy', function(d) {
					return 5
				})
				.attr('font-size','small')
		}
		const updateLinks = ()=>{
			var u = d3.select('.links')
				.selectAll('line')
				.data(data.links)
				.join('line')
				.attr('x1', function(d) {
					return d.source.x
				})
				.attr('y1', function(d) {
					return d.source.y
				})
				.attr('x2', function(d) {
					return d.target.x
				})
				.attr('y2', function(d) {
					return d.target.y
				})
				.attr('stroke',"#000")
				.attr('marker-start', (d) => "url(#arrow)")
		}

		const ticked = ()=>{
			updateLinks()
			updateNodes()
		}
		const simulation = d3.forceSimulation(data.nodes)
			.force('charge', d3.forceManyBody().strength(-5))
			.force('center', d3.forceCenter(width / 2, height / 2))
			.force('link', d3.forceLink(data.links).id((n)=>n.id))
			.on('tick',ticked)
	}	
</script>

<main class="text-black">
	<div id="vis" class="bg-red-100" bind:this={vis}></div>
</main>

<style>
	main {
		height: 100%;
		display: flex;
	}
	
	#vis {
		width: 100%;
		height: 100%;
		background-color: whitesmoke;
	}
</style>