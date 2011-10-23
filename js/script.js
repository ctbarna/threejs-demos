/* Author: Chris Barna
Experiments in Three.js

Tutorial at: http://www.aerotwist.com/lab/getting-started-with-three-js/
*/

// @see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

// Scene size
var WIDTH = 400,
  HEIGHT = 300;

// Camera attributes.
var VIEW_ANGLE = 45,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 10000;

// Our DOM element.
var $container = $('#main');

// WebGL renderer, camera, and scene.
var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(VIEW_ANGLE,
                             ASPECT,
                             NEAR,
                             FAR);
var scene = new THREE.Scene();

// Move the camera
camera.position.z = 300;
// camera.position.y = 200;

// camera.rotation.x = -Math.sin(Math.PI / 6);

$("body").mousemove(function (event) {
  var x_ratio = (event.pageX / window.innerWidth)-.5;

  camera.position.x = Math.sin(x_ratio * Math.PI) * 400;
  camera.position.z = Math.cos(x_ratio * Math.PI) * 400;
  // camera.rotation.y = Math.sin((x_ratio * Math.PI)/2);
  camera.rotation.y = Math.sin(x_ratio * Math.PI);

  // camera.rotation.y = Math.sin(x_ratio * Math.PI);
  // camera.rotation.z = Math.sin(x_ratio * Math.PI);
});

// Start the renderer.
renderer.setSize(WIDTH, HEIGHT);

// Attach the DOM element.
$container.append(renderer.domElement);

// Sphere
var radius = 15, segments = 20, rings = 16;
var sphereMaterial = new THREE.MeshLambertMaterial({
  color: 0xCC0000
});

var sphere = new THREE.Mesh(
  new THREE.SphereGeometry(radius,
                          segments,
                          rings),
  sphereMaterial);

sphere.velocity = new THREE.Vector3(1, 1, 1);

var bounds = {
  x: [-150, 150],
  y: [-110, 110],
  z: [-300, 0]
};

var line_material = new THREE.LineBasicMaterial({ color: 0x000000 });
// Redraw the box.
function redraw_box() {
  for (var i = 0; i < bounds.x.length; i += 1) {
    for (var j = 0; j < bounds.y.length; j += 1) {
      for (var k = 0; k < bounds.z.length; k += 1) {
        var line_geo = new THREE.Geometry();

        line_geo.vertices.push(
          new THREE.Vertex(
            new THREE.Vector3(bounds.x[i],
                              bounds.y[j],
                              bounds.z[k])
          )
        );

        line_geo.vertices.push(
          new THREE.Vertex(
            new THREE.Vector3(bounds.x[(i+1)%(bounds.x.length)],
                             bounds.y[j],
                             bounds.z[k])
          )
        );

        line_geo.vertices.push(
          new THREE.Vertex(
            new THREE.Vector3(bounds.x[(i+1)%(bounds.x.length)],
                             bounds.y[(j+1)%(bounds.y.length)],
                             bounds.z[k])
          )
        );
        line_geo.vertices.push(
          new THREE.Vertex(
            new THREE.Vector3(bounds.x[(i+1)%(bounds.x.length)],
                             bounds.y[(j+1)%(bounds.y.length)],
                             bounds.z[(k+1)%(bounds.z.length)])
          )
        );

        var line = new THREE.Line(line_geo, line_material);
        scene.add(line);
      }
    }
  }

}

redraw_box();

function update() {
  // Change directions.
  if (sphere.position.z === bounds.z[1]) {
    sphere.velocity.z = -1;
  } else if (sphere.position.z === bounds.z[0]) {
    sphere.velocity.z = 1;
  }

  if (sphere.position.x === bounds.x[1]) {
    sphere.velocity.x = -1;
    console.log('x 150');
  } else if (sphere.position.x === bounds.x[0]) {
    sphere.velocity.x = 1;
    console.log('x -150');
  }

  if (sphere.position.y === bounds.y[0]) {
    sphere.velocity.y = 1;
    console.log('y -110');
  } else if (sphere.position.y === bounds.y[1]) {
    sphere.velocity.y = -1;
    console.log('y 110');
  }
  sphere.position.addSelf(sphere.velocity);

  // Rerender and start over.
  renderer.render(scene, camera);
  requestAnimFrame(update);
}

requestAnimFrame(update);

scene.add(sphere);

// Lights!
var pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;

scene.add(pointLight);

renderer.render(scene, camera);
