svg.size(3, 1)
  .padding(0.05)
  .strokeWidth(0.005);

const bottomLayer = svg.g();
const cpLayer = svg.g();
const matrixLayer = svg.g();
const indicatorLayer = svg.g();
const foldedLayer = svg.g()
  .rotate(180)
  .translate(-2.2, -0.75);

const colors = {
  true: "#fb4",
  false: "white",
  0: "#fb4",
  1: "#e74",
  "-1": "#158",
};

const draw_matrix = (matrix) => {
  const group = svg.g();
  const num_faces = matrix.length;
  const rect_w = 1 / num_faces;
  group.rect(1, 1).stroke("black").fill("white");
  matrix.map((row, i) => row.map((_, j) => group
    .rect(i/num_faces, j/num_faces, rect_w, rect_w)
    .stroke("none")
    .fill(colors[matrix[i][j]])));
  return group;
};

const update = (cp, matrix, facePolys, point) => {
  bottomLayer.removeChildren();
  indicatorLayer.removeChildren();
  facePolys.forEach(face => face.fill("#e53").opacity(0.0));

  const near = cp.nearest(point);
  if (near.face === undefined) { return; }

  // highlight faces on cp
  matrix[near.face]
    .map((value, i) => bottomLayer
      .polygon(cp.faces_vertices[i]
        .map(v => cp.vertices_coords[v]))
      .fill(colors[value]));
  bottomLayer
    .polygon(cp.faces_vertices[near.face]
      .map(v => cp.vertices_coords[v]))
    .fill("#38c");

  // highlight faces on the folded origami
  facePolys
    .filter((_, i) => matrix[near.face][i])
    .forEach(face => face.opacity(0.15));
  // the blue face
  facePolys[near.face].remove();
  facePolys[near.face]
    .opacity(1)
    .fill("#38c")
    .appendTo(foldedLayer);

  // grid indicator
  const num_faces = cp.faces_vertices.length;
  const w = 1 / num_faces;
  indicatorLayer.rect(-w / 2, near.face / num_faces - (w / 2), 1 + w, w * 2)
    .translate(2, 0)
    .fill("none")
    .stroke("black")
    .strokeWidth(w);
};

const load = (FOLD) => {
  cpLayer.removeChildren();
  matrixLayer.removeChildren();
  foldedLayer.removeChildren();

  const cp = ear.origami(FOLD);
  const folded = cp.flatFolded(1);
  
  // 1. all solutions,
  // const all_conditions = ear.layer.all_layer_conditions(folded);
  // 2. or, one solution only.
  const all_conditions = [ear.layer.one_layer_conditions(folded)];
  // 3. or, with a dividing axis, all solutions
  // const all_conditions = ear.layer.all_layer_conditions_with_axis(folded, cp, ear.line([1, -1], [0, 1]));
  // 4. or, a dividing axis, one solution only.
  // const all_conditions = [ear.layer.one_layer_conditions_with_axis(folded, cp, ear.line([1, -1], [0, 1]))];

  // const conditions = all_conditions.certain;
  const conditions = all_conditions[0];
  const layers_face = ear.layer.topological_order(conditions, cp);
  // console.log(all_conditions.length, "all_conditions", all_conditions);

  // make some matrices for vizualization only
  const flip = { 1:-1, "-1":1, 0:0};
  const conditions_matrix = folded.faces_vertices.map(() => []);
  Object.keys(conditions)
    .forEach(key => {
      const pair = key.split(" ");
      conditions_matrix[pair[0]][pair[1]] = conditions[key];
      conditions_matrix[pair[1]][pair[0]] = flip[conditions[key]];
    });

  // draw things
  folded.faces_layer = ear.graph.invert_map(layers_face.slice().reverse());
  foldedLayer.origami(folded, false);
  delete folded.faces_layer;
  const facePolys = folded.faces_vertices
    .map(vertices => vertices
      .map(v => folded.vertices_coords[v]))
    .map(face => foldedLayer.polygon(face).fill("#e53").opacity(0));

  cpLayer.origami(cp, {
    faces: { fill: "none" },
    boundaries: { fill: "none" },
    edges: {
      mountain: { stroke: "#e53" },
      valley: { stroke: "#38c" },
    }
  });

  draw_matrix(conditions_matrix)
    .translate(2, 0)
    .appendTo(matrixLayer);

  svg.onMove = (e) => update(cp, conditions_matrix, facePolys, e);
  // update(cp, conditions_matrix, facePolys, [0.3, 0.69]);
};

