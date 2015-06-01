# Threespot.js

Threespot.js is a library that allows you to create easily hotspots in 360 degrees photos & videos

Threespot.js uses the WebGL-based library <strong>Three.js</strong>, that allows you to create and display animated 3D computer graphics on a Web browser. In the demo folder it is included a modified version of <strong>Valiant360</strong> library to work with, but is compatible with standard Three.js too.
### Features
Threespot.js provides the next features:
* Add texture to draw with it
* Add a size to draw with it
* Draw a hotspot in specific coordinates
* Add an event to a specific hotspot (events availables: *click, dblclick, mousedown, mouseup, mouseover, mouseout*)
* Rotate a specific hotspot

### Version
1.0.0

### Try it
* [Photo example]
* [Video example]

### Tech

Threespot.js uses a number of open source projects to work properly:

* [jQuery] - JavaScript library designed to simplify the client-side scripting of HTML
* [Threejs] - JavaScript library used to create and display animated 3D graphics on a Web browser
* [Valiant360] (optional) - A full 360 degree panorama video player built in JavaScript + WebGL.

### Installation
It's as simple as the following import:
```html
<html>
    <head>
        <script src="your/path/to/threespot.js"></script>
    </head>
</html>
```

### Usage
##### Initialization
To use it, first you have to set up your 360 degrees player. Next, you have to initialize the library like this:
```javascript
// Existing camera, renderer and scene
var hotspots = new THREESpot(camera, renderer, scene);
```
##### Declaring texture
You can declare a texture to be used with any hotspot. 
```javascript
// Creates a new texture to be used with hotspots
hotspots.addTexture("textureName", "path/To/Texture.png");
```
##### Declaring size
You can declare a size to create hotspots with the same size. 
```javascript
// Creates a new size to be used with hotspots with r, w and h (30, 32, 32)
hotspots.addSize("sizeName", 30, 32, 32);
```
##### Declaring hotspot
Once you have a size and a texture declared, you can create a hotspot giving a name, position and the names of size and texture.
```javascript
// Creates a new hotspot with an existing size and texture in x, y and z coordinates (500, 45, 55)
hotspots.addHotspot("hotspotName", 500, 45, 55, "sizeName", "textureName");
```
##### Rotating hotspot
Initially, a hotspot is drawn looking at the same direction of the camera, and you may need to change the texture orientation for any reason.
```javascript
// Rotates the specified hotspot in x, y and z coordinates (0, 3.2, 0)
hotspots.rotateHotspot("hotspotName", 0, 3.2, 0);
```
##### Adding an event
Finally, you may want an interactive hotspot. With this function you can map a callback function to an event occurred in a hotspot.
```javascript
// Adds an event to the specified hotspot, and map the callback function to the event.
hotspots.addEvent("hotspotName", "mouseup", function(){
    alert("You clicked in hotspot!");
});
```
##### I want to use your modified Valiant360 library, how can I use it?
Well, if you want to use Valiant360 instead of basic initialization of threejs, you have to use the supplied version in demo folder, which includes the modifications to work with threespot.js. There is also a new feature, which is a debug mode that lets you know graphically the positions x, y and z to place your hotspot.
###### Declaring photo/video source
View [Valiant360 README]

###### Getting camera, renderer and scene
The main reason to adapt the Valiant360 library is because we need the camera, renderer and scene. So, in this modified version we can get them like this:
```javascript
 var hotspots = new THREESpot(cameras['Valiant360'], renderers['Valiant360'], scenes['Valiant360']);
```
All the demos of threespot are made with this version of Valiant360, so you can see it implemented.
###### Using debug mode
To use this new feature, you only have to initialize Valiant360 with this parameter:
```javascript
$('.player').Valiant360({
    debug: true
});
```
You will see a turquoise sphere that will show you the coordinates if you click on it.

License
----

MIT

[jQuery]:http://jquery.com
[Threejs]:http://threejs.org/
[Valiant360]:https://github.com/flimshaw/Valiant360
[Valiant360 README]: https://github.com/flimshaw/Valiant360/blob/master/README.md
[Photo example]: http://todo
[Video example]: http://todo2