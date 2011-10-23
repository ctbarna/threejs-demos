/**
 * Hopefully, there will be a bouncing ball on this page.
 * @author Chris Barna
 **/

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
var WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight;

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

camera.position.z = 700;
camera.position.y = 300;
camera.rotation.x = -.1;
// camera.rotation.x = Math.sin(Math.PI / 4);

// Start the renderer.
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0x000000, 1);
renderer.clear();

// Attach the DOM element.
$container.append(renderer.domElement);

// Floor
var cube = new THREE.Mesh(new THREE.CubeGeometry(150, 10, 150),
                      new THREE.MeshLambertMaterial({
                        color: 0x00FF00
                      }));
scene.add(cube);
THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB( cube ) );

// Ball (will bounce!)
var radius = 15, segments = 20, rings = 16;
var sphereMaterial = new THREE.MeshLambertMaterial({
  color: 0xCC0000
});

var sphere = new THREE.Mesh(
  new THREE.SphereGeometry(radius,
                          segments,
                          rings),
  sphereMaterial);
sphere.position.y = 250;
scene.add(sphere);

// Lights
var pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.y = 200;
// pointLight.position.x = 100;
pointLight.position.z = 100;
scene.add(pointLight);

// The animation function.
var a = 0.1;
var v = new THREE.Vector3(0, -1, 0);
function update() {
  var ray = new THREE.Ray(sphere.position, new THREE.Vector3(0, -1, 0));
  var c = THREE.Collisions.rayCastNearest(ray);

  if (v.y > 0) {
    v.y -= (v.y * a);
  } else {
    v.y += (v.y * a);
  }

  if (v.y < .9 && v.y > 0) {
    v.y = -v.y;
  }

  if (c && Math.floor(c.distance) <= radius) {
    v.y = -v.y*(.9);
  }

  sphere.position.addSelf(v);
  renderer.render(scene, camera);
  requestAnimFrame(update);
}
requestAnimFrame(update);
renderer.render(scene, camera);
