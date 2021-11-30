import * as THREE from 'three';

export function addWallLighting(scene) {
    const mainLight = new THREE.PointLight( 0xffffff, 1, 250 )
    mainLight.position.y = 60
    scene.add( mainLight )
}

function addWall(width, height, color, pos = {x: 0, y: 0, z: 0}, rot = {x: 0, y: 0, z: 0}) {
    const geometry = new THREE.PlaneGeometry( width, height )
    const material = new THREE.MeshPhongMaterial( {color: color} )
    const plane = new THREE.Mesh( geometry, material )
    plane.position.set(pos.x, pos.y, pos.z)
    plane.rotation.set(rot.x, rot.y, rot.z)
    return plane
}

export function addRoom(scene) {
    let wall_width = 100.1
    let pos_width = 100
    // floor
    scene.add( addWall(wall_width, wall_width, 0xffffff, {x: 0, y: 0, z: 0}, {x: - Math.PI / 2, y: 0, z: 0}) )
    // ceiling
    scene.add( addWall(wall_width, wall_width, 0xffffff, {x: 0, y: pos_width, z: 0}, {x: Math.PI / 2, y: 0, z: 0}) )
    // right wall
    scene.add( addWall(wall_width, wall_width, 0x00ff00, {x: pos_width/2, y: pos_width/2, z: 0}, {x: 0, y: - Math.PI / 2, z: 0}) )
    // left wall
    scene.add( addWall(wall_width, wall_width, 0xff0000, {x: -pos_width/2, y: pos_width/2, z: 0}, {x: 0, y: Math.PI / 2, z: 0}) )
    // far wall
    scene.add( addWall(wall_width, wall_width, 0x7f7fff, {x: 0, y: pos_width/2, z: -pos_width/2}, {x: 0, y: 0, z: 0}) )
    // close wall
    scene.add( addWall(wall_width, wall_width, 0x7f7fff, {x: 0, y: pos_width/2, z: pos_width/2}, {x: 0, y: Math.PI, z: 0}) )
}

export function dumpObject(obj, lines = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
        const isLast = ndx === lastNdx;
        dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
}