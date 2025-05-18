import * as fs from 'fs/promises';
import * as path from 'path';

interface IndexEntry {
  url: string;
  title: string;
  content: string;
  keywords: string[];
  chapterNumber: number;
  extractedData?: any;
}

interface GraphNode {
  id: string;
  label: string;
  group: number;
}

interface GraphLink {
  source: string;
  target: string;
  value: number;
}

interface Graph {
  nodes: GraphNode[];
  links: GraphLink[];
}

async function createVisualization() {
  try {
    // Load search index
    const indexData = await fs.readFile('./data/search_index.json', 'utf-8');
    const index: IndexEntry[] = JSON.parse(indexData);
    
    // Create graph structure
    const graph: Graph = {
      nodes: [],
      links: [],
    };
    
    // Map of URL to hostname
    const urlToHostname = new Map<string, string>();
    
    // Create nodes for each page
    index.forEach(entry => {
      const url = new URL(entry.url);
      const hostname = url.hostname;
      const id = entry.url;
      
      urlToHostname.set(id, hostname);
      
      graph.nodes.push({
        id,
        label: entry.title || url.pathname,
        group: entry.chapterNumber,
      });
    });
    
    // Create connections between pages on the same hostname
    for (let i = 0; i < index.length; i++) {
      const source = index[i].url;
      const sourceHostname = urlToHostname.get(source);
      
      for (let j = i + 1; j < index.length; j++) {
        const target = index[j].url;
        const targetHostname = urlToHostname.get(target);
        
        // Connect pages from the same chapter
        if (sourceHostname === targetHostname) {
          graph.links.push({
            source,
            target,
            value: 1,
          });
        }
      }
    }
    
    // Create HTML visualization
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Housefly MetaScraper Visualization</title>
      <style>
        body { margin: 0; font-family: sans-serif; }
        .links line { stroke: #999; stroke-opacity: 0.6; }
        .nodes circle { stroke: #fff; stroke-width: 1.5px; }
        #info { 
          position: absolute; 
          top: 10px; 
          left: 10px; 
          background: white; 
          padding: 10px; 
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        #tooltip {
          position: absolute;
          background: white;
          padding: 5px;
          border-radius: 3px;
          pointer-events: none;
          box-shadow: 0 0 5px rgba(0,0,0,0.1);
          display: none;
        }
      </style>
    </head>
    <body>
      <div id="info">
        <h3>Housefly MetaScraper Visualization</h3>
        <p>Network of crawled pages across chapters</p>
        <ul>
          <li><strong>Nodes:</strong> ${graph.nodes.length} pages</li>
          <li><strong>Links:</strong> ${graph.links.length} connections</li>
          <li><strong>Chapters:</strong> ${new Set(graph.nodes.map(n => n.group)).size}</li>
        </ul>
        <p>Hover over nodes to see details.</p>
      </div>
      <div id="tooltip"></div>
      <svg width="960" height="600"></svg>
      <script src="https://d3js.org/d3.v4.min.js"></script>
      <script>
        // Graph data
        const graph = ${JSON.stringify(graph)}
        
        const svg = d3.select("svg"),
              width = +svg.attr("width"),
              height = +svg.attr("height"),
              tooltip = d3.select("#tooltip");
        
        // Color scale for chapters
        const color = d3.scaleOrdinal(d3.schemeCategory20);
        
        // Force simulation
        const simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-100))
            .force("center", d3.forceCenter(width / 2, height / 2));
        
        // Create links
        const link = svg.append("g")
            .attr("class", "links")
          .selectAll("line")
          .data(graph.links)
          .enter().append("line")
            .attr("stroke-width", d => Math.sqrt(d.value));
        
        // Create nodes
        const node = svg.append("g")
            .attr("class", "nodes")
          .selectAll("circle")
          .data(graph.nodes)
          .enter().append("circle")
            .attr("r", 8)
            .attr("fill", d => color(d.group))
            .on("mouseover", showTooltip)
            .on("mouseout", hideTooltip)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
        
        // Add node titles for tooltips
        function showTooltip(d) {
          tooltip.style("display", "block")
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY + 10) + "px")
            .html(`<strong>${d.label}</strong><br>Chapter ${d.group}<br><small>${d.id}</small>`);
        }
        
        function hideTooltip() {
          tooltip.style("display", "none");
        }
        
        // Setup force simulation
        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);
        
        simulation.force("link")
            .links(graph.links);
        
        // Update positions on tick
        function ticked() {
          link
              .attr("x1", d => d.source.x)
              .attr("y1", d => d.source.y)
              .attr("x2", d => d.target.x)
              .attr("y2", d => d.target.y);
        
          node
              .attr("cx", d => d.x = Math.max(10, Math.min(width - 10, d.x)))
              .attr("cy", d => d.y = Math.max(10, Math.min(height - 10, d.y)));
        }
        
        // Drag functions for interactivity
        function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }
        
        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }
        
        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }
      </script>
    </body>
    </html>
    `;
    
    // Create data directory if it doesn't exist
    await fs.mkdir('./data', { recursive: true });
    
    // Save visualization
    await fs.writeFile('./data/visualization.html', html);
    
    console.log('Visualization created at ./data/visualization.html');
  } catch (error) {
    console.error('Error creating visualization:', error);
    console.log('\nRun "npm start -- crawl" first to build the search index.');
  }
}

createVisualization().catch(error => console.error('Error:', error));