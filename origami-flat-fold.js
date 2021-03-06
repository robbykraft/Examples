svg.size(1, 1)
	.padding(0.1)
	.strokeWidth(1 / 100);

let origami = ear.origami();
const startAngle = Math.random() * 0.5 + 2.25;
const startCrease = ear.line.fromAngle(startAngle).translate(0.25, 0.25);
origami.flatFold(startCrease);
// swap out with origami every time we mouse release
let origamiBackup = origami.copy();

const style = { faces: { front: { fill: "#fb4" }}};
svg.graph(origami.folded(), style);

svg.onPress = () => { origamiBackup = origami.copy(); };
svg.onRelease = () => { origamiBackup = origami.copy(); };

svg.onMove = (mouse) => {
  if (mouse.buttons === 0) { return; }
  const crease = ear.axiom(2, {points: [mouse.press, mouse.position]}).shift();
	origami = origamiBackup.copy();
	origami.flatFold(crease);
	svg.removeChildren();
  svg.graph(origami.folded(), style);
};

