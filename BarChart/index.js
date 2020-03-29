const svg = d3.select('svg')
const width = +svg.attr('width')
const height = +svg.attr('height')

const renderBarChart = data => {
    data.length = 10
    const margin = {
        left: 200,
        right: 20,
        top: 60,
        bottom: 100
    }

    const xValue = d => d.cases
    const yValue = d => d.state
    
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)


    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, xValue) + 20])
        .range([0, innerWidth])

    const yScale = d3.scaleBand()
        .domain(data.map(yValue))
        .range([0,innerHeight])
        .padding(0.1)

    g.append('g')
        .call(d3.axisLeft(yScale))
        .selectAll('.domain, .tick line')
            .remove()

    const xAxis = d3.axisBottom(xScale)
                    .tickSize(-innerHeight)
    
    g.append('g').call(xAxis)
        .attr('transform', `translate(0,${innerHeight})`)
        .selectAll('.domain')
            .remove()

    g.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .transition()
            .duration(1200)
            .attr('width', d => xScale(xValue(d)))
            .attr('height', yScale.bandwidth())
            .attr('y', d => yScale(yValue(d)))
            .attr('fill','steelblue')
            .attr('rx', 5)

    data.forEach(d => {
        g.append('text')
            .text(xValue(d))
            .attr('x', xScale(xValue(d)) - 30)
            .attr('y', yScale(yValue(d)) + (yScale.bandwidth()/2) + 5)
            .classed('data-label', true)    
    })

    g.append('text')
        .classed('title', true)
        .attr('y', -10)
        .text('Top 10 Most Affetcted Coronavirus States In India (23rd Mar 2020 17:50:23)')

    g.append('text')
        .attr('y', innerHeight + 40)
        .attr('x', innerWidth/2 - 80)
        .classed('axis-label', true)
        .text('Number of people affected')
}

d3.csv('coronastatewisedata.csv', (data)=>{
    data.forEach(d=>{
        d.cases = +d.cases
    })
    renderBarChart(data)
})