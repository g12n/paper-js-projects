// Tree Drawing Script
// This script uses the Paper.js library to draw a stylized tree

import paper from 'paper';

// Initialize Paper.js
paper.setup(new paper.Size(400, 500));

// Set canvas dimensions
const WIDTH = 400;
const HEIGHT = 500;

// Generate a random seed
const SEED = Date.now();

/**
 * Creates the main trunk of the tree
 * @returns {paper.Path} The trunk path
 */
function createTrunk() {
    const trunk = new paper.Path();
    trunk.moveTo(paper.view.bounds.bottomCenter);

    let vector = new paper.Point({
        length: 50,
        angle: -90
    });

    trunk.lineBy(vector);

    for (let i = 0; i <= 10; i++) {
        vector.length -= Math.random() * 5;
        vector.angle -= Math.random() * -20 + 10;
        trunk.lineBy(vector);
    }

    trunk.simplify();
    return trunk;
}

/**
 * Adds a branch to the given trunk at a specified position and angle
 * @param {paper.Path} trunk - The trunk or branch to add a new branch to
 * @param {number} t - The position along the trunk (0-1)
 * @param {number} angle - The angle of the new branch
 * @returns {paper.Path} The new branch
 */
function addBranch(trunk, t, angle) {
    const offset = trunk.length * t;
    const start = trunk.getPointAt(offset);
    const branch = new paper.Path();
    branch.moveTo(start);

    let vector = new paper.Point({
        length: (trunk.length - offset) / 8,
        angle: trunk.getTangentAt(offset).angle + angle
    });

    for (let i = 0; i <= 10; i++) {
        vector.length -= Math.random() * (vector.length / 4);
        vector.angle += Math.random() * -angle / 4;
        branch.lineBy(vector);
    }

    branch.simplify();
    return branch;
}

/**
 * Adds branches to the given set of branches
 * @param {paper.Path[]} branches - Array of existing branches
 * @returns {paper.Path[]} Updated array of branches
 */
function addBranches(branches) {
    const newBranches = [];
    branches.forEach(branch => {
        const rightOffset = Math.random() * 0.5 + 0.5;
        const leftOffset = Math.random() * 0.5;
        newBranches.push(addBranch(branch, rightOffset, -60));
        newBranches.push(addBranch(branch, leftOffset, 60));
    });
    return branches.concat(newBranches);
}

/**
 * Thickens a given path to create a more realistic branch or trunk
 * @param {paper.Path} path - The path to thicken
 * @returns {paper.Path} The thickened path
 */
function thicken(path) {
    const thick = new paper.Path({
        fillColor: "black",
        closed: true
    });

    const thickness = path.length / 12;

    for (let i = 0; i < 1; i += 0.1) {
        const offset = path.length * i;
        const localThickness = (thickness - thickness * i) / 2;
        const normal = path.getNormalAt(offset);
        const point = path.getPointAt(offset);

        thick.insert(0, point.add(normal.multiply(localThickness)));
        thick.add(point.subtract(normal.multiply(localThickness)));
    }

    thick.smooth();
    return thick;
}

/**
 * Main function to draw the tree
 */
function drawTree() {
    // Create the main trunk
    const trunk = createTrunk();

    // Generate branches
    let branches = [trunk];
    branches = addBranches(branches);
    branches = addBranches(branches);

    // Create canopy and tree structure
    let canopy = new paper.Path();
    let treeStructure = new paper.Path();

    branches.forEach(branch => {
        // Add to canopy
        const endPoint = branch.getPointAt(branch.length);
        const leaf = new paper.Path.Circle(endPoint, branch.length / 4);
        canopy = canopy.unite(leaf);
        leaf.remove();

        // Add to tree structure
        const thickBranch = thicken(branch);
        treeStructure = treeStructure.unite(thickBranch);
        branch.remove();
        thickBranch.remove();
    });

    // Style the canopy
    const canopyOverlay = canopy.clone();
    canopyOverlay.opacity = 0.5;
    canopy.fillColor = "#FFA500";
    canopyOverlay.smooth();
    canopy.simplify(4);

    // Style the tree structure
    const treeOverlay = treeStructure.clone();
    treeStructure.opacity = 0.5;
    treeOverlay.opacity = 0.8;
    treeStructure.simplify(3);

    // Create background
    const bgSize = new paper.Size(WIDTH, HEIGHT);
    const bgTopLeft = paper.view.bounds.bottomCenter.subtract([WIDTH / 2, HEIGHT]);
    const bgRect = new paper.Rectangle(bgTopLeft, bgSize);
    const background = new paper.Path.Rectangle(bgRect);
    background.fillColor = '#F0EEE6';
    background.sendToBack();
}

// Draw the tree
drawTree();

// Export the SVG
document.body.appendChild(paper.project.exportSVG());