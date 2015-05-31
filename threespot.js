function THREESpot(camera, renderer, scene) {
    this.sizes = {};
    this.textures = {};
    this.hotspots = {};
    this.domEvents = new THREEx.DomEvents(camera , renderer.domElement);
    this.scene = scene;
}

/**
 * Adds a sphere with custom size for creating hotspots with that size
 * @param {String} key Name used to get this size
 * @param {Number} r   Radius of the sphere
 * @param {Number} w   Number of horizontal segments. Minimum value is 3.
 * @param {Number} h   Number of vertical segments. Minimum value is 2, and the default is 6.
 */
THREESpot.prototype.addSize = function(key, r, w, h) {
    if (key in this.sizes){
        throw new Error("This key size already exists");
    }
    
    var sphere = new THREE.SphereGeometry(r, w, h);
    this.sizes[key] = sphere;
};

/**
 * Adds a texture for creating hotspots with it
 * @param {String} key  Name used to get this texture
 * @param {String} path Path to image texture
 */
THREESpot.prototype.addTexture = function(key, path){    
    if (key in this.textures){
        throw new Error("This key texture already exists");
    }
    
    var texture = new THREE.MeshBasicMaterial({
        map : THREE.ImageUtils.loadTexture(path)
    });
    this.textures[key] = texture;
};

/**
 * Adds a hotspot in a specific position using an existing size and texture
 * @param {String} key        Name used to get the hotspot
 * @param {Number} x          Vector's x value 
 * @param {Number} y          Vector's y value 
 * @param {Number} z          Vector's z value
 * @param {String} sizeKey    Name of existing size
 * @param {String} textureKey Name of existing texture
 */
THREESpot.prototype.addHotspot = function(key, x, y, z, sizeKey, textureKey){    
    if (key in this.hotspots){
        throw new Error("This key hotspot already exists");
    }
    
    var geometry = this.sizes[sizeKey];
    var texture = this.textures[textureKey];
    
    var hotspot = new THREE.Mesh(geometry, texture);
	hotspot.position.set(x, y, z);
    this.hotspots[key] = hotspot;
    
    this.scene.add(hotspot);
}

/**
 * Adds an event to an existing hotspot 
 * @param {String}   hotspotKey Name of existing hotspot
 * @param {String}   event      Event that will trigger the function (click, dblclick, mousedown, mouseup, mouseover, mouseout)
 * @param {Function} callback   Function to execute
 */
THREESpot.prototype.addEvent = function(hotspotKey, event, callback){    
    var hotspot = this.hotspots[hotspotKey];
    this.domEvents.addEventListener(hotspot, event, callback, false);
};

/**
 * Rotates the indicated hotspot in the specified degrees
 * @param {String} key Name of existing hotspot
 * @param {Number} x   Degrees of x axis rotation
 * @param {Number} y   Degrees of y axis rotation
 * @param {Number} z   Degrees of z axis rotation
 */
THREESpot.prototype.rotateHotspot = function(key, x, y, z){
    var hotspot = this.hotspots[key];
    hotspot.rotation.x = x;
    hotspot.rotation.y = y;
    hotspot.rotation.z = z;
}