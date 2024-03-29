svg.size(2, 1)
	.padding(0.05)
	.strokeWidth(svg.getHeight() / 50);

const polyFill1 = svg.polygon().stroke("none");
const polyFill2 = svg.polygon().stroke("none");
const poly1 = svg.polygon().fill("none").stroke("black");
const poly2 = svg.polygon().fill("none").stroke("black");

svg.controls(20)
  .svg(() => svg.circle().radius(svg.getHeight() / 40).fill("#000"))
  .position((_, i, arr) => [
		Math.random() + (i < arr.length / 2 ? 0 : 1),
		Math.random()
	])
  .onChange((point, i, points) => {
		const hull1 = ear.math.convexHull(points.slice(0, points.length / 2));
		const hull2 = ear.math.convexHull(points.slice(points.length / 2, points.length));
		poly1.setPoints(hull1);
		poly2.setPoints(hull2);
		polyFill1.setPoints(hull1);
		polyFill2.setPoints(hull2);
		const overlap = ear.math.overlapConvexPolygons(hull1, hull2);
		polyFill1.fill(overlap ? "#e53" : "#158");
		polyFill2.fill(overlap ? "#e53" : "#158");
  }, true);
