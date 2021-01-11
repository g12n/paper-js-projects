// Create a Paper.js Path to draw a line into it:

var seed = Date.now()
Math.seedrandom(seed);

var trunk = new Path();
trunk.closed = false;
// Move to start and draw a line from there
trunk.moveTo(view.bounds.bottomCenter);

var vector = new Point();
vector.length = 40;
vector.angle = -90;

trunk.lineBy(vector)
for (var i=0; i<= 10; i++){
    vector.length -= Math.random() * 5;
    vector.angle -= Math.random()*-20+10;
    trunk.lineBy(vector)


} 
trunk.simplify()



function  addBranch(trunk, t, angle){
    var offset = trunk.length * t;
    var start = trunk.getPointAt(offset)
    var branch = new Path();
    branch.moveTo(start);
    vector.length= (trunk.length-offset)/8;
    vector.angle= trunk.getTangentAt(offset).angle + angle;
    for (var i=0; i<= 10; i++){
        vector.length -= Math.random() * (vector.length/4);
        vector.angle += Math.random()*-angle/6;
        branch.lineBy(vector)
    }
    branch.simplify()
    return branch;
}


function addBranches(branches) {

    var output = branches;
    branches.map(function(branch){
        
        //right branch
        var o1 = Math.random()*0.5 +0.5
        var o2 = Math.random()*0.5
        output.push(addBranch(branch, o1, -60)) 
        //left branch
        output.push(addBranch(branch, o2, 60)) 
    })
return output
}


var branches = [trunk];

branches = addBranches(branches);
branches = addBranches(branches);




var right =  addBranch(trunk, 0.5, -45); 
var left =  addBranch(trunk, 0.25, 45); 

var addse =  addBranch(trunk, 0.35, 65); 
var right2 =  addBranch(right, 0.5, 45); 
var left2 =  addBranch(right, 0.25, -54); 
var right3 =  addBranch(left, 0.5, 45); 
var left3 =  addBranch(left, 0.25, -45);

//branches.push(right,left,right2,left2,right3,left3)

function  thicken(trunk){
    var thick = new Path({fillColor:"black"});
     thick.visibility = 0;
     var thickness = trunk.length / 12;
     for (var i=0; i<1; i+=0.1) {
        var offset = trunk.length * i;
        var localThickness = (thickness - thickness*i)/2;
        var leftTrack = trunk.getPointAt(offset) - trunk.getNormalAt(offset)*localThickness;
        var rightTrack = trunk.getPointAt(offset) +  trunk.getNormalAt(offset)*localThickness;
        thick.insert(0, rightTrack);
        thick.add(leftTrack)
        thick.smooth()
     }
     return (thick);
    }


    var canape = new Path({fillColor:"red"});
    var tree = new Path({fillColor:"#123"});
    
 
    branches.map(function (branch){
        var endPoint = branch.getPointAt(branch.length);
        var myCircle = new Path.Circle(endPoint, branch.length/4);
        var c = canape.unite(myCircle)
        myCircle.remove()
        canape.remove()
        canape = c
 
        var thick = thicken(branch);
        var t = tree.unite(thick)
        branch.remove()
        thick.remove()
        tree.remove();
        tree = t
    })
   
 var canape2 = canape.clone();
    canape2.opacity = 0.5;
 
    canape.fillColor = "#FFA500"
 
    canape2.smooth()
    canape.simplify(4)
 
var tree2 = tree.clone();
    tree.opacity = 0.5;
    tree2.opacity = 0.8
    tree.simplify(3);


var width=360; 
var height = 640;


var rectSize = new Size(width, height);
var topLeft = view.bounds.bottomCenter- [width/2,height ];
var rect = new Rectangle(topLeft, rectSize);

var bg = new Path.Rectangle(rect);
bg.fillColor = '#F0EEE6';
bg.sendToBack()


function onResize(event) {
	// Whenever the window is resized, recenter the trunk:
//	trunk.position = view.center;
}

function save () {
    var filename= "tree-"+seed ;
    var blob = new Blob([project.exportSVG({bounds: rect, asString: true, precision: 1})], {type: "image/svg+xml;charset=utf-8"});
	saveAs(blob, filename+".svg");
}

function onKeyDown(event) {
    
    if(event.key ==="s") {
        save()
    }
	
}