/* eslint-disable max-len */
import store from "store2";
import _omitBy from "lodash/omitBy";
import _isNull from "lodash/isNull";
import _isUndefined from "lodash/isUndefined";

import { utils } from '../../utils';
import { getUserDataTimeline } from '../trials/getUserData';
import { jsPsych } from "../jsPsych";
import { RoarScores } from "../scores";

// Add this function to create random pid used for demo version later //
const makePid = () => {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  // eslint-disable-next-line max-len
  for (let i = 0; i < 16; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }
  return text;
};

const initStore = () => {
  if (store.session.has("initialized") && store.local("initialized")) {
    return store.session;
  }
  store.session.set("practiceIndex", 0);
  // Counting variables
  store.session.set("currentBlockIndex", 0);
  store.session.set("trialNumBlock", 0); // counter for trials in block
  store.session.set("trialNumTotal", 0); // counter for trials in experiment
  store.session.set("demoCounter", 0);
  store.session.set("nextStimulus", null);
  store.session.set("response", "");
  store.session.set("dataCorrect", "");
  store.session.set("keyResponse", "");
  store.session.set("gradeKeyResponse", []);
  store.session.set("currentCorpus", []);

  // variables to track current state of the experiment
  store.session.set("currentTrialCorrect", true); // return true or false
  store.session.set("coinTrackingIndex", 0);

  store.session.set("initialized", true);

  return store.session;
};

function configTaskInfo() {
  // TODO: Edit taskInfo here. The information will be used to populate the task
  // metadata in the Firestore database.
  const taskInfo = {
    taskId: 'roar-anb',
    taskName: 'Roar Anb',
    variantName: 'default',
    taskDescription: 'Development for jsPsych version of ROAR adaptive n back. Versions and their dependencies are packaged within folders to ensure continued functionality as new test versions are deployed.',
    variantDescription: 'default',
    // TODO: Edit the blocks below to better reflect your task/variant
    blocks: [
      {
        blockNumber: 0,
        trialMethod: 'fixed', // could be "random", "adaptive", "fixed", etc.
        corpus: 'practice_block', // should be the name or URL of some corpus
      },
      {
        blockNumber: 1,
        trialMethod: 'fixed', // could be "random", "adaptive", "fixed", etc.
        corpus: 'exercise_block', // should be the name or URL of some corpus
      },
    ],
  };

  return taskInfo;
}

export const taskInfo = configTaskInfo();

export const initConfig = async (firekit, gameParams, userParams) => {
  const cleanParams = _omitBy(_omitBy({ ...gameParams, ...userParams }, _isNull), _isUndefined);

  const {
    userMode,
    userMetadata,
    urlParams,
    pid,
    studyId,
    labId,
    schoolId,
    consent,
    taskVariant,
    grade,
    skip,
    audioFeedback,
  } = cleanParams;

  // grab school prefix from pid
  let prefix = null;
  if (pid) {
    prefix = pid.split("-")[0];
    if ((prefix === pid) || (taskVariant !== 'school')) {
      prefix = null;
    }
  }

  const config = {
    pid: pid,
    studyId: studyId || (`${taskVariant}-${userMode}`),
    schoolId: schoolId || prefix,
    labId: labId,
    userMode: userMode,
    taskVariant: taskVariant,
    consent: consent,
    // TODO: You can add additional user metadata here
    userMetadata: { grade: grade },
    startTime: new Date(),
    urlParams: urlParams,
    firekit,
    skip: skip,
    audioFeedback: audioFeedback,
    utils: utils,
  };

  const updatedGameParams = Object.fromEntries(Object.entries(gameParams).map(([key, value]) => [key, config[key] ?? value]));
  await config.firekit.updateTaskParams(updatedGameParams);

  if (config.pid !== null) {
    await config.firekit.updateUser({ assessmentPid: config.pid, ...userMetadata });
  }

  return config;
};

export const initRoarJsPsych = (config) => {
  // ROAR apps communicate with the participant dashboard by passing parameters
  // through the URL. The dashboard can be made to append a "pipeline" parameter
  // e.g., https://roar-anb.web.app?pipeline=rc for the REDCap pipeline.
  // Similarly, at the end of the assessment the ROAR app communicates with the
  // dashboard using URL parameters for a game token, "g", and a completion
  // status, "c", e.g., https://reading.stanford.edu/?g=1234&c=1.  Here we inspect
  // the "pipeline" parameter that was passed through the URL query string and
  // construct the appropriate redirect URL.
  // const queryString = new URL(window.location).search;
  // const urlParams = new URLSearchParams(queryString);
  // const pipeline = urlParams.get('pipeline') || null;

  // TODO: Customize the redirect URLs here by inserting the correct game token.
  // const redirect = () => {
  //   if (config.taskVariant === 'demo') {
  //     // TODO: Fix the redirect URL here by replacing the 'XXXX' in the URL below
  //     window.location.href = 'https://roar.stanford.edu/';
  //     // TODO: Replace the pipeline value here with one that you want
  //   } else if (config.taskVariant === 'school') {
  //     // TODO: Fix the redirect URL here by replacing the 'XXXX' in the URL below
  //     window.location.href = 'https://reading.stanford.edu/?g=XXXX&c=1'; // TO DO: ADD REDIRECT FOR SCHOOLS
  //     // TODO: Replace the pipeline value here with one that you want
  //   } else { window.location.href = 'https://roar.stanford.edu/'; }
  //   // Here, we refresh the page rather than redirecting back to the dashboard
  //   // window.location.reload();
  // };

  // You can add additional pipeline-dependent redirect URLs here using
  // additional `else if` clauses.

  if (config.displayElement) {
    jsPsych.opts.display_element = config.displayElement;
  }

  // Extend jsPsych's on_finish and on_data_update lifecycle functions to mark the
  // run as completed and write data to Firestore, respectively.
  const extend = (fn, code) =>
    function () {
      // eslint-disable-next-line prefer-rest-params
      fn.apply(fn, arguments);
      // eslint-disable-next-line prefer-rest-params
      code.apply(fn, arguments);
    };

  jsPsych.opts.on_finish = extend(jsPsych.opts.on_finish, () => {
    config.firekit.finishRun();
    if (config.experimentFinished) {
      config.experimentFinished();
    }
  });

  const roarScores = new RoarScores();
  jsPsych.opts.on_data_update = extend(jsPsych.opts.on_data_update, (data) => {
    if (data.save_trial) {
      config.firekit.writeTrial(
        data,
        roarScores.computedScoreCallback.bind(roarScores),
      );
    }
  });

  // Add a special error handler that writes javascript errors to a special trial
  // type in the Firestore database
  window.addEventListener('error', (e) => {
    const {
      msg, url, lineNo, columnNo, error,
    } = e;

    config.firekit?.writeTrial({
      lastTrial: jsPsych.data.getLastTrialData().trials[0],
      message: String(msg),
      source: url || null,
      lineNo: String(lineNo || null),
      colNo: String(columnNo || null),
      error: JSON.stringify(error || null),
      timeStamp: new Date().toISOString(),
    });
  });

  initStore(config);
};

export const initRoarTimeline = (config) => {
  const beginningTimeline = {
    timeline: getUserDataTimeline,
    on_timeline_finish: async () => {
      // eslint-disable-next-line no-param-reassign
      config.pid = config.pid || makePid();
      await config.firekit.updateUser({ assessmentPid: config.pid, labId: config.labId, ...config.userMetadata });
    },
  };

  return beginningTimeline;
};
