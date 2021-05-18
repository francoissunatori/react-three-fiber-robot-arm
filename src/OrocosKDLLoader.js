import * as THREE from 'three'
import createOrocosKDL from "./OrocosKDLFactory.mjs";
import { getJsArrayFromStdVector } from './utils'

async function load () {
  const OrocosKDL = await createOrocosKDL()

  OrocosKDL.JntArray.prototype.toJsArray =
    function () {
      return getJsArrayFromStdVector(
        OrocosKDL.getStdVectorFromJntArray(this)
      );
    };
  
  OrocosKDL.JntArray.prototype.fromJsArray =
    function (pJsArray) {
      var lThis = this;
  
      pJsArray.forEach(function (_, i) {
        OrocosKDL.setJntArrayDataAtIndex(lThis, i, pJsArray[i]);
      });
    };

  OrocosKDL.Frame.prototype.getJsArrayPosition =
    function () {
      return getJsArrayFromStdVector(
        OrocosKDL.getStdVectorFromVector(
          OrocosKDL.Frame_getPositionVector(this)
        )
      );
    };

  OrocosKDL.Frame.prototype.getJsArrayRotation =
    function () {
      return getJsArrayFromStdVector(
        OrocosKDL.getStdVectorFromRotation(
          OrocosKDL.Frame_getRotation(this)
        )
      );
    };
  
  OrocosKDL.Frame.prototype.getThreeJsVector3Position =
    function () {
      return new THREE.Vector3(...this.getJsArrayPosition());
    };

  OrocosKDL.Frame.prototype.getThreeJsVector3Rotation =
    function () {
      return new THREE.Vector3(...this.getJsArrayRotation());
    };

  OrocosKDL.Vector.fromThreeJsVector3 =
    function (threeJsVector3) {
      return new OrocosKDL.Vector(
        threeJsVector3.x,
        threeJsVector3.y,
        threeJsVector3.z
      );
    };

  return OrocosKDL
}

export default {
  load
}
