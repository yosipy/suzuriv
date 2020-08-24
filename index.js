//import * as THREE from 'three.min.js';
import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';
import {GLTFLoader} from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://unpkg.com/three@0.119.1/examples/jsm/controls/OrbitControls.js';

// button
document.getElementById("image1").onclick = () => {
  alert("クリックされました")
}
document.getElementById("image2").onclick = () => {
  alert("クリックされました")
}
document.getElementById("image3").onclick = () => {
  alert("クリックされました")
}


function modelLoad(url) {
	var loader = new GLTFLoader()

	// Optional: Provide a DRACOLoader instance to decode compressed mesh data
	//var dracoLoader = new DRACOLoader();
	//dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
	//loader.setDRACOLoader( dracoLoader );
	return new Promise((resolve, reject) => {
		loader.load(
			// resource URL
			url,
			// called when the resource is loaded
			function ( gltf ) {
	
				const model = gltf.scene
				model.name = 'model'
				resolve(model)
			},
			// called while loading is progressing
			function ( xhr ) {
	
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
	
			},
			// called when loading has errors
			function ( error ) {
	
				console.log( 'An error happened' )
	
			}
		)
	})
}

function imageLoad(url, width=null, height=null) {
	const image_loader = new THREE.ImageLoader()
	return new Promise((resolve, reject) => {
		image_loader.load(
			url,
			function ( image ) {
				var canvas = document.createElement( 'canvas' )

				let w, h
				if (width != null && height != null) {
					w = width
					h = height
				} else {
					w = image.width
					h = image.height
				}

				canvas.width = width
				canvas.height = height
				
				var context = canvas.getContext( '2d' )
				context.drawImage( image, 0, 0, w, h )

				let src = context.getImageData(0, 0, w, h)
				resolve(src)
			},
			// onProgress callback currently not supported
			undefined,
			// onError callback
			function () {
				console.error( 'An error happened.' )
			}
		)
	})
}

function blendColor(base_rgb, override_rgb, override_a){
	const shadow = base_rgb - 255
	const override = (override_rgb - 255) * (override_a / 255)
	return 255 + override + shadow 
}

async function synthesis(scene) {
	const model = await modelLoad('model/glb/0_normal_p24180_m8_b103_materialchuu.glb')
	const model_image = await imageLoad('model/gltf/0_normal_p24180_m8_b103_materialchuu_img7.png', 2048, 2048)
	const suzuri_image = await imageLoad('1591475524-2520x2992.png', 165, Number(165*(349/315)))

	let left_top_x = 1200
	let left_top_y = 1200
	for (let s_x = 0; s_x < suzuri_image.width; ++s_x){
		for (let s_y = 0; s_y < suzuri_image.height; ++s_y){
			//
			let m_x = left_top_x + s_x
			let m_y = left_top_y + s_y
			const m_index = (m_y * model_image.width + m_x) * 4
			const s_index = (s_y * suzuri_image.width + s_x) * 4

			model_image.data[m_index] = blendColor(model_image.data[m_index], suzuri_image.data[s_index], suzuri_image.data[s_index+3])
			model_image.data[m_index+1] = blendColor(model_image.data[m_index+1], suzuri_image.data[s_index+1], suzuri_image.data[s_index+3])
			model_image.data[m_index+2] = blendColor(model_image.data[m_index+2], suzuri_image.data[s_index+2], suzuri_image.data[s_index+3])
			model_image.data[m_index+3] = 255
		}
	}
	
	model.traverse(function(child){
		if (child.name == 'Body (merged).baked_0'){
			child.material.map.image = model_image
		}
	})

	console.log(model)
	scene.add(model)
}

window.addEventListener('DOMContentLoaded', init)
function init() {
	var scene = new THREE.Scene()
	var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 )
	camera.rotation.set(-Math.PI / 4, Math.PI, 0)
	camera.position.set(0, 1, -2);

	var renderer = new THREE.WebGLRenderer()
	renderer.setSize( window.innerWidth, window.innerHeight )
	renderer.gammaOutput = true;
	renderer.gammaFactor = 2.2;
	document.body.appendChild( renderer.domElement )

	const controls = new OrbitControls( camera, renderer.domElement )
	controls.target = new THREE.Vector3(0, 1, 0)

	// 平行光源
	const light = new THREE.DirectionalLight(0xFFFFFF)
	light.intensity = 2
	light.position.set(1, 1, 1)
	// シーンに追加
	scene.add(light)

	synthesis(scene)

	// 初回実行
	tick();
	function tick() {
		controls.update()
		renderer.render(scene, camera)
		requestAnimationFrame(tick)
	}
}
