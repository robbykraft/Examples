var callback;

svg.size(-1.5, -1.5, 3, 3);
svg.strokeWidth(0.05);

const gridLayer = svg.g().stroke("#eee").strokeLinecap("round");
const drawLayer = svg.g().strokeLinecap("round");
const dotLayer = svg.g();
const dotArray = `${0.0005} ${0.1}`;

const colors = ["#fb4", "#158", "#e53"];
const lines = Array.from(Array(3))
  .map((_, i) => drawLayer.line().stroke(colors[i]));

const boundary = ear.polygon([
  [-svg.getWidth() * 10, -svg.getHeight() * 10],
  [svg.getWidth() * 10, -svg.getHeight() * 10],
  [svg.getWidth() * 10, svg.getHeight() * 10],
  [-svg.getWidth() * 10, svg.getHeight() * 10]
]);

for (let i = -12; i <= 12; i += 1) {
  gridLayer.line(i, -svg.getHeight() * 10, i, svg.getHeight() * 10);
  gridLayer.line(-svg.getWidth() * 10, i, svg.getWidth() * 10, i);
}
[[svg.getWidth() * 10, 0], [0, svg.getHeight() * 10], [-svg.getWidth() * 10, 0], [0, -svg.getHeight() * 10]]
  .forEach(pts => gridLayer.line(0, 0, ...pts)
    .strokeDasharray(dotArray)
    .stroke("#aaa"));

const onChange = function (point, i, points) {
  const segments = Array.from(Array(3))
    .map((_, i) => [i*2+0, i*2+1])
    .map(arr => arr.map(i => points[i]));
  const line = ear.line.fromPoints(...segments[0]);
  const ray = ear.ray.fromPoints(...segments[1]);
  const segment = ear.segment(...segments[2]);
  const primitives = [line, ray, segment];
  const clips = ["clipLine", "clipRay", "clipSegment"]
    .map((key, i) => boundary[key](primitives[i]));
  clips.forEach((seg, i) => lines[i].setPoints(seg[0], seg[1]));
  if (callback != null) {
    callback({ line, ray, segment, points });
  }
};

svg.controls(6)
  .svg((_, i) => dotLayer.circle().radius(0.12).fill(colors[parseInt(i/2)]))
  .position(() => [svg.getWidth(), svg.getHeight()].map(n => n * (Math.random() - 0.5)))
  .onChange(onChange, true);
