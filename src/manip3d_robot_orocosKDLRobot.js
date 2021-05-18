"use strict";
(function () {
  var gExports,
    gModule,
    Communicator = require('Communicator'),
    THREE = require('THREE'),
    ilib_helpers = require('../../helpers'),
    getJsArrayFromStdVector = ilib_helpers.getJsArrayFromStdVector,
    ilib_tm = require('../../tm');

  var MM_TO_M = 0.001;
  var M_TO_MM = 1000;

  /* [DHParameters] -> OrocosKDLRobot */
  function create(OrocosKDL, pOrocosKDLSegments) {
    var chain =
      pOrocosKDLSegments
        .reduce(function (pChain, pOrocosKDLSegment) {
          pChain
            .addSegment(pOrocosKDLSegment);

          return pChain;
        }, new OrocosKDL.Chain());
    var ikSolverPos = new OrocosKDL.ChainIkSolverPos_LMA(chain);
    var fkSolverPos = new OrocosKDL.ChainFkSolverPos_recursive(chain);
    var nrOfJoints = chain.getNrOfJoints();
    var nrOfSegments = chain.getNrOfSegments();
    var lOrocosKDLRobotJntArray = new OrocosKDL.JntArray(nrOfJoints);

    function setJntArrayFromSegmentTipFrame(pFrame) {
      var qSol = new OrocosKDL.JntArray(nrOfJoints);
      var result =
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
      var pOut =
        new OrocosKDL.Frame(
          OrocosKDL.Rotation.Identity(),
          OrocosKDL.Vector.Zero()
        );
      var result =
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

    // OrocosKDL 3x3 matrix is stored as an array of 9 numbers in row-major order (source: trial and error)
    // Communicator 4x4 matrix is stored as an array of 16 numbers in column-major order (source: https://docs.techsoft3d.com/communicator/latest/build/prog_guide/viewing/model_attributes/matrices.html)
    function matrix4ColMajorArrayFromMatrix3RowMajorArray(pMatrix3Array) {
      return [
        pMatrix3Array[0],
        pMatrix3Array[3],
        pMatrix3Array[6],
        0,
        pMatrix3Array[1],
        pMatrix3Array[4],
        pMatrix3Array[7],
        0,
        pMatrix3Array[2],
        pMatrix3Array[5],
        pMatrix3Array[8],
        0,
        0,
        0,
        0,
        1,
      ];
    }

    function getSegmentTipPose(pIndex) {
      var
        lSegmentTipPosition =
          getSegmentTipFrame(pIndex)
            .getPositionThreeJsVector()
            .multiplyScalar(M_TO_MM),
        lSegmentTipRotation =
          Communicator.Matrix.createFromArray(
            matrix4ColMajorArrayFromMatrix3RowMajorArray(
              getJsArrayFromStdVector(
                OrocosKDL.getStdVectorFromRotation(
                  OrocosKDL.Frame_getRotation(
                    getSegmentTipFrame(pIndex)
                  )
                )
              )
            )
          );

      return (
        lSegmentTipRotation
          .setTranslationComponent(
            lSegmentTipPosition.x,
            lSegmentTipPosition.y,
            lSegmentTipPosition.z
          )
      );
    }

    return {
      setEndEffectorPoseFromAxisAngleAndPosition:
        function (pAxisAnglePoint, pPositionPoint) {
          var
            lQuaternion =
              ilib_tm.quaternion()
                .setFromAxisAngle(
                  ilib_tm.unit_vec(pAxisAnglePoint),
                  ilib_tm.mag(pAxisAnglePoint)
                ),
            lEulerAngles =
              (new THREE.Euler())
                .setFromQuaternion(
                  lQuaternion._three(),
                  'ZYX'
                ),
            lFrame =
              new OrocosKDL.Frame(
                OrocosKDL.Rotation.EulerZYX(
                  lEulerAngles.z,
                  lEulerAngles.y,
                  lEulerAngles.x
                )
                ,
                new OrocosKDL.Vector(
                  pPositionPoint.x() * MM_TO_M,
                  pPositionPoint.y() * MM_TO_M,
                  pPositionPoint.z() * MM_TO_M
                )
              );

          lOrocosKDLRobotJntArray =
            setJntArrayFromSegmentTipFrame(
              lFrame
            );
        }
      ,
      setEndEffectorPoseFromQuaternionAndPosition:
        function (pRotationQuaternion, pPositionPoint) {
          var
            lEulerAngles =
              (new THREE.Euler())
                .setFromQuaternion(
                  pRotationQuaternion._three(),
                  'ZYX'
                ),
            lFrame =
              new OrocosKDL.Frame(
                OrocosKDL.Rotation.EulerZYX(
                  lEulerAngles.z,
                  lEulerAngles.y,
                  lEulerAngles.x
                )
                ,
                new OrocosKDL.Vector(
                  pPositionPoint.x() * MM_TO_M,
                  pPositionPoint.y() * MM_TO_M,
                  pPositionPoint.z() * MM_TO_M
                )
              );

          lOrocosKDLRobotJntArray =
            setJntArrayFromSegmentTipFrame(
              lFrame
            );
        }
      ,
      getThreeJsVector3SegmentTipPosition:
        function (pIndex) {
          return getSegmentTipFrame(pIndex)
            .getPositionThreeJsVector()
            .multiplyScalar(M_TO_MM);
        }
      ,
      getPointEndEffectorPosition:
        function () {
          return ilib_tm.point(
            getSegmentTipFrame(nrOfSegments)
              .getPositionThreeJsVector()
              .multiplyScalar(M_TO_MM)
          );
        }
      ,
      getThreeJsVector3SegmentTipRotation:
        function (pIndex) {
          return (
            (new THREE.Vector3())
              .fromArray(
                getJsArrayFromStdVector(
                  OrocosKDL.getStdVectorFromVector(
                    OrocosKDL.Frame_getRotation(
                      getSegmentTipFrame(pIndex)
                    )
                      .GetRot()
                  )
                )
              )
          );
        }
      ,
      getPointEndEffectorRotation:
        function () {
          return (
            ilib_tm.point(
              (new THREE.Vector3())
                .fromArray(
                  getJsArrayFromStdVector(
                    OrocosKDL.getStdVectorFromVector(
                      OrocosKDL.Frame_getRotation(
                        getSegmentTipFrame(nrOfSegments)
                      )
                        .GetRot()
                    )
                  )
                )
            )
          );
        }
      ,
      getCommunicatorMatrixSegmentTipRotation:
        function (pIndex) {
          return (
            Communicator.Matrix.createFromArray(
              matrix4ColMajorArrayFromMatrix3RowMajorArray(
                getJsArrayFromStdVector(
                  OrocosKDL.getStdVectorFromRotation(
                    OrocosKDL.Frame_getRotation(
                      getSegmentTipFrame(pIndex)
                    )
                  )
                )
              )
            )
          );
        }
      ,
      getMatrixEndEffectorRotation:
        function () {
          return (
            ilib_tm.matrix(
              Communicator.Matrix.createFromArray(
                matrix4ColMajorArrayFromMatrix3RowMajorArray(
                  getJsArrayFromStdVector(
                    OrocosKDL.getStdVectorFromRotation(
                      OrocosKDL.Frame_getRotation(
                        getSegmentTipFrame(nrOfSegments)
                      )
                    )
                  )
                )
              )
            )
          );
        }
      ,
      getJointMatrices:
        function () {
          return (
            lOrocosKDLRobotJntArray.toJsArray()
              .map(function (_, _i) {
                return (
                  /* frame rotation */
                  ilib_tm.matrix(this.getCommunicatorMatrixSegmentTipRotation(_i + 2))
                    .multiply(
                      /* frame translation */
                      ilib_tm.matrix().setTranslationComponent(ilib_tm.point(this.getThreeJsVector3SegmentTipPosition(_i + 2)))
                    )._hoops()
                );
              }, this)
          );
        }
      ,
      getBaseMatrix:
        function () {
          return (
            /* frame rotation */
            ilib_tm.matrix(this.getCommunicatorMatrixSegmentTipRotation(0))
              .multiply(
                /* frame translation */
                ilib_tm.matrix().setTranslationComponent(ilib_tm.point(this.getThreeJsVector3SegmentTipPosition(0)))
              )
          );
        }
      ,
      getJointAxes:
        function () {
          return lOrocosKDLRobotJntArray.toJsArray()
            .map(function (_, _i) {
              return (
                ilib_tm.lineTransformedByMatrix(
                  /* joint rotation axis line */
                  ilib_tm.line(ilib_tm.point(0, 0, 0), ilib_tm.point(0, 0, 1))
                  ,
                  /* frame rotation */
                  ilib_helpers.converge(
                    this.getThreeJsVector3SegmentTipRotation(_i + 1),
                    function (pRotationAxis) {
                      return ilib_tm.line(ilib_tm.point(0, 0, 0), ilib_tm.point(pRotationAxis));
                    },
                    function (pRotationAxis) {
                      return ilib_tm.mag(ilib_tm.point(pRotationAxis));
                    },
                    function (pRotationAxisLine, pRotationAngle) {
                      return (
                        ilib_tm.matrix(
                          ilib_tm.matrixRotatedAroundAxisWithAngle(
                            pRotationAxisLine,
                            pRotationAngle
                          )
                        )
                      );
                    }
                  )
                    .multiply(
                      /* frame translation */
                      ilib_tm.matrix().setTranslationComponent(ilib_tm.point(this.getThreeJsVector3SegmentTipPosition(_i + 1)))
                    )
                    ._hoops()
                )
              );
            }, this);
        }
      ,
      getJntArray:
        function () {
          return lOrocosKDLRobotJntArray.toJsArray();
        }
      ,
      setJntArray:
        function (pJointAngles) {
          lOrocosKDLRobotJntArray.fromJsArray(pJointAngles || new Array(nrOfJoints).fill(0));
        }
      ,
      setJntAngleAtIndex:
        function (pIndex, pNewJointAngle) {
          lOrocosKDLRobotJntArray.fromJsArray(
            lOrocosKDLRobotJntArray.toJsArray()
              .map(function (pJointAngle, _i) {
                return _i === pIndex
                  ? pNewJointAngle
                  : pJointAngle;
              })
          );
        }
      ,
      _dbgDrawAllSegmentTipPoses:
        function (p3DContext, pHID) {
          for (var i = 1; i <= (nrOfSegments); i++) {
            p3DContext.createDbgTriad(
              ilib_tm.matrix(
                getSegmentTipPose(i)
              ).multiply(
                p3DContext.getNodeMatrix(pHID)
              )
              , null, 100);
          }
        }
      ,
      _dbgDrawEndEffectorPose:
        function (p3DContext, pHID) {
          p3DContext.createDbgTriad(
            ilib_tm.matrix(
              getSegmentTipPose(nrOfSegments)
            ).multiply(
              p3DContext.getNodeMatrix(pHID)
            )
            , null, 100);
        }
      ,
      _dbgDrawFrame:
        function (p3DContext, pHID, pAxisAnglePoint, pPositionPoint) {
          var lQuaternion =
            ilib_tm.quaternion()
              .setFromAxisAngle(
                ilib_tm.unit_vec(pAxisAnglePoint),
                ilib_tm.mag(pAxisAnglePoint)
              ),
            lEulerAngles =
              (new THREE.Euler())
                .setFromQuaternion(
                  lQuaternion._three(),
                  'ZYX'
                ),
            lFrame =
              new OrocosKDL.Frame(
                OrocosKDL.Rotation.EulerZYX(
                  lEulerAngles.z,
                  lEulerAngles.y,
                  lEulerAngles.x
                )
                ,
                OrocosKDL.Vector.Zero()
              ),
            lCommunicatorFrameMatrix =
              Communicator.Matrix.createFromArray(
                matrix4ColMajorArrayFromMatrix3RowMajorArray(
                  getJsArrayFromStdVector(
                    OrocosKDL.getStdVectorFromRotation(
                      OrocosKDL.Frame_getRotation(
                        lFrame
                      )
                    )
                  )
                )
              )
                .setTranslationComponent(
                  pPositionPoint.x(),
                  pPositionPoint.y(),
                  pPositionPoint.z()
                )
            ,
            lGlobalFrame =
              ilib_tm.matrix(
                lCommunicatorFrameMatrix
              )
                .multiply(
                  p3DContext.getNodeMatrix(pHID)
                );

          p3DContext.createDbgTriad(lGlobalFrame, null, 120);
        }
    };
  }

  /* Module export glue */
  /* global define */
  gExports = {
    create: create
  };
  gModule = typeof module;
  if (gModule !== 'undefined' && module.exports != undefined) {
    module.exports = gExports;
  } else if (define != undefined && typeof define === 'function' && define.amd) {
    define([], function () { return gExports; });
  }
}());