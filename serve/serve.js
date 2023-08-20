import { RoarAppkit, initializeFirebaseProject } from '@bdelab/roar-firekit';
import RoarANB from "../src/index";
import { roarConfig } from "./firebaseConfig";
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { utils } from '../src/utils';

// Import necessary for async in the top level of the experiment script
import "regenerator-runtime/runtime";

const queryString = new URL(window.location).search;
const urlParams = new URLSearchParams(queryString);
const pid = urlParams.get('participant') || null;
const studyId = urlParams.get('studyId') || null;
const labId = urlParams.get("labId") || null;
// const classId = urlParams.get('classId') || null;
const schoolId = urlParams.get('schoolId') || null;
const consent = urlParams.get("consent") || true;
const taskVariant = urlParams.get("variant") || "pilot";
const userMode = urlParams.get("mode") || "default";
const grade = urlParams.get('grade') || null;
const skip = urlParams.get("skip");
const audioFeedback = urlParams.get("feedback") || "binary";
utils.NUM_BLOCKS = urlParams.get("numBlocks") || utils.NUM_BLOCKS;
utils.ADAPTIVE_NUM_TRIALS = urlParams.get("adaptiveNumTrials") || utils.ADAPTIVE_NUM_TRIALS;
utils.SHOW_CONTROL_TRIALS = urlParams.get("controlTrials") || utils.SHOW_CONTROL_TRIALS;
utils.CASING_CHOICE = urlParams.get("casingChoice") || utils.CASING_CHOICE;

// @ts-ignore
const appKit = await initializeFirebaseProject(roarConfig.firebaseConfig, 'assessmentApp', 'none');

onAuthStateChanged(appKit.auth, (user) => {
  if (user) {
    const userInfo = {
      pid,
      schoolId,
      assessmentUid: user.uid,
      userMetadata: { },
    };

    const userParams = {
      labId,
      grade,
    };

    const gameParams = {
      userMode,
      studyId,
      taskVariant,
      skip,
      consent,
      audioFeedback,
    };

    const taskInfo = {
      taskId: 'anb',
      variantParams: gameParams,
    };

    const firekit = new RoarAppkit({
      firebaseProject: appKit,
      taskInfo,
      userInfo,
    });

    const roarApp = new RoarANB(firekit, gameParams, userParams);

    roarApp.run();
  }
});

await signInAnonymously(appKit.auth);
