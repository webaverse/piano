import * as THREE from 'three';
import metaversefile from 'metaversefile';
import { Vector3 } from 'three';

const {useApp, useFrame, useLoaders, usePhysics, useCleanup, useLocalPlayer, useActivate, useScene, useCamera} = metaversefile;

const baseUrl = import.meta.url.replace(/(\/)[^\/\/]*$/, '$1'); 

const localVector = new THREE.Vector3();
const localVector2 = new THREE.Vector3();
const localVector3 = new THREE.Vector3();
const localVector4 = new THREE.Vector3();
const localVector5 = new THREE.Vector3();
const localQuaternion = new THREE.Quaternion();
const localQuaternion2 = new THREE.Quaternion();
const localQuaternion3 = new THREE.Quaternion();
const localEuler = new THREE.Euler();
const localMatrix = new THREE.Matrix4();
window.isDebug = false


export default () => {  

    const app = useApp();
    const camera = useCamera();
    window.heli = app
    const physics = usePhysics();
    window.physics = physics;
    const scene = useScene();
    const physicsIds = [];
    const localPlayer = useLocalPlayer();

    let vehicleObj;

    let vehicle = null;
    let sitSpec = null;

    // Inputs
    let keyW = false;
    let keyA = false;
    let keyS = false;
    let keyD = false;
    let keyShift = false;
    let keyQ = false;
    let keyE = false;
    let keyC = false;

    let sitPos = null;

    let sitAnim = null;
    let pianoKeys = [];
    let whitePianoKeys = [];
    let blackPianoKeys = [];
    let pianoKeysArray = [];
    let currentOctave = 1;

    let whiteKeyObjs = [];
    let blackKeyObjs = [];

    let blackMaterial = null;
    let whiteMaterial = null;

    function onDocumentKeyDown(event) {
        var keyCode = event.which;
        event.preventDefault();
        event.stopPropagation();
        if(keyCode == 16) { // L-Shift
            keyShift = true;
        }
        if (keyCode == 49) { // A
            _playKey("a1");
        }
        if (keyCode == 50) { // S
            _playKey("b1");
        }
        if (keyCode == 51) { // D 
            _playKey("c1");
        }
        if (keyCode == 52) { // F 
            _playKey("d1");
        }
        if (keyCode == 53) { // G 
            _playKey("e1");
        }
        if (keyCode == 54) { // H 
            _playKey("f1");
        }
        if (keyCode == 55) { // J
            _playKey("g1");
        }


        if (keyCode == 56) { // K
            _playKey("a2");
        }
        if (keyCode == 57) { // L
            _playKey("b2");
        }
        if (keyCode == 48) { // L
            _playKey("c2");
        }
        if (keyCode == 81) { // Q
            _playKey("d2");
        }
        if (keyCode == 87) { // W
            _playKey("e2");
        }
        if (keyCode == 69) { // E
            _playKey("f2");
        }
        if (keyCode == 82) { // R
            _playKey("g2");
        }


        if (keyCode == 84) { // T
            _playKey("a3");
        }
        if (keyCode == 89) { // Y
            _playKey("b3");
        }
        if (keyCode == 85) { // U
            _playKey("c3");
        }
        if (keyCode == 73) { // I
            _playKey("d3");
        }
        if (keyCode == 79) { // O
            _playKey("e3");
        }
        if (keyCode == 80) { // P
            _playKey("f3");
        }
        if (keyCode == 219) { // [
            _playKey("g3");
        }


        if (keyCode == 221) { // ]
            _playKey("a4");
        }
        if (keyCode == 65) { // A
            _playKey("b4");
        }
        if (keyCode == 83) { // S
            _playKey("c4");
        }
        if (keyCode == 68) { // D
            _playKey("d4");
        }
        if (keyCode == 70) { // F
            _playKey("e4");
        }
        if (keyCode == 71) { // G
            _playKey("f4");
        }
        if (keyCode == 72) { // H
            _playKey("g4");
        }


        if (keyCode == 74) { // J
            _playKey("a5");
        }
        if (keyCode == 75) { // K
            _playKey("b5");
        }
        if (keyCode == 76) { // L
            _playKey("c5");
        }
        if (keyCode == 186) { // ;
            _playKey("d5");
        }
        if (keyCode == 222) { // '
            _playKey("e5");
        }
        if (keyCode == 90) { // Z
            _playKey("f5");
        }
        if (keyCode == 88) { // X
            _playKey("g5");
        }


        if (keyCode == 67) { // C
            _playKey("a6");
        }
        if (keyCode == 86) { // V
            _playKey("b6");
        }
        if (keyCode == 66) { // B
            _playKey("c6");
        }
        if (keyCode == 78) { // N
            _playKey("d6");
        }
        if (keyCode == 77) { // M
            _playKey("e6");
        }
        if (keyCode == 188) { // ,
            _playKey("f6");
        }
        if (keyCode == 190) { // .
            _playKey("g6");
        }
        /*if (keyCode == 191) { // /
            _playKey("b6");
        }*/
        
        
    };
    function onDocumentKeyUp(event) {
        var keyCode = event.which;
        if(keyCode == 16) { // L-Shift
            keyShift = false;
        }
        if (keyCode == 90) { // Z
            //currentOctave++;
        }
        if (keyCode == 88) { // X
            currentOctave--;
            //_playSequence();
        }
        if (keyCode == 32) { // Space
            //_unwear();
            document.removeEventListener("keydown", onDocumentKeyDown, false);
            document.removeEventListener('keyup', onDocumentKeyUp);
            _unwear();
            sitSpec = null;
        }
    };

    const _playKey = (index) => {

        //let obj = pianoKeys.find(o => o.key === (index + currentOctave).toString());
        //let sound = obj.sound;

        let objIndex = 0;
        let obj = null;
        let noteColor = "white";

        if(keyShift) {
            let blackNoteArray = ["a", "c", "d", "f", "g"];
            if(blackNoteArray.includes(index.charAt(0))) {
                index = [index.slice(0, 1), "Sharp", index.slice(1)].join('');
            }
        }

        //console.log(index.length, index);

        if(index.length > 2) {
            objIndex = blackPianoKeys.findIndex(o => o.key === (index).toString());
            obj = blackPianoKeys[objIndex];
            noteColor = "black";
        }
        else {
            objIndex = whitePianoKeys.findIndex(o => o.key === (index).toString());
            obj = whitePianoKeys[objIndex];
            noteColor = "white";
            //console.log(objIndex,obj,noteColor);
        }

        _changeColor(noteColor, objIndex);

        if(obj.sound.isPlaying) {
            obj.sound.stop();
            obj.sound.play();
        }
        else {
            obj.sound.play();
        }
    }

    const _changeColor = (noteColor, objIndex) => {

        let tempObj = null;
        let actualObj = null;
        let originHeight = 0;

        if(noteColor === "black") {
            tempObj = blackMaterial.clone();
            actualObj = blackKeyObjs[objIndex];
            actualObj.material = new THREE.MeshStandardMaterial( {color: 0x891df5} );
            let tempObj2 = actualObj.clone();
            originHeight = tempObj2.position.y;
        }
        else {
            tempObj = whiteMaterial.clone();
            actualObj = whiteKeyObjs[objIndex];
            actualObj.material = new THREE.MeshStandardMaterial( {color: 0x891df5} );
            let tempObj2 = actualObj.clone();
            originHeight = tempObj2.position.y;
        }

        actualObj.position.y -= 0.02;
        actualObj.updateMatrixWorld();

        //console.log(noteColor, objIndex);

        setTimeout(() => {

            actualObj.material = tempObj.material;
            actualObj.position.y = tempObj.position.y;
            actualObj.updateMatrixWorld();

        }, 500);

    }

    const _playSequence = () => {

        let totalDelay = 0;

        let song = [
            {"note": "e3"},
            {"note": "g3"},
            {"note": "e2"},

            {"delay": 1700},

            {"note": "fSharp2"},

            {"delay": 1700},

            {"note": "d4"},
            {"note": "a3"},
            {"note": "g2"},

            {"delay": 1700},

            {"note": "b2"},

            {"delay": 1700},

            {"note": "fSharp3"},
            {"note": "a3"},
            {"note": "a2"},

            {"delay": 1700},

            {"note": "g2"},

            {"delay": 1700},

            {"note": "cSharp4"},
            {"note": "a3"},
            {"note": "a2"},

            {"delay": 3500},

            {"note": "e3"},
            {"note": "g3"},
            {"note": "e2"},

            {"delay": 1700},

            {"note": "fSharp2"},

            {"delay": 1700},

            {"note": "d4"},
            {"note": "a3"},
            {"note": "g2"},

            {"delay": 1700},

            {"note": "b2"},

            {"delay": 1700},

            {"note": "fSharp3"},
            {"note": "a3"},
            {"note": "a2"},

            {"delay": 1700},

            {"note": "g2"},

            {"delay": 1700},

            {"note": "cSharp4"},
            {"note": "a3"},
            {"note": "a2"}


        ];

        for (var i = 0; i < song.length; i++) {
            if(song[i].delay) {
                totalDelay += song[i].delay ? song[i].delay : 0;
            }
            else {

                let objIndex = 0;
                let obj = null;
                let noteColor = "white";
                if(song[i].note.length > 2) {
                    objIndex = blackPianoKeys.findIndex(o => o.key === (song[i].note).toString());
                    obj = blackPianoKeys[objIndex];
                    noteColor = "black";
                }
                else {
                    objIndex = whitePianoKeys.findIndex(o => o.key === (song[i].note).toString());
                    obj = whitePianoKeys[objIndex];
                    noteColor = "white";
                }

                setTimeout(() => {

                    _changeColor(noteColor, objIndex);

                    if(obj.sound.isPlaying) {
                        obj.sound.stop();
                        obj.sound.play();
                    }
                    else {
                        obj.sound.play();
                    }
                }, totalDelay);
            }  
        }
    }

    const _unwear = () => {
      if (sitSpec) {
        const sitAction = localPlayer.getAction('sit');
        if (sitAction) {
          localPlayer.removeAction('sit');
          sitSpec = null;
        }
      }
    };

    const loadModel = ( params ) => {

        return new Promise( ( resolve, reject ) => {
                
            const { gltfLoader } = useLoaders();
            gltfLoader.load( params.filePath + params.fileName, function( gltf ) {
                resolve( gltf.scene );     
            });
        })
    }

    const modelName = 'GrandPiano.glb';
    let p1 = loadModel( { filePath: baseUrl, fileName: modelName, pos: { x: 0, y: 0, z: 0 } } ).then( result => { vehicleObj = result } );

    let loadPromisesArr = [ p1 ];

    Promise.all( loadPromisesArr ).then( models => {

        app.add( vehicleObj );

        const physicsId = physics.addGeometry(vehicleObj);
        physicsIds.push(physicsId);
        
        vehicle = app.physicsObjects[0];
        window.vehicle = vehicle;
        vehicle.detached = true;

        vehicle.position.copy(app.position)
        physics.setTransform(vehicle);

        app.traverse(o => {
         o.castShadow = true;
        });

        const listener = new THREE.AudioListener();
        camera.add( listener );

        app.updateMatrixWorld();

        for (var i = 0; i < 55; i++) {

            app.traverse(o => {
          
              let str1 = "whiteKey" + i.toString();
              let str2 = "blackKey" + i.toString();
          
              if(o.name === str1 && whiteKeyObjs.length < 49) {
                whiteKeyObjs.push(o);
                whiteMaterial = o.clone();
              }

              if(o.name === str2 && blackKeyObjs.length < 35) {
                blackKeyObjs.push(o);
                blackMaterial = o.clone();
              }
                      
            });
        };

        let noteArray = ["a", "b", "c", "d", "e", "f", "g"];
        let blackNoteArray = ["a", "c", "d", "f", "g"];
        let keyTypes = ["Sharp", ""];
        let noteTypesArray = [blackNoteArray, noteArray];

        for (var keyColor = 0; keyColor < keyTypes.length; keyColor++) {

            for (var b = 1; b < 8; b++) {
                for (var i = 0; i < noteTypesArray[keyColor].length; i++) {

                    const sound = new THREE.PositionalAudio( listener );
                    const audioLoader = new THREE.AudioLoader();
                    audioLoader.load( 'audio/keys/' + noteTypesArray[keyColor][i] + keyTypes[keyColor] + b.toString() +'.ogg', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setRefDistance( 1 );
                        sound.setVolume( 0.25 );
                    });
                    
                    app.add( sound );

                    let indx = noteTypesArray[keyColor][i] + keyTypes[keyColor] + b.toString();
                    let keyasd = {"key" : indx.toString(), "sound" : sound};

                    if(keyTypes[keyColor] === "Sharp") {
                        blackPianoKeys.push(keyasd);
                    }
                    else {
                        whitePianoKeys.push(keyasd);
                    }
                    
                    
                }
            }

        }

    });

    useFrame(( { timeDiff } ) => {


    });

    useActivate(() => {

      sitSpec = app.getComponent('sit');
      if (sitSpec) {
        let rideMesh = null;

        const {instanceId} = app;

        const rideBone = sitSpec.sitBone ? rideMesh.skeleton.bones.find(bone => bone.name === sitSpec.sitBone) : null;
        const sitAction = {
          type: 'sit',
          time: 0,
          animation: sitSpec.subtype,
          controllingId: instanceId,
          controllingBone: rideBone,
        };
        localPlayer.setControlAction(sitAction);
        app.wear(true);
      }
    
    });

    app.addEventListener('wearupdate', e => {
      if(e.wear) {
        document.addEventListener("keydown", onDocumentKeyDown, false);
        document.addEventListener('keyup', onDocumentKeyUp);
      } else {
        document.removeEventListener("keydown", onDocumentKeyDown, false);
        document.removeEventListener('keyup', onDocumentKeyUp);
        _unwear();
      }
    });

    useCleanup(() => {
      for (const physicsId of physicsIds) {
       physics.removeGeometry(physicsId);
      }
      _unwear();
    });

    return app;
}
