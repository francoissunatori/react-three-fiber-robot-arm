import createOrocosKDL from "./OrocosKDLFactory.mjs";

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
  
  OrocosKDL.Frame.prototype.getPositionThreeJsVector =
    function () {
      var arr = getJsArrayFromStdVector(
        OrocosKDL.getStdVectorFromVector(
          OrocosKDL.Frame_getPositionVector(this)
        )
      );
  
      return (new THREE.Vector3(
        arr[0],
        arr[1],
        arr[2]
      ));
    };
  
  OrocosKDL.Vector.fromThreeJsVector =
    function (pThreeJsVector) {
      return new OrocosKDL.Vector(
        pThreeJsVector.x,
        pThreeJsVector.y,
        pThreeJsVector.z
      );
    };

  return OrocosKDL
}

export default {
  load
}
