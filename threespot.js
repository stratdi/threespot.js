var interval;
/**
 * Constructor for object THREESpot
 * @param {Object} camera   Camera used by three.js to create the player
 * @param {Object} renderer Renderer used by three.js to create the player
 * @param {Object} scene    Scene used by three.js to create the player
 */
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
    
    var mesh = new THREE.Mesh(geometry, texture);
	mesh.position.set(x, y, z);
    //mesh.visible = true;
    
    var hotspot = new Hotspot(mesh, null);
    
    this.hotspots[key] = hotspot;
    
    this.scene.add(mesh);
}

/**
 * Adds an event to an existing hotspot 
 * @param {String}   hotspotKey Name of existing hotspot
 * @param {String}   event      Event that will trigger the function (click, dblclick, mousedown, mouseup, mouseover, mouseout)
 * @param {Function} callback   Function to execute
 */
THREESpot.prototype.addEvent = function(hotspotKey, event, callback){    
    var hotspot = this.hotspots[hotspotKey];
    this.domEvents.addEventListener(hotspot.mesh, event, function() {
        if (hotspot.mesh.visible){
            callback();
        }
    }, false);
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
    hotspot.mesh.rotation.x = x;
    hotspot.mesh.rotation.y = y;
    hotspot.mesh.rotation.z = z;
}

/**
 * Starts the dynamic hotspots.
 * IMPORTANT: attribute 'loop' doesn't fire the event 'onended'. So, your video MUSTN'T have that attribute. 
 * You can do the trick passing a 'true' value by parameter . 
 * @param {Boolean} loop TRUE makes video loop and will reset the dynamic hotspots
 */
THREESpot.prototype.start = function(loop){
    var threespot = this;
    var video = $("video").get(0);

    video.onended = function(){
        if (loop){
            var hotspotsKeys = Object.keys(threespot.hotspots);

            for (var i = 0; i < hotspotsKeys.length; i++){
                var key = hotspotsKeys[i];
                var hotspot = threespot.hotspots[key];
                hotspot.nextPos = 0;
                this.currentTime = 0;
                this.play();
            }
        }else{
            clearInterval(interval);
        }
    }
    
    interval = setInterval(function(){
        threespot.dynamicHotspotManagement();
    }, 50);
    
    
}

/**
 * Manages the dynamics hotspots. This function is called by the interval
 */
THREESpot.prototype.dynamicHotspotManagement = function(){
    var currentTime = $("video")[0].currentTime;
    var hotspotsKeys = Object.keys(this.hotspots);
    for (var i = 0; i < hotspotsKeys.length; i++){
        var key = hotspotsKeys[i];
        var hotspot = this.hotspots[key];
        hotspot.repaint(currentTime);
    }
}  

/**
 * Adds a hotspot using an existing size and texture, and a file which contains the different positions through time 
 * @param {String} key        Name used to get the hotspot
 * @param {String} file       Path to the file
 * @param {String} sizeKey    Name of existing size
 * @param {String} textureKey Name of existing texture
 */
THREESpot.prototype.addDynamicHotspot = function(key, file, sizeKey, textureKey){

    if (key in this.hotspots){
        throw new Error("This key hotspot already exists");
    }
    
    var geometry = this.sizes[sizeKey];
    var texture = this.textures[textureKey];
    
    var mesh = new THREE.Mesh(geometry, texture);
	mesh.position.set(500, 3, 0);
    mesh.visible = false;
    this.scene.add(mesh);
    
    var hotspot = new Hotspot(mesh, file);
    this.hotspots[key] = hotspot;
}

/**
 * Constructor for object Hotspot
 * @param {Object} mesh The mesh representing the hotspot sphere
 * @param {String} file Path to the file
 */
function Hotspot(mesh, file){
    this.mesh = mesh;
    if (file){
        this.timeline = null;
        this.parseFile(file);
        this.nextPos = 0;
    }
}

/**
 * Repaints the hotspot in the new position if necessary
 * @param {Number} currentTime Current time of video
 */
Hotspot.prototype.repaint = function(currentTime){
    if (this.timeline){

        var instant = this.timeline[this.nextPos];

        if (currentTime >= instant.time){
            if (!isNaN(instant.x)){            
                this.timeline[this.nextPos].nextPos = this.nextPos++;
            
                this.mesh.position.set(instant.x, instant.y, instant.z);
                this.mesh.visible = true;
                
            }else {
                this.mesh.visible = false;
            }
        }else {
            if (this.nextPos > 0){
                // Mejora smooth
                if (!isNaN(instant.x)){
                    
                    //console.log(this.timeline[this.nextPos-1]);
                    var instantAnt = this.timeline[this.nextPos-1];
                    var difX = Number((instant.x - instantAnt.x));
                    var difY = Number((instant.y - instantAnt.y));
                    var difZ = Number((instant.z - instantAnt.z));
                    var difTime = Number(instant.time - instantAnt.time);
                    
                    var newX = this.mesh.position.x + ((0.05*difX)/difTime);
                    var newY=this.mesh.position.y + ((0.05*difY)/difTime);
                    var newZ=this.mesh.position.z + ((0.05*difZ)/difTime);
                    this.mesh.position.set(newX, newY, newZ);

                }
            }
        }
    }
}

/**
 * Parses the file passed by param and creates n-instant objects.
 * @param {String} file Path to the file
 */
Hotspot.prototype.parseFile = function(file){    
    var hotspot = this;
    $.get(file, function(data) {
        var fileSplitted = data.split("\n");
        
        var timeline = new Array();
        
        for (var i=0; i < fileSplitted.length; i++){
            var lineSplitted = fileSplitted[i].split("#");
            var instant = new Instant(lineSplitted[0], lineSplitted[1], lineSplitted[2], lineSplitted[3]);
            timeline.push(instant);
        }
        
        hotspot.timeline = timeline;
    }, "text");
}

/**
 * Constructor for object Instant
 * @param {Number} time The time in seconds to show the dynamic hotspot
 * @param {Number} x    Vector's x value 
 * @param {Number} y    Vector's y value 
 * @param {Number} z    Vector's z value
 */
function Instant(time, x, y ,z){
    this.time = Number(time);
    this.x = Number(x);
    this.y = Number(y);
    this.z = Number(z);
}

