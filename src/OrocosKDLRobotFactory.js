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
    getJntArray:
      () => lOrocosKDLRobotJntArray.toJsArray()
  ,
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
  ,
    getSegmentTipAtIndexFrame
  ,
    planMoveL:
      (startFrame, goalFrame) => {
        const map = new OrocosKDL.map$string$$double$();

        lOrocosKDLRobotJntArray.toJsArray()
          .forEach((angle, i) => map.set(i + "", angle));

        const mapKeys = map.keys();
        for (let i = 0; i < mapKeys.size(); i++) {
          const key = mapKeys.get(i);
          console.log("Map key/value: ", key, map.get(key));
        }

        console.log('lOrocosKDLRobotJntArray.toJsArray() :>> ', lOrocosKDLRobotJntArray.toJsArray());
        const plan = OrocosKDL.plan(0.1, 0.1, startFrame, goalFrame, 0.5, 0.5, 5, map, chain);

        console.log('plan.points :>> ', plan.points);
        const planJsArray = [];
        for (let i = 0; i < plan.points.size(); i++) {
          console.log(
            'plan.points[', i, '] :>> ',
            plan.points.get(i)
          );

          const positions = [];
          for (let j = 0; j < plan.points.get(i).positions.size(); j++) {
            console.log(
              'plan.points[', i, '].positions[', j, '] :>> ',
              plan.points.get(i).positions.get(j)
            );

            positions.push(plan.points.get(i).positions.get(j));
          }

          planJsArray.push({
            positions
          });
        }

        return planJsArray;
      }
  }
}

export default {
  create
}
