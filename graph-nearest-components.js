const graph = {vertices_coords:[[0,0],[1,0],[1,1],[0,1],[0.5,0.5],[0.5,0.792893],[0.207106,0.5],[0.5,0.207106],[0.792893,0.5],[0.665910,0.5],[0.716772,0.576120],[0.865619,0.675576],[0.5,0.334089],[0.423879,0.283227],[0.324423,0.134380],[0.5,0.665910],[0.576120,0.716772],[0.675576,0.865619],[0.334089,0.5],[0.283227,0.423879],[0.134380,0.324423],[0.5,1],[0.5,0],[0.476712,0.905175],[0.523287,0.094824],[0.461939,0.808658],[0.404137,0.729963],[0.353553,0.646446],[0.270036,0.595862],[0.191341,0.538060],[0.094824,0.523287],[0,0.5],[0.538060,0.191341],[0.595862,0.270036],[0.646446,0.353553],[0.729963,0.404137],[0.808658,0.461939],[0.905175,0.476712],[1,0.5],[0.373017,0.207106],[0.207106,0.373017],[0.180807,0.436508],[0.117316,0.410209],[0,0.410209],[0.436508,0.180807],[0.410209,0.117316],[0.410209,0],[0.180807,1],[0.150809,0.970002],[0.167044,0.930807],[0.127850,0.914573],[0.127850,0.872149],[0.085426,0.872149],[0.069192,0.832955],[0.029997,0.849190],[0,0.819192]],faces_vertices:[[8,11,10],[11,8,36,37],[9,8,10],[8,9,35,36],[9,10,16,15,4],[10,11,2,17,16],[12,13,7],[13,12,4,18,19],[12,7,32,33],[4,12,33,34],[5,17,23,25],[17,5,16],[4,15,26,27],[15,16,5],[0,20,42,43],[20,0,14,39,40],[6,18,28,29],[18,6,19],[22,1,24],[14,0,46,45],[2,21,23,17],[23,21,47,48],[18,4,27,28],[22,24,45,46],[24,1,32],[9,4,34,35],[27,26,50,51],[28,27,51,52],[29,28,52,53],[30,31,43,42],[31,30,54,55],[6,29,30,42,41],[26,15,5,25],[24,32,7,44,45],[33,32,1],[34,33,1],[35,34,1],[36,35,1],[37,36,1],[37,38,2,11],[38,37,1],[7,13,39,44],[39,14,44],[39,13,19,40],[20,40,41],[40,19,6,41],[41,42,20],[44,14,45],[25,23,48,49],[26,25,49,50],[47,3,48],[30,29,53,54],[50,49,3],[51,50,3],[52,51,3],[53,52,3],[54,53,3],[55,54,3],[3,49,48]],edges_vertices:[[8,11],[9,8],[9,10],[10,11],[10,8],[12,13],[7,12],[12,4],[5,17],[4,15],[15,16],[0,20],[6,18],[18,19],[22,1],[0,14],[21,2],[21,23],[18,4],[22,24],[24,1],[4,9],[16,10],[26,27],[27,28],[28,29],[30,31],[29,6],[28,18],[27,4],[26,15],[25,5],[24,32],[32,33],[33,34],[34,35],[35,36],[36,37],[37,38],[1,38],[8,36],[36,1],[11,37],[37,1],[9,35],[35,1],[7,32],[32,1],[12,33],[33,1],[4,34],[34,1],[13,7],[14,39],[39,13],[19,13],[20,40],[40,19],[6,19],[40,39],[40,41],[41,42],[20,41],[41,6],[30,42],[42,20],[42,43],[0,43],[43,31],[0,46],[46,22],[39,44],[14,44],[44,7],[45,46],[44,45],[14,45],[45,24],[38,2],[23,25],[17,23],[2,17],[2,11],[25,26],[5,15],[16,5],[17,16],[3,47],[47,21],[30,29],[23,48],[49,50],[50,51],[51,52],[52,53],[53,54],[54,55],[31,55],[55,3],[3,54],[54,30],[3,49],[49,25],[3,53],[53,29],[3,52],[52,28],[3,51],[51,27],[3,50],[50,26],[47,48],[48,49],[3,48]],edges_assignment:["M","M","V","M","V","V","M","M","M","M","V","M","M","V","B","M","B","M","M","M","V","M","V","V","V","M","M","M","M","V","M","M","V","M","V","V","M","V","M","B","M","M","V","V","M","M","M","M","M","M","V","M","V","M","M","V","M","M","V","M","V","M","M","M","V","V","V","B","B","B","B","V","M","M","V","M","V","V","B","V","V","M","M","M","M","V","M","B","B","V","V","V","M","M","V","M","V","B","B","V","V","M","M","M","M","M","M","V","M","M","M","V","M","V"]};

svg.load(ear.svg(graph, {
  vertices: true,
  attributes: {
    circle: { r: 0.02 },
    vertices: { fill: "none", stroke: "none" },
    edges: {
      mountain: { stroke: "#158" },
      valley: { stroke: "#e53" },
    },
  }
}));
svg.size(-0.03, -0.03, 1.06, 1.06);
svg.strokeWidth(0.015);
const edges = svg.querySelector(".edges");
edges.remove();
svg.appendChild(edges);
const edgeLayer = svg.g();
const vertices = svg.querySelector(".vertices");
vertices.remove();
svg.appendChild(vertices);

svg.onMove = (e) => {
  const vertex = ear.graph.nearest_vertex(graph, [e.x, e.y]);
  const edge = ear.graph.nearest_edge(graph, [e.x, e.y]);
  const face = ear.graph.nearest_face(graph, [e.x, e.y]);
  svg.querySelector(".vertices").childNodes
    .forEach(vertex => vertex.fill("none").stroke("none"));
  svg.querySelector(".faces").childNodes
    .forEach(face => face.fill("none"));
  edgeLayer.removeChildren();
  if (vertex !== undefined) {
    svg.querySelector(".vertices").childNodes[vertex].stroke("#158").fill("#fb4");
  }
  if (edge !== undefined) {
    edgeLayer.line(graph.edges_vertices[edge].map(v => graph.vertices_coords[v]))
      .stroke("#fb4");
  }
  if (face !== undefined) {
    svg.querySelector(".faces").childNodes[face].fill("#fb4");
  }
};