load({"vertices_coords":[[0.6213203435596424,0.3786796564403576],[0.6642135623730948,0.3357864376269052],[0.585786437626905,0.17157287525381015],[0.5606601717798212,0.2322330470336318],[0.7677669529663687,0.4393398282201788],[0.8284271247461901,0.4142135623730951],[0.3964466094067261,0.75],[0.5,0.7928932188134525],[0.20710678118654763,0.5],[0.25,0.6035533905932737],[0.46966991411008924,0.7196699141100894],[0.28033008588991065,0.5303300858899106],[0.3232233047033631,0.6767766952966369],[0.5428932188134522,0.18933982822017908],[0.8106601717798212,0.45710678118654763],[0.5606601717798213,0.5251262658470837],[0.4748737341529164,0.4393398282201788],[0.7071067811865475,0.585786437626905],[0.35355339059327373,0.3535533905932738],[0.41421356237309515,0.29289321881345265],[0.6464466094067263,0.6464466094067263],[0.5,0.20710678118654782],[0.7928932188134523,0.5],[0.9497474683058329,0.4142135623730951],[0.9142135623730951,0.5],[0.5,0.08578643762690596],[0.5857864376269046,0.05025253169416813],[0.5857864376269051,0.7928932188134524],[0.5732233047033631,0.8232233047033632],[0.1767766952966373,0.4267766952966368],[0.20710678118654824,0.4142135623730948],[0.18933982822017842,0.6642135623730953],[0.33578643762690497,0.8106601717798212],[0.21966991411008926,0.7803300858899107],[0.25,0.75],[0.7677669529663683,0.3180194846605366],[0.7071067811865471,0.2928932188134529],[0.7248737341529159,0.2751262658470841],[0.7426406871192842,0.2573593128807158],[0.6819805153394638,0.2322330470336318],[0.7071067811865476,0.17157287525381035],[0.7677669529663682,0.19669914110089393],[0.8033008588991063,0.2322330470336318],[0.8284271247461902,0.29289321881345215],[1,0.08578643762690596],[1,0.12132034355964265],[0.8284271247461898,0.17157287525381013],[0.8535533905932733,0.1464466094067267],[0.914213562373095,0.08578643762690495],[0.9571067811865472,0.042893218813452726],[1,0],[0.8786796564403576,0],[0.914213562373095,0],[0,0],[0.0857864376269059,0.08578643762690592],[0.1464466094067272,0.1464466094067272],[0.20710678118654777,0.20710678118654777],[0.7928932188134525,0.7928932188134525],[0.8535533905932736,0.8535533905932736],[0.9142135623730949,0.9142135623730949],[1,1],[0.6464466094067263,0.8535533905932738],[0.14644660940672682,0.3535533905932733],[0.6464466094067263,0.9393398282201788],[0.06066017177982191,0.3535533905932726],[0.9142135623730953,1],[1,0.6213203435596424],[1,0.6568542494923801],[1,0.7071067811865479],[0.9571067811865475,0.6035533905932735],[0.9748737341529163,0.6464466094067262],[0.2928932188134552,0],[0.3535533905932759,0.02512626584708406],[0.39644660940672793,0.042893218813453135],[0.34314575050762175,0],[0.37867965644035884,0],[0.35355339059327384,0.8535533905932737],[0.43933982822017864,0.8535533905932737],[0.14644660940672638,0.5606601717798214],[0.1464466094067262,0.6464466094067266],[0,0.08578643762690602],[0.41421356237309503,0.585786437626905],[0.5,1],[0.2928932188134527,0.9142135623730954],[0.35355339059327384,0.9393398282201789],[0.06066017177982158,0.6464466094067266],[0.08578643762690544,0.7071067811865481],[0,0.7071067811865483],[0,0.9142135623730949],[0,1],[0.08578643762690635,1],[0.2928932188134529,1],[0.060660171779822046,0.11091270347398977],[0.8890872965260113,0.9393398282201787],[0.20710678118654902,0.08578643762690574],[0.914213562373095,0.7928932188134525],[0,0.2071067811865489],[0.7928932188134523,1],[0,0.5],[0.17677669529663698,0.5732233047033632],[0.4267766952966368,0.8232233047033631],[0.6715728752538102,0.08578643762690598],[0.7071067811865476,0.1213203435596432],[0.8786796564403578,0.29289321881345265],[0.9142135623730951,0.3284271247461898],[0.9142135623730951,0.25735931288071534],[0.742640687119285,0.08578643762690578],[0.8890872965260112,0.1464466094067267],[0.8786796564403574,0.17157287525381004],[0.8284271247461898,0.12132034355964286],[0.8535533905932736,0.1109127034739888],[0.9748737341529158,0.060660171779821456],[0.9393398282201786,0.025126265847083884],[0.914213562373095,0.17157287525381015],[0.8284271247461901,0.08578643762690537],[0.8890872965260115,0.025126265847083645],[0.9748737341529169,0.2322330470336335],[1,0.2928932188134539],[0.7071067811865477,0],[0.7677669529663695,0.02512626584708387],[0.9748737341529169,0.11091270347398889],[0.9748737341529164,0.1464466094067267],[0.8535533905932736,0.025126265847083055],[0.7071067811865476,0.08578643762690588],[0.9142135623730951,0.29289321881345304],[0.6066017177982129,0],[1,0.3933982822017873],[0.20710678118654743,0.7071067811865477],[0.2928932188134524,0.7928932188134524],[0.2928932188134526,0.8535533905932735],[0.14644660940672585,0.7071067811865479]],"edges_vertices":[[0,1],[2,3],[4,5],[6,7],[8,9],[6,10],[11,9],[12,6],[13,3],[4,14],[0,15],[16,0],[1,4],[0,4],[15,17],[18,19],[20,17],[19,21],[17,22],[21,3],[4,22],[9,12],[5,14],[14,22],[21,13],[13,2],[23,24],[25,26],[27,28],[29,30],[31,9],[32,6],[33,34],[15,4],[35,4],[1,36],[36,37],[37,38],[3,39],[40,41],[42,43],[44,45],[46,47],[48,49],[49,50],[51,52],[53,54],[55,56],[57,58],[59,60],[61,57],[56,62],[63,57],[64,56],[65,60],[66,67],[67,68],[24,69],[69,70],[70,68],[71,72],[72,73],[73,25],[71,74],[74,75],[7,28],[28,61],[62,29],[62,30],[27,61],[7,27],[76,77],[78,79],[77,7],[78,8],[53,80],[16,81],[81,0],[81,15],[12,81],[77,82],[76,82],[7,82],[83,84],[85,86],[87,88],[88,89],[89,90],[90,91],[68,60],[7,20],[10,20],[53,71],[80,92],[93,65],[55,94],[58,95],[53,94],[95,60],[94,72],[70,95],[74,72],[70,67],[92,54],[93,59],[96,64],[63,97],[75,73],[56,19],[30,18],[17,57],[20,27],[69,66],[58,93],[92,55],[96,98],[64,98],[98,62],[98,29],[78,99],[99,9],[28,82],[82,61],[82,97],[82,63],[6,100],[100,77],[8,11],[11,81],[81,10],[10,7],[8,99],[99,79],[76,100],[100,7],[52,48],[95,59],[59,65],[80,54],[54,94],[48,44],[101,102],[103,104],[103,105],[102,106],[48,107],[107,108],[109,110],[110,48],[48,111],[112,48],[108,113],[114,109],[51,115],[115,48],[116,117],[118,119],[48,120],[120,45],[52,112],[112,49],[49,111],[111,44],[112,50],[50,111],[120,44],[115,52],[97,65],[63,93],[22,24],[14,24],[5,24],[43,104],[43,103],[102,40],[101,40],[25,2],[25,13],[25,21],[80,96],[92,64],[69,58],[55,73],[50,44],[52,50],[120,121],[122,115],[121,45],[122,51],[114,110],[107,113],[123,102],[103,124],[105,124],[124,104],[101,123],[123,106],[109,46],[46,108],[47,107],[110,47],[47,48],[113,116],[119,114],[48,113],[48,121],[121,116],[48,116],[119,122],[114,48],[119,48],[122,48],[125,118],[124,117],[105,117],[117,126],[118,123],[118,106],[46,42],[41,46],[3,1],[3,0],[3,16],[19,16],[18,11],[8,18],[30,8],[29,8],[98,8],[98,78],[98,79],[118,51],[45,117],[36,35],[39,36],[39,37],[37,35],[75,125],[125,26],[26,118],[26,101],[25,40],[2,40],[3,40],[126,66],[23,126],[117,23],[104,23],[43,24],[43,5],[43,4],[42,35],[39,41],[41,38],[38,42],[106,109],[38,46],[108,105],[127,34],[34,128],[128,129],[130,127],[83,76],[86,79],[90,83],[86,88],[85,79],[76,84],[91,84],[87,85],[32,76],[79,31],[128,32],[31,127],[129,83],[129,32],[128,6],[34,12],[9,127],[130,31],[86,130],[91,82],[84,82],[98,87],[98,85],[33,129],[130,33],[89,33]],"edges_assignment":["V","V","V","V","V","M","M","V","V","V","M","M","V","M","M","V","V","M","M","M","M","V","M","V","V","M","V","V","V","V","V","V","V","V","V","M","V","M","V","M","M","B","V","V","M","B","V","M","M","V","M","M","V","V","B","B","B","V","V","V","V","V","V","B","B","M","V","V","M","M","V","M","M","V","V","B","M","V","M","V","V","M","M","V","V","B","B","B","B","B","M","V","B","M","M","V","V","M","M","V","V","M","M","M","M","M","M","V","M","V","M","V","V","M","M","B","V","M","V","V","V","V","M","B","V","V","V","M","M","M","M","M","V","V","M","M","V","V","V","V","M","M","M","M","M","M","M","M","M","V","V","V","V","V","V","V","V","V","V","V","M","M","V","V","V","M","M","B","V","M","V","M","V","M","M","V","M","V","M","B","V","M","M","B","B","V","V","M","M","M","M","V","V","V","M","M","V","M","M","V","V","M","V","V","V","M","M","V","M","V","V","M","B","V","M","B","V","M","M","M","V","M","V","M","V","M","V","M","M","V","M","B","B","M","M","V","V","B","V","V","M","V","M","M","B","V","V","M","V","M","M","V","V","M","M","M","V","M","M","M","M","M","M","M","V","V","V","V","M","M","M","M","V","V","V","V","M","M","M","V","V","B","V","B","V","V","V","M"],"edges_foldAngle":[180,180,180,180,180,-180,-180,180,180,180,-180,-180,180,-180,-180,180,180,-180,-180,-180,-180,180,-180,180,180,-180,180,180,180,180,180,180,180,180,180,-180,180,-180,180,-180,-180,0,180,180,-180,0,180,-180,-180,180,-180,-180,180,180,0,0,0,180,180,180,180,180,180,0,0,-180,180,180,-180,-180,180,-180,-180,180,180,0,-180,180,-180,180,180,-180,-180,180,180,0,0,0,0,0,-180,180,0,-180,-180,180,180,-180,-180,180,180,-180,-180,-180,-180,-180,-180,180,-180,180,-180,180,180,-180,-180,0,180,-180,180,180,180,180,-180,0,180,180,180,-180,-180,-180,-180,-180,180,180,-180,-180,180,180,180,180,-180,-180,-180,-180,-180,-180,-180,-180,-180,180,180,180,180,180,180,180,180,180,180,180,-180,-180,180,180,180,-180,-180,0,180,-180,180,-180,180,-180,-180,180,-180,180,-180,0,180,-180,-180,0,0,180,180,-180,-180,-180,-180,180,180,180,-180,-180,180,-180,-180,180,180,-180,180,180,180,-180,-180,180,-180,180,180,-180,0,180,-180,0,180,-180,-180,-180,180,-180,180,-180,180,-180,180,-180,-180,180,-180,0,0,-180,-180,180,180,0,180,180,-180,180,-180,-180,0,180,180,-180,180,-180,-180,180,180,-180,-180,-180,180,-180,-180,-180,-180,-180,-180,-180,180,180,180,180,-180,-180,-180,-180,180,180,180,180,-180,-180,-180,180,180,0,180,0,180,180,180,-180],"faces_vertices":[[3,0,16],[1,0,3],[4,0,1],[15,0,4],[81,0,15],[16,0,81],[36,1,3,39],[4,1,36,35],[25,2,13],[40,2,25],[3,2,40],[13,2,3],[21,3,16,19],[13,3,21],[39,3,40,41],[43,4,35,42],[5,4,43],[14,4,5],[22,4,14],[15,4,22,17],[24,5,43],[14,5,24],[12,6,128,34],[10,6,12,81],[7,6,10],[100,6,7],[32,6,100,76],[128,6,32],[20,7,10],[27,7,20],[28,7,27],[82,7,28],[77,7,82],[100,7,77],[29,8,98],[30,8,29],[18,8,30],[11,8,18],[9,8,11],[99,8,9],[78,8,99],[98,8,78],[99,9,31,79],[12,9,11,81],[127,9,12,34],[31,9,127],[20,10,81,15,17],[81,11,18,19,16],[25,13,21],[22,14,24],[57,17,22,24,69,58],[20,17,57,61,27],[19,18,30,62,56],[21,19,56,55,73,25],[104,23,24,43],[117,23,104,124],[126,23,117],[24,23,126,66,69],[26,25,73,75,125],[40,25,26,101],[118,26,125],[101,26,118,123],[28,27,61],[82,28,61],[62,29,98],[30,29,62],[79,31,130,86],[130,31,127],[128,32,129],[129,32,76,83],[130,33,89,88,86],[34,33,130,127],[129,33,34,128],[89,33,129,83,90],[37,35,36],[42,35,37,38],[37,36,39],[38,37,39,41],[46,38,41],[42,38,46],[102,40,101],[41,40,102,106,109,46],[43,42,46,108,105,103],[104,43,103],[48,44,120],[111,44,48],[50,44,111],[120,44,45],[120,45,121],[121,45,117,116],[47,46,109,110],[108,46,47,107],[48,47,110],[107,47,48],[119,48,114],[122,48,119],[115,48,122],[52,48,115],[112,48,52],[49,48,112],[111,48,49],[121,48,120],[116,48,121],[113,48,116],[107,48,113],[114,48,110],[50,49,112],[111,49,50],[52,50,112],[118,51,122,119],[115,51,52],[122,51,115],[94,53,71,72],[54,53,94],[80,53,54],[92,54,94,55],[80,54,92],[92,55,56,64],[73,55,94,72],[64,56,62,98],[63,57,58,93],[61,57,63,82],[95,58,69,70],[93,58,95,59],[60,59,95],[65,59,60],[93,59,65],[68,60,95,70],[97,63,93,65],[82,63,97],[96,64,98],[92,64,96,80],[69,66,67,70],[70,67,68],[72,71,74],[73,72,74,75],[77,76,100],[82,76,77],[84,76,82],[83,76,84],[98,78,79],[79,78,99],[98,79,85],[85,79,86],[84,82,91],[90,83,84,91],[98,85,87],[87,85,86,88],[102,101,123],[106,102,123],[124,103,105],[104,103,124],[117,105,108,113,116],[124,105,117],[118,106,123],[109,106,118,119,114],[108,107,113],[110,109,114]]});