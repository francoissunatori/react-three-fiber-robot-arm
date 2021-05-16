function create(OrocosKDL, pOrocosKDLSegments) {
  const chain =
    pOrocosKDLSegments
      .reduce(function (pChain, pOrocosKDLSegment) {
        pChain
          .addSegment(pOrocosKDLSegment);

        return pChain;
      }, new OrocosKDL.Chain());
  const ikSolverPos = new OrocosKDL.ChainIkSolverPos_LMA(chain);
  const fkSolverPos = new OrocosKDL.ChainFkSolverPos_recursive(chain);
  const nrOfJoints = chain.getNrOfJoints();
  const nrOfSegments = chain.getNrOfSegments();
  const lOrocosKDLRobotJntArray = new OrocosKDL.JntArray(nrOfJoints);

  function setJntArrayFromSegmentTipFrame(pFrame) {
    let qSol = new OrocosKDL.JntArray(nrOfJoints);
    const result =
      ikSolverPos.CartToJnt(
        lOrocosKDLRobotJntArray,
        pFrame,
        qSol
      );

    if (result !== 0) {
      throw new Error("OrocosKDLRobot: CartToJnt couldn't find a solution!");
    }

    return qSol;
  }

  function getSegmentTipFrame(pIndex) {
    let pOut =
      new OrocosKDL.Frame(
        OrocosKDL.Rotation.Identity(),
        OrocosKDL.Vector.Zero()
      );
    const result =
      fkSolverPos.JntToCart(
        lOrocosKDLRobotJntArray,
        pOut,
        pIndex
      );

    if (result !== 0) {
      console.error("OrocosKDLRobot: JntToCart couldn't find a solution!");
    }

    return pOut;
  }

  return {
    getThreeJsVector3SegmentTipPosition:
      function (pIndex) {
        return getSegmentTipFrame(pIndex)
          .getPositionThreeJsVector()
          .multiplyScalar(M_TO_MM);
      }
  }
}

export default {
  create
}
