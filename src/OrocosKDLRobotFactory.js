function create(OrocosKDL, pOrocosKDLSegments) {
  const chain =
    pOrocosKDLSegments
      .reduce((pChain, pSegment) => {
        pChain
          .addSegment(pSegment);

        return pChain;
      }, new OrocosKDL.Chain());
  const ikSolverPos = new OrocosKDL.ChainIkSolverPos_LMA(chain);
  const fkSolverPos = new OrocosKDL.ChainFkSolverPos_recursive(chain);
  const nrOfJoints = chain.getNrOfJoints();
  const nrOfSegments = chain.getNrOfSegments();
  let lOrocosKDLRobotJntArray = new OrocosKDL.JntArray(nrOfJoints);

  function setJntArrayFromSegmentTipFrame(frame) {
    let out = new OrocosKDL.JntArray(nrOfJoints);

    if (ikSolverPos.CartToJnt(lOrocosKDLRobotJntArray, frame, out) !== 0) {
      throw new Error("OrocosKDLRobot: CartToJnt couldn't find a solution!");
    }

    return out;
  }

  function getSegmentTipAtIndexFrame(index) {
    let out =
      new OrocosKDL.Frame(
        OrocosKDL.Rotation.Identity(),
        OrocosKDL.Vector.Zero()
      );

    if (fkSolverPos.JntToCart(lOrocosKDLRobotJntArray, out, index) !== 0) {
      console.error("OrocosKDLRobot: JntToCart couldn't find a solution!");
    }

    return out;
  }

  return {
    getThreeJsVector3SegmentTipAtIndexPosition:
      index =>
        getSegmentTipAtIndexFrame(index)
          .getJsArrayPosition()
  ,
    getThreeJsVector3SegmentTipAtIndexRotation:
      index =>
        getSegmentTipAtIndexFrame(index)
          .getJsArrayRotation()
  ,
    setJntArray:
      jointAngles =>
        lOrocosKDLRobotJntArray.fromJsArray(
          jointAngles || new Array(nrOfJoints).fill(0)
        )
  ,
    setAtIndexJntAngle:
      (index, newJointAngle) =>
        lOrocosKDLRobotJntArray.fromJsArray(
          lOrocosKDLRobotJntArray.toJsArray()
            .map((jointAngle, i) =>
              i === index
                ? newJointAngle
                : jointAngle
            )
        )
  ,
    setEndEffectorPoseFromPointPosition:
      jsArrayPosition => {
        lOrocosKDLRobotJntArray =
          setJntArrayFromSegmentTipFrame(
            new OrocosKDL.Frame(
              OrocosKDL.Rotation.Identity(),
              new OrocosKDL.Vector(...jsArrayPosition)
            )
          );
      }
  }
}

export default {
  create
}
