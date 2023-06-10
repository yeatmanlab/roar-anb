// jsPsych imports
import { initJsPsych } from 'jspsych';
import jsPsychFullScreen from '@jspsych/plugin-fullscreen';
import jsPsychSurveyText from '@jspsych/plugin-survey-text';
import jsPsychSurveyMultiSelect from "@jspsych/plugin-survey-multi-select";
import jsPsychSurveyHtmlForm from "@jspsych/plugin-survey-html-form";
import Papa from 'papaparse';

// Firebase imports
import { RoarFirekit } from '@bdelab/roar-firekit';
import { roarConfig } from './firebaseConfig';
import { utils } from './utils.js';

// Add this function to create random pid used for demo version later //
const makePid = () => {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  // eslint-disable-next-line max-len
  for (let i = 0; i < 16; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }
  return text;
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

export const initConfig = async () => {
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
    firekit: null,
    skip: skip,
    audioFeedback: audioFeedback,
    utils: utils,
  };

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
  const redirect = () => {
    if (config.taskVariant === 'demo') {
      // TODO: Fix the redirect URL here by replacing the 'XXXX' in the URL below
      window.location.href = 'https://roar.stanford.edu/';
      // TODO: Replace the pipeline value here with one that you want
    } else if (config.taskVariant === 'school') {
      // TODO: Fix the redirect URL here by replacing the 'XXXX' in the URL below
      window.location.href = 'https://reading.stanford.edu/?g=XXXX&c=1'; // TO DO: ADD REDIRECT FOR SCHOOLS
      // TODO: Replace the pipeline value here with one that you want
    } else { window.location.href = 'https://roar.stanford.edu/'; }
    // Here, we refresh the page rather than redirecting back to the dashboard
    // window.location.reload();
  };
  // You can add additional pipeline-dependent redirect URLs here using
  // additional `else if` clauses.

  const jsPsych = initJsPsych({
    show_progress_bar: true,
    auto_update_progress_bar: false,
    message_progress_bar: 'Progress Complete',
    on_finish: () => {
      redirect();
    },
  });

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
  });

  const timingData = {
    start_time: config.startTime.toISOString(),
    start_time_unix: config.startTime.getTime(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  jsPsych.opts.on_data_update = extend(jsPsych.opts.on_data_update, (data) => {
    if (data.save_trial) {
      config.firekit?.writeTrial({
        timingData,
        userInfo: config.firekit?.userInfo,
        expInfo: config.utils,
        ...data,
      });
    }
  });

  // Add a special error handler that writes javascript errors to a special trial
  // type in the Firestore database
  window.addEventListener('error', (e) => {
    const {
      msg, url, lineNo, columnNo, error,
    } = e;

    config.firekit?.writeTrial({
      task: 'error',
      lastTrial: jsPsych.data.getLastTrialData().trials[0],
      message: String(msg),
      source: url || null,
      lineNo: String(lineNo || null),
      colNo: String(columnNo || null),
      error: JSON.stringify(error || null),
    });
  });

  return jsPsych;
};

export const initRoarTimeline = (config) => {
  // Enter full screen mode
  const enterFullscreen = {
    type: jsPsychFullScreen,
    fullscreen_mode: true,
    message: `<div><h1>The experiment will switch to full screen mode. <br> Click the button to continue. </h1></div>`,
    css_classes: ['jspsych-content-modified'],
  };

  const getLabId = {
    type: jsPsychSurveyText,
    questions: [
      {
        prompt: 'Lab ID:',
        name: 'labId',
        required: true,
      },
    ],
    css_classes: ['jspsych-content-modified'],
    on_finish: (data) => {
      config.labId = data.response.labId;

      const prodDoc = config.labId === 'yeatmanlab' ? ['prod', 'roar-prod'] : ['external', config.labId];
      // eslint-disable-next-line no-undef

      roarConfig.rootDoc = ROAR_DB_DOC === 'production' ? prodDoc : ['dev', 'roar-anb'];
    },
  };

  const ifGetLabId = {
    timeline: [getLabId],
    conditional_function: () => {
      if (config.taskVariant === "otherLabs") {
        if (config.labId === null) {
          return true;
        }
        const prodDoc = config.labId === 'yeatmanlab' ? ['prod', 'roar-prod'] : ['external', config.labId];
        // eslint-disable-next-line no-undef

        roarConfig.rootDoc = ROAR_DB_DOC === 'production' ? prodDoc : ['dev', 'roar-anb'];
        return false;
      }
      return false;
    },
  };

  // If the participant's ID was **not** supplied through the query string, then
  // ask the user to fill out a form with their ID, class and school.
  const getPid = {
    type: jsPsychSurveyText,
    questions: [
      {
        prompt: 'Participant ID:',
        name: 'pid',
        required: true,
      },
    ],
    css_classes: ['jspsych-content-modified'],
    on_finish: (data) => {
      config.pid = data.response.pid;
    },
  };

  const ifGetPid = {
    timeline: [getPid],
    conditional_function: function () {
      return (config.pid === null && config.userMode !== "demo");
    },
  };

  const consent_form = {
    type: jsPsychSurveyMultiSelect,
    questions: [
      {
        prompt: ` <div>
        <p class=" consent_form_title">STANFORD UNIVERSITY CONSENT FORM</p>
        <p class=" consent_form_text">
        <b>PURPOSE OF THE STUDY</b> 
        <br>
        Data collected through games in the web-browser will help researchers understand relationships between academic skills, reading proficiency, cognition, perception, and/or attitudes towards reading and school in individuals with a broad range of reading skills.
        <br><br>
        <b>STUDY PROCEDURES</b> 
        <br>
        In this study, you will be asked to complete computer tasks via a computer screen. Audio will be presented via headphones or speakers.
        <br><br>
        <b>PRIVACY AND DATA COLLECTION</b> <br>
        We will do our best to ensure your privacy. Data that is collected through this online experiment is stored separately from identifying information such as your name. For the sake of payment, sometimes we store an email address you provide, but this is stored separately from the responses that are recorded in the online experiment. Each participant is assigned a code and that is used rather than names. This is called “coded data” and we try to ensure that the identity of our research participants is kept confidential. Data collected as part of this study may be used for many years to help discover trends in the population and explore changes due to development and education. In addition, coded data may be shared online or with collaborators to allow for new and unforeseen discoveries. Researchers may choose to include coded data in publications to support findings, or they may choose to release coded data alongside findings for replicability.
        <br>
        <br>
        We will collect mouse and click, scores earned, button presses and their timestamps, or other data that may be derived from your behavior on our page. This data will be stored on servers. Incomplete data may be logged if you quit out of the experiment early. If you would like to void your data, you may request it through our contact email. 
        <br>
        <br>
        <b>COMPENSATION</b>
        <br> 
        Participation in this study is voluntary and you will not receive financial compensation.
        <br>
        <br>
        <b>RISKS, STRESS, OR DISCOMFORT</b>
        <br>
        If there is any reason to believe you are not safe to participate in any of the tasks, please contact us at <a href="url">readingresearch@stanford.edu</a>. Some people may experience some physical discomfort or boredom due to being asked to sit for long periods. For computer tasks, some people may also experience dry eyes or eye fatigue. For some tasks that are untimed, breaks can be taken as needed during the session.
        <br>
        <br>
        <b>CONTACT INFORMATION </b>
        <br>
        If you have any additional questions or concerns about our research, feel free to email us at <a href="url">readingresearch@stanford.edu</a>. We will be more than happy to help!
        <br>
        <br>
        For general information regarding questions or concerns about your rights as a research participant, please call 1-866-680-2906 to reach the Administrative Panel on Human Subjects in Medical Research, Stanford University.
        </p>
 </div>
     `,
        options: [
          `<b>I agree to participate in this research. Participation in this research is voluntary, and I can stop at any time without penalty. <br> I feel that I understand what I am getting into, and I know I am free to leave the experiment at any time by simply closing the web browser.
        </b>`],
        required: true,
        required_message: "You must check the box to continue",
        name: "Agree",
      },
    ],
  };

  // conditional timeline for consent form: will only appear if user mode or task variant = demo
  const if_consent_form = {
    timeline: [consent_form],
    conditional_function: () => Boolean((config.userMode === "demo") || ((config.taskVariant === 'otherLabs') && (config.consent === true))),
  };

  const survey_pid = {
    type: jsPsychSurveyHtmlForm,
    preamble:
        "<div><h4>Please share a bit more to help us understand your data!</h4>"
        + "<h3>This information is optional.</h3></div>",
    html: `
     <div className="item">
      <span htmlFor="instructions" class = "survey_form_text">How old are you? (Please type a number)</span>
      <input type = "text" id = "age" name="age" style = "font-size: 2vh" value=""/>
    </div>
    <br>
    <div className="item">
      <span class = "survey_form_text">What is your current grade or highest level of education?</span>
      <select id = "edu" name = "edu" style = "font-size: 2vh">
        <option value=""></option>
        <option value="prek">preK</option>
        <option value="k1">K1</option>
        <option value="k2">K2</option>
        <option value="1">Grade 1</option>
        <option value="2">Grade 2</option>
        <option value="3">Grade 3</option>
        <option value="4">Grade 4</option>
        <option value="5">Grade 5</option>
        <option value="6">Grade 6</option>
        <option value="7">Grade 7</option>
        <option value="8">Grade 8</option>
        <option value="9">Grade 9</option>
        <option value="10">Grade 10</option>
        <option value="11">Grade 11</option>
        <option value="12">Grade 12</option>
        <option value="college">College</option>
        <option value="proSchool">Professional School</option>
        <option value="gradSchool">Graduate School</option>
      </select>
    </div>
    <br>
    <div className="item">
      <span class = "survey_form_text">Is English your first language?</span>
      <select id = "ell" name = "ell" style = "font-size: 2vh">
        <option value=""></option>
        <option value="1">No</option>
        <option value="0">Yes</option>
      </select>
    </div>
    <br>
    <div className="item">
      <span class = "survey_form_text">Have you taken this game before?</span>
      <select id = "retake" name = "retake" style = "font-size: 2vh">
        <option value=""></option>
        <option value="0">No</option>
        <option value="1">Yes</option>
      </select>
    </div>
    <br>`,
    autocomplete: true,
    on_finish: (data) => {
      const tmpMetadata = {};
      // eslint-disable-next-line no-restricted-syntax
      for (const field in data.response) {
        if (data.response[field] === "") {
          tmpMetadata[field] = null;
        } else if (field === "retake" || field === "ell") {
          tmpMetadata[field] = parseInt(data.response[field], 10);
        } else {
          tmpMetadata[field] = data.response[field];
        }
      }
      tmpMetadata.grade = config.userMetadata.grade;
      config.userMetadata = tmpMetadata;
    },
  };

  const if_survey = {
    timeline: [survey_pid],
    conditional_function: () => Boolean((config.userMode === "demo") || ((config.taskVariant === 'otherLabs') && (config.consent === true))),
  };

  const config_steps = {
    timeline: [enterFullscreen, ifGetLabId, ifGetPid, if_consent_form, if_survey],
    on_timeline_finish: async () => {
      config.pid = config.pid || makePid();
      const userInfo = {
        id: config.pid,
        studyId: config.studyId,
        schoolId: config.schoolId || null,
        labId: config.labId || null,
        userMode: config.userMode || null,
        taskVariant: config.taskVariant || null,
        userMetadata: config.userMetadata,
      };

      // eslint-disable-next-line no-param-reassign
      config.firekit = new RoarFirekit({
        config: roarConfig,
        userInfo: userInfo,
        taskInfo,
      });
      await config.firekit.startRun();
    },
  };

  return [config_steps];
};

/* csv helper function */
export const readCSV = (url) =>
  new Promise((resolve) => {
    Papa.parse(url, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function (results) {
        const csv_stimuli = results.data;
        resolve(csv_stimuli);
      },
    });
  });

// ---------Initialize the jsPsych object and the timeline---------
export const config = await initConfig();
export const jsPsych = initRoarJsPsych(config);
export const timeline = initRoarTimeline(config);
