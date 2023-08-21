/* eslint-disable max-len */
// jsPsych imports
import jsPsychFullScreen from '@jspsych/plugin-fullscreen';
import jsPsychHtmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import jsPsychCallFunction from '@jspsych/plugin-call-function';
import jsPsychSurveyText from '@jspsych/plugin-survey-text';
import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import { generateAssetObject } from "@bdelab/roar-utils";
import i18next from "i18next";
import assets from '../../assets.json';
import { jsPsych } from './jsPsych';
import { utils } from '../utils';
import './i18n';

import './css/roar.css';
import './css/custom.css';

const bucketURI = 'https://storage.googleapis.com/roar-anb';
export const mediaAssets = generateAssetObject(assets, bucketURI);

const queryString = new URL(window.location).search;
const urlParams = new URLSearchParams(queryString);

const config = {
  pid: urlParams.get('participant') || null,
  studyId: urlParams.get('studyId') || null,
  labId: urlParams.get('labId') || null,
  // classId: urlParams.get('classId') || null,  // commented out as it was in the original code
  schoolId: urlParams.get('schoolId') || null,
  consent: urlParams.get('consent') || true,
  taskVariant: urlParams.get('variant') || "pilot",
  userMode: urlParams.get('mode') || "default",
  grade: urlParams.get('grade') || null,
  skip: urlParams.get('skip'),
  audioFeedback: urlParams.get('feedback') || "binary",
};
utils.NUM_BLOCKS = urlParams.get("numBlocks") || utils.NUM_BLOCKS;
utils.ADAPTIVE_NUM_TRIALS = urlParams.get("adaptiveNumTrials") || utils.ADAPTIVE_NUM_TRIALS;
utils.SHOW_CONTROL_TRIALS = urlParams.get("controlTrials") || utils.SHOW_CONTROL_TRIALS;
utils.CASING_CHOICE = urlParams.get("casingChoice") || utils.CASING_CHOICE;

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
let previous_delay = -1;
let block_acc = 0; // record block accuracy to determine next blocks delay
let delay = 1; // starting delay
let if_last_y = 0; // this is to track if the last response is y or not
let trials_left = 0; // counter used by adaptive_test_node
let target_trials = []; // array defining whether each trial in a block is a target trial
let current_trial = 0;
let current_block = 0;
let block_trial = 0;
let target = "";
let curr_stim = '';
let stims = []; // hold stims per block
const blockConfig = {
  adaptive: { trial_id: "stim", task: "test_response", pid: config.pid },
  control: { trial_id: "stim", task: "control_response", pid: config.pid },
};

// generic task variables
let credit_let = true; // default to true

// task specific variables
let letters = 'bBdDgGtTvV';
if (utils.CASING_CHOICE === 0) {
  letters = letters.toLowerCase().split("");
} else if (utils.CASING_CHOICE === 1) {
  letters = letters.toUpperCase().split("");
} else {
  letters = letters.split("");
}

/* ************************************ */
/* Define helper functions */
/* ************************************ */
const updateProgressBar = () => {
  // additional blocks for practice and control
  // eslint-disable-next-line max-len
  const total_blocks = utils.NUM_BLOCKS + 1 + Number(utils.SHOW_CONTROL_TRIALS);
  const curr_progress_bar_value = jsPsych.getProgressBarCompleted();
  jsPsych.setProgressBar(curr_progress_bar_value + 1 / total_blocks);
};

function assessPerformance() {
  /*
   * Function to calculate the "credit_let", which is a boolean
   * used to credit individual experiments in expfactory.
   */
  const experiment_data = jsPsych.data.get().filter([
    blockConfig.adaptive, blockConfig.control,
  ]);
  let missed_count = 0;
  let trial_count = 0;
  const rt_array = [];
  let rt = 0;

  // record choices participants made
  const choice_counts = {};
  choice_counts[-1] = 0;
  choice_counts[32] = 0;
  for (let i = 0; i < experiment_data.length; i++) {
    if (experiment_data[i].possible_responses !== 'none') {
      trial_count += 1;
      rt = experiment_data[i].rt;
      const key = experiment_data[i].key_press;
      choice_counts[key] += 1;
      if (rt === -1) {
        missed_count += 1;
      } else {
        rt_array.push(rt);
      }
    }
  }

  // calculate average rt
  let avg_rt = -1;
  if (rt_array.length !== 0) {
    avg_rt = Math.median(rt_array);
  }
  const missed_percent = missed_count / experiment_data.length;

  // calculate whether response distribution is okay
  let responses_ok = true;
  Object.keys(choice_counts).forEach((key) => {
    if (choice_counts[key] > trial_count * 0.85) {
      responses_ok = false;
    }
  });
  credit_let = (missed_percent < 0.4 && (avg_rt > 200) && responses_ok);
  jsPsych.data.addDataToLastTrial({ credit_let: credit_let });
}

const randomDraw = (lst) => {
  const index = Math.floor(Math.random() * (lst.length));
  return lst[index];
};

// calculates whether the last trial was correct and records the accuracy in data object
const record_acc = (data) => {
  let stim_lower = curr_stim;
  let target_lower = data.target;
  if (utils.IGNORE_CASE) {
    stim_lower = curr_stim.toLowerCase();
    target_lower = data.target.toLowerCase();
  }

  const key = data.response;
  let correct = false;
  // eslint-disable-next-line max-len
  if (stim_lower === target_lower && jsPsych.pluginAPI.compareKeys(key, utils.CORRECT_KEY_PRESS)) {
    correct = true;
    if (block_trial >= delay) {
      block_acc += 1;
    }
    // eslint-disable-next-line max-len
  } else if (stim_lower !== target_lower && jsPsych.pluginAPI.compareKeys(key, utils.WRONG_KEY_PRESS)) {
    correct = true;
    if (block_trial >= delay) {
      block_acc += 1;
    }
  }
  jsPsych.data.addDataToLastTrial({
    correct: (correct ? 1 : 0),
    stim: curr_stim,
    trialNumTotal: current_trial + 1,
  });
  current_trial += 1;
  block_trial += 1;
};

const update_delay = () => {
  const mistakes = utils.ADAPTIVE_NUM_TRIALS - block_acc;
  previous_delay = delay;
  if (delay >= 2) {
    // TODO: think about how to make this number relate to total ADAPTIVE_NUM_TRIALS
    if (mistakes < 3) {
      delay += 1;
    } else if (mistakes > 5) {
      delay -= 1;
    }
  } else if (delay === 1) {
    if (mistakes < 3) {
      delay += 1;
    }
  }
  block_acc = 0;
  current_block += 1;
};

const update_target = () => {
  if (stims.length >= delay) {
    target = stims.slice(-delay)[0];
  } else {
    target = "";
  }
};

function drawStim(stim, feedback) {
  const last_trial_data = jsPsych.data.get().last(1).values()[0];
  const direction = last_trial_data?.response || null;
  let delay_prompt_text = "";
  if (delay === 1) {
    delay_prompt_text = 'Matching back to back';
  } else {
    delay_prompt_text = delay_prompt_text.concat("Matching to the letter ", delay, " screens ago");
  }
  return ` <div class = "topcenter">
  <p class="delayprompt"> ${delay_prompt_text} </p> </div>
  <div class = "centerbox"><div class="center-text stimulus-circle"> 
    <p style="font-size: ${utils.STIMULUS_FONT_SIZE}px" class="stimulus-stext">${stim}</p>
    <div class="arrow-div">
    <div class="right-arrow-div" id="${(jsPsych.pluginAPI.compareKeys(direction, "ArrowRight") && (feedback)) ? "arrow-bg-color" : ''}">
      <img src="${mediaAssets.images.rightArrowImage}" class="right-arrow"></img>
    </div>
    <div class="left-arrow-div" id="${(jsPsych.pluginAPI.compareKeys(direction, "ArrowLeft") && (feedback)) ? "arrow-bg-color" : ''}">
    <img src="${mediaAssets.images.leftArrowImage}" class="left-arrow"></img>
    </div>
  </div>
  </div>`;
}

const getStim = () => {
  const trial_type = target_trials.shift();
  const targets = letters.filter((x) => {
    if (utils.IGNORE_CASE) {
      return x.toLowerCase() === target.toLowerCase();
    }
    return x === target;
  });
  const non_targets = letters.filter((x) => {
    if (utils.IGNORE_CASE) {
      return x.toLowerCase() !== target.toLowerCase();
    }
    return x !== target;
  });
  if (trial_type === 'target') {
    curr_stim = randomDraw(targets);
  } else {
    curr_stim = randomDraw(non_targets);
  }
  stims.push(curr_stim);
  return drawStim(curr_stim, false);
};

const getLatestStim = () => stims.slice(-1)[0];

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up post task questionnaire
export const post_task_block = {
  type: jsPsychSurveyText,
  data: {
    exp_id: "adaptive_n_back",
    trial_id: "post task questions",
    save_trial: true,
  },
  questions: [
    { prompt: i18next.t('experimentHelpers.post_task_block.text1') },
    { prompt: i18next.t('experimentHelpers.post_task_block.text2') },
  ],
  rows: [15, 15],
  columns: [60, 60],
};

export const update_delay_block = {
  type: jsPsychCallFunction,
  func: update_delay,
  data: {
    trial_id: "update_delay",
  },
  timing_post_trial: 0,
};

export const update_progress_bar_block = {
  type: jsPsychCallFunction,
  func: updateProgressBar,
  data: {
    trial_id: "update_progress_bar",
  },
  timing_post_trial: 0,
};

export const update_target_block = {
  type: jsPsychCallFunction,
  func: update_target,
  data: {
    trial_id: "update_target",
  },
  timing_post_trial: 0,
};

export const start_control_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div class = "centerbox"><h1 class = "block-text">${i18next.t('experimentHelpers.start_control_block.text1')}</div>
  <div class="press-key">${i18next.t('experimentHelpers.start_control_block.text2')}</div>`,
  choices: [" "],
  data: {
    trial_id: "instruction",
  },
  on_finish: () => {
    target_trials = jsPsych.randomization.repeat(['target', '0', '0'], Math.round(utils.CONTROL_NUM_TRIALS / 3)).slice(0, utils.CONTROL_NUM_TRIALS);
    target = 't';
  },
};

export const adaptive_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: () => getStim(),
  data: () => ({
    ...blockConfig.adaptive,
    save_trial: true,
    nBack: delay,
    target: target,
    block_num: current_block + 1,
  }),
  choices: [utils.CORRECT_KEY_PRESS, utils.WRONG_KEY_PRESS],
  on_finish: (data) => {
    record_acc(data);
  },
};

export const feedback_trial = {
  type: jsPsychAudioKeyboardResponse,
  choices: 'NO_KEYS',
  trial_duration: 1000,
  stimulus: () => {
    // The feedback stimulus is a dynamic parameter because we can't know in advance whether
    // the stimulus should be 'correct' or 'incorrect'.
    // Instead, this function will check the accuracy of the last response
    // and use that information to set the stimulus value on each trial.
    // we look up 2 trials back because we also add a
    // visual feedback trial after the stimulus is shown
    const last_trial_correct = jsPsych.data.get().last(2).values()[0].correct;
    if (last_trial_correct) {
      return mediaAssets.audio.feedbackCorrect;
    }
    return mediaAssets.audio.feedbackIncorrect;
  },
};

// Define control (0-back) block
export const control_trials = [];
for (let i = 0; i < utils.CONTROL_NUM_TRIALS; i++) {
  const control_block = {
    type: jsPsychHtmlKeyboardResponse,
    is_html: true,
    stimulus: getStim,
    data: {
      ...blockConfig.control,
      nBack: 0,
      save_trial: true,
      target: 't',
    },
    choices: [utils.CORRECT_KEY_PRESS, utils.WRONG_KEY_PRESS],
    on_finish: (data) => {
      record_acc(data);
      // Score the response as correct or incorrect.
      const stim = stims.slice(-1)[0];
      let matching_response = stim === 't';
      if (utils.IGNORE_CASE) {
        matching_response = stim.toLowerCase() === 't';
      }

      if (matching_response) {
        // eslint-disable-next-line max-len
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, utils.CORRECT_KEY_PRESS);
      } else {
        // eslint-disable-next-line max-len
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, utils.WRONG_KEY_PRESS);
      }
    },
  };

  control_trials.push(control_block, feedback_trial);
}

const adaptive_block_visual_feedback = {
  type: jsPsychHtmlKeyboardResponse,
  is_html: true,
  // fetching the value of keyboard response from previous block
  stimulus: () => drawStim(getLatestStim(), true),
  trial_duration: 300,
  data: {
    trial_id: "stim",
    task: "practice_response",
    stim: getLatestStim() || null,
    target: target,
    save_trial: false,
  },
  choices: [],
};

export const adaptive_test_node = {
  timeline: [update_target_block, adaptive_block, adaptive_block_visual_feedback, feedback_trial],
  loop_function: () => {
    trials_left -= 1;
    if (trials_left === 0) {
      return false;
    }
    return true;
  },
};

const staticStims = [
  'J',
  'F',
  'M',
  'F',
  'F',
];

function getCommonOneBackProperties(idx) {
  return {
    type: jsPsychAudioKeyboardResponse,
    choices: () => {
      const data = jsPsych.data.get().last(3).values()[0];
      if (data.correct) {
        return [data.response];
      }
      // eslint-disable-next-line max-len
      const response_is_correct_key_press = jsPsych.pluginAPI.compareKeys(data.response, utils.CORRECT_KEY_PRESS);
      // eslint-disable-next-line max-len
      return [response_is_correct_key_press ? utils.WRONG_KEY_PRESS : utils.CORRECT_KEY_PRESS];
    },
    response_allowed_while_playing: true,
    prompt: () => {
      const data = jsPsych.data.get().last(3).values()[0];
      // eslint-disable-next-line max-len
      const is_right_arrow = (jsPsych.pluginAPI.compareKeys(data.response, utils.CORRECT_KEY_PRESS));
      let correct_practice_trial_response;
      if (data.correct) {
        // eslint-disable-next-line max-len
        correct_practice_trial_response = is_right_arrow ? utils.CORRECT_KEY_PRESS : utils.WRONG_KEY_PRESS;
      } else {
        // eslint-disable-next-line max-len
        correct_practice_trial_response = is_right_arrow ? utils.WRONG_KEY_PRESS : utils.CORRECT_KEY_PRESS;
      }
      return `<div class = "background">
      <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
      </div>
      <div class="row">
        <div class="column_1">
          <img class="catleft" src="${(correct_practice_trial_response === utils.CORRECT_KEY_PRESS) ? mediaAssets.images.catRightArrowFlash : mediaAssets.images.catLeftArrowFlash}"></img>
          </div>
        <div class="text-box">
          <p class="middle"> <strong>${i18next.t('experimentHelpers.getCommonOneBackProperties.text1')}</p>
        </div>
      </div>
    <div class="press-key">${i18next.t('experimentHelpers.getCommonOneBackProperties.text2')}</div>`;
    },
  };
}

function getCommonTwoBackProperties(idx) {
  return {
    type: jsPsychAudioKeyboardResponse,
    choices: () => {
      const data = jsPsych.data.get().last(3).values()[0];
      if (data.correct) {
        return [data.response];
      }
      // eslint-disable-next-line max-len
      const response_is_correct_key_press = jsPsych.pluginAPI.compareKeys(data.response, utils.CORRECT_KEY_PRESS);
      // eslint-disable-next-line max-len
      return [response_is_correct_key_press ? utils.WRONG_KEY_PRESS : utils.CORRECT_KEY_PRESS];
    },
    response_allowed_while_playing: true,
    prompt: () => {
      const data = jsPsych.data.get().last(3).values()[0];
      // eslint-disable-next-line max-len
      const is_right_arrow = (jsPsych.pluginAPI.compareKeys(data.response, utils.CORRECT_KEY_PRESS));
      let correct_practice_trial_response;
      if (data.correct) {
        // eslint-disable-next-line max-len
        correct_practice_trial_response = is_right_arrow ? utils.CORRECT_KEY_PRESS : utils.WRONG_KEY_PRESS;
      } else {
        // eslint-disable-next-line max-len
        correct_practice_trial_response = is_right_arrow ? utils.WRONG_KEY_PRESS : utils.CORRECT_KEY_PRESS;
      }
      return `<div class = "background">
      <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
      </div>
      <div class="row">
        <div class="column_1">
          <img class="catleft" src="${(correct_practice_trial_response === utils.CORRECT_KEY_PRESS) ? mediaAssets.images.catRightArrowFlash : mediaAssets.images.catLeftArrowFlash}"></img>
          </div>
        <div class="text-box">
          <p class="middle"> <strong> Remember, press the <span class="right-arrow-blue">RIGHT arrow key when the letters match</span> and the <span class="left-arrow-red">LEFT arrow key when the letters do not match</span>.</strong> <br/> <br/> We're practicing to recognize matching letters with the one 2 screens ago. <br/> <br/> Our last screens were ${staticStims[idx]}, ${staticStims[idx - 1]}, and ${staticStims[idx - 2]}. That means you were comparing ${staticStims[idx]} and ${staticStims[idx - delay]}. You hit the ${is_right_arrow ? "right" : "left"} arrow key which is for ${is_right_arrow ? "match" : "not a match"}. <br/> <br/> ${staticStims[idx]} and ${staticStims[idx - delay]} ${(staticStims[idx] === staticStims[idx - delay]) ? "do" : "do not"} match, so that's ${data.correct ? "correct!" : "incorrect."} We'd press the ${(staticStims[idx] === staticStims[idx - delay]) ? "RIGHT arrow" : "LEFT arrow"} key. </p>
        </div>
      </div>
    <div class="press-key">Press <span class="button-text">the ${(staticStims[idx] === staticStims[idx - delay]) ? "RIGHT arrow" : "LEFT arrow"} key</span> to continue. </div>`;
    },
  };
}

export const one_back_feedback_audios = [
  [mediaAssets.audio.oneBackPrac1JCorrect, mediaAssets.audio.oneBackPrac1JIncorrect],
  [mediaAssets.audio.oneBackPrac2FCorrect, mediaAssets.audio.oneBackPrac2FIncorrect],
  [mediaAssets.audio.oneBackPrac3MCorrect, mediaAssets.audio.oneBackPrac3MIncorrect],
  [mediaAssets.audio.oneBackPrac4FCorrect, mediaAssets.audio.oneBackPrac4FIncorrect],
  [mediaAssets.audio.oneBackPrac5FCorrect, mediaAssets.audio.oneBackPrac5FIncorrect],
];

export const two_back_feedback_audios = [
  [mediaAssets.audio.twoBackPrac1JCorrect, mediaAssets.audio.twoBackPrac1JIncorrect],
  [mediaAssets.audio.twoBackPrac2FCorrect, mediaAssets.audio.twoBackPrac2FIncorrect],
  [mediaAssets.audio.twoBackPrac3MCorrect, mediaAssets.audio.twoBackPrac3MIncorrect],
  [mediaAssets.audio.twoBackPrac4FCorrect, mediaAssets.audio.twoBackPrac4FIncorrect],
  [mediaAssets.audio.twoBackPrac5FCorrect, mediaAssets.audio.twoBackPrac5FIncorrect],
];

function practiceFirstStimFeedback() {
  return {
    type: jsPsychAudioKeyboardResponse,
    choices: [utils.WRONG_KEY_PRESS],
    response_allowed_while_playing: true,
    prompt: () => {
      const data = jsPsych.data.get().last(3).values()[0];
      const is_right_arrow = (jsPsych.pluginAPI.compareKeys(data.response, utils.CORRECT_KEY_PRESS));
      return `<div class = "background">
    <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
    </div>
    <div class="row">
      <div class="column_1">
        <img class="catleft" src="${mediaAssets.images.catLeftArrowFlash}"></img>
        </div>
      <div class="text-box">
        <p class="middle"> <strong> Remember, press the <span class="right-arrow-blue">RIGHT arrow key when the letters match</span> and the <span class="left-arrow-red">LEFT arrow key when the letters do not match</span>.</strong> <br/> <br/> We're practicing to recognize matching letters ${(delay === 1) ? "back to back" : "with the one 2 screens ago"}. <br/> <br/> That means you were comparing ${staticStims[0]} and nothing because ${(delay === 1) ? "J was the first letter!" : "there weren't two screens before J yet!"} <br/> <br/> You hit the ${is_right_arrow ? "right" : "left"} arrow key which is for ${is_right_arrow ? "match" : "not a match"}! <br/> <br/> Since ${staticStims[0]} is our first letter, there's nothing for it to match to, so that's ${data.correct ? "correct." : "incorrect!"} We'd press the <span class="left-arrow-red">LEFT arrow key</span>.</p> 
      </div>
    </div>
  <div class="press-key">Press <span class="button-text">the LEFT arrow key</span> to continue. </div>`;
    },
  };
}

function practice2BackSecondStimFeedback() {
  return {
    type: jsPsychAudioKeyboardResponse,
    choices: [utils.WRONG_KEY_PRESS],
    response_allowed_while_playing: true,
    prompt: () => {
      const data = jsPsych.data.get().last(3).values()[0];
      const is_right_arrow = (jsPsych.pluginAPI.compareKeys(data.response, utils.CORRECT_KEY_PRESS));
      return `<div class = "background">
    <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
    </div>
    <div class="row">
      <div class="column_1">
        <img class="catleft" src="${mediaAssets.images.catLeftArrowFlash}"></img>
        </div>
      <div class="text-box">
        <p class="middle"> <strong> Remember, press the <span class="right-arrow-blue">RIGHT arrow key when the letters match</span> and the <span class="left-arrow-red">LEFT arrow key when the letters do not match</span>.</strong> <br/> <br/> We're practicing to recognize matching letters with the one 2 screens ago. <br/> <br/> Our last screens were ${staticStims[1]}, ${staticStims[0]}, and nothing. That means you were comparing ${staticStims[1]} and nothing since it didn't have a screen 2 before it. <br/> <br/> You hit the ${is_right_arrow ? "right" : "left"} arrow key which is for ${is_right_arrow ? "match" : "not a match"}! <br/> <br/> Since ${staticStims[1]} doesn't have anything to match to 2 screens ago, that's ${data.correct ? "correct!" : "incorrect."} We'd press the <span class="left-arrow-red">LEFT arrow key</span>.</p> 
      </div>
    </div>
  <div class="press-key">Press <span class="button-text">the LEFT arrow key</span> to continue. </div>`;
    },
  };
}

const one_back_feedback_trials = [];
const two_back_feedback_trials = [];

one_back_feedback_trials.push({
  ...practiceFirstStimFeedback(0),
  stimulus: () => {
    const correct_repsonse = jsPsych.data.get().last(3).values()[0].correct;
    if (correct_repsonse) {
      return one_back_feedback_audios[0][0];
    }
    return one_back_feedback_audios[0][1];
  },
});
two_back_feedback_trials.push({
  ...practiceFirstStimFeedback(0),
  stimulus: () => {
    const correct_repsonse = jsPsych.data.get().last(3).values()[0].correct;
    if (correct_repsonse) {
      return two_back_feedback_audios[0][0];
    }
    return two_back_feedback_audios[0][1];
  },
});
two_back_feedback_trials.push({
  ...practice2BackSecondStimFeedback(1),
  stimulus: () => {
    const correct_repsonse = jsPsych.data.get().last(3).values()[0].correct;
    if (correct_repsonse) {
      return two_back_feedback_audios[1][0];
    }
    return two_back_feedback_audios[1][1];
  },
});

for (let i = 1; i < staticStims.length; i++) {
  const one_back_feedback_audio_block = {
    ...getCommonOneBackProperties(i),
    stimulus: () => {
      const correct_response = jsPsych.data.get().last(3).values()[0].correct;
      if (correct_response) {
        return one_back_feedback_audios[i][0];
      }
      return one_back_feedback_audios[i][1];
    },
  };
  one_back_feedback_trials.push(one_back_feedback_audio_block);
}

for (let i = 2; i < staticStims.length; i++) {
  const two_back_feedback_audio_block = {
    ...getCommonTwoBackProperties(i),
    stimulus: () => {
      const correct_response = jsPsych.data.get().last(3).values()[0].correct;
      if (correct_response) {
        return two_back_feedback_audios[i][0];
      }
      return two_back_feedback_audios[i][1];
    },
  };

  two_back_feedback_trials.push(two_back_feedback_audio_block);
}

export function getNbackPracticeTrials() {
  const static_practice_trials = [];
  for (let i = 0; i < staticStims.length; i++) {
    const stim = staticStims[i];
    stims.push(stim);
    const static_practice_block = {
      type: jsPsychHtmlKeyboardResponse,
      is_html: true,
      stimulus: () => drawStim(stim, false),
      data: {
        trial_id: "stim",
        task: "practice_response",
        pid: config.pid,
        stim: stim || null,
        stimIndex: i,
        save_trial: true,
      },
      choices: [utils.CORRECT_KEY_PRESS, utils.WRONG_KEY_PRESS],
      on_finish: (data) => {
        if (data.stimIndex >= delay) {
          data.target = staticStims[data.stimIndex - delay];
        }
        // Score the response as correct or incorrect.
        let matching_response = data.stim === data.target;
        if (utils.IGNORE_CASE === true) {
          matching_response = data.stim.toLowerCase() === data.target?.toLowerCase();
        }

        if (matching_response) {
          data.correct = jsPsych.pluginAPI.compareKeys(data.response, utils.CORRECT_KEY_PRESS);
        } else {
          data.correct = jsPsych.pluginAPI.compareKeys(data.response, utils.WRONG_KEY_PRESS);
        }
      },
    };

    const static_practice_block_visual_feedback = {
      type: jsPsychHtmlKeyboardResponse,
      is_html: true,
      // fetching the value of keyboard response from previous block
      stimulus: () => drawStim(stim, true),
      trial_duration: 300,
      data: {
        trial_id: "stim",
        task: "practice_response",
        pid: config.pid,
        stim: stim,
        save_trial: false,
      },
      choices: [],
    };

    const if_one_back_practice = {
      timeline: [one_back_feedback_trials[i]],
      conditional_function: () => (delay === 1),
    };

    const if_two_back_practice = {
      timeline: [two_back_feedback_trials[i]],
      conditional_function: () => (delay === 2),
    };

    static_practice_trials.push(
      static_practice_block,
      static_practice_block_visual_feedback,
      feedback_trial,
      if_one_back_practice,
      if_two_back_practice,
    );
  }
  return static_practice_trials;
}

const instructions_trial_parameters = {
  type: jsPsychAudioKeyboardResponse,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
};

export const end_game_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: mediaAssets.audio.endGameAudio,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: `  <div class = "background">
  <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
    <img class="catleft" src="${mediaAssets.images.gameBreak9Animation}"></img>
    </div>
    <div class="text-box" style="border-radius:30%">
    <p class="middle"> <span style="font-size: 5vh; color: rgba(76,101,139,1); text-align: center; ">${i18next.t('experimentHelpers.end_game_block.text1')}</p>  
    </div>
  </div>
<div class="press-key">${i18next.t('experimentHelpers.end_game_block.text2')}</div>`,
  on_finish: assessPerformance,
};

export const instructions = [
  {}, // add dummy var for intuitive indexing
  {
    audio: mediaAssets.audio.oneBackInstructions,
    shown: false,
    prompt: `<div class = "background">
    <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
    </div>
    <div class="row">
      <div class="column_1">
      <img class="catleft" src="${mediaAssets.images.oneBackInstructionsAnimation}"></img> 
      </div>
      <div class="text-box">
      <p class="middle"> In this next round, you'll be comparing the most recent letter with the one <strong>directly before it</strong>. <br/> <br/> After each new letter you see, press the <span class="right-arrow-blue">right arrow key</span> if it matches with the one you saw <strong>1 screen ago</strong> and the <span class="left-arrow-red">left arrow key</span> if it does not. <br/> <br/> You’ll press the <span class="left-arrow-red">left arrow key (for not a match)</span> for the <strong>first letter</strong> since there isn't a screen before that one yet! </p>
      </div>
    </div>
  <div class="press-key">Press <span class="button-text">ANY KEY</span> to continue. </div>`,
  },
  {
    audio: mediaAssets.audio.twoBackInstructions,
    shown: false,
    prompt: `<div class = "background">
    <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
    </div>
    <div class="row">
      <div class="column_1">
      <img class="catleft" src="${mediaAssets.images.twoBackInstructionsAnimation}"></img>
      </div>
      <div class="text-box">
      <p class="middle"> In this next round, you'll be comparing the most recent letter with the one <strong>2 screens ago</strong>. <br/> <br/> After each new letter you see, press the <span class="right-arrow-blue">right arrow key</span> if it matches with the one you saw <strong>2 screens ago</strong> and the <span class="left-arrow-red">left arrow key</span> if it does not. <br/> <br/> You’ll press the <span class="left-arrow-red">left arrow key (for not a match)</span> for the <strong>first 2 letters</strong> since there aren’t 2 screens before those yet! </p>
      </div>
    </div>
  <div class="press-key">Press <span class="button-text">ANY KEY</span> when you're ready to do some practice. </div>`,
  },
  {
    audio: mediaAssets.audio.threeBackInstructions,
    shown: false,
    prompt: `<div class = "background">
    <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
    </div>
    <div class="row">
      <div class="column_1">
      <img class="catleft" src="${mediaAssets.images.threeBackInstructionsAnimation}"></img>
      </div>
      <div class="text-box">
      <p class="middle"> For these next ones, you'll be comparing the most recent letter with the one <strong>3 screens ago</strong>. <br/> <br/> After each new letter you see, press the <span class="right-arrow-blue">right arrow key</span> if it matches with the one you saw <strong>3 screens ago</strong> and the <span class="left-arrow-red">left arrow key</span> if it does not. <br/> <br/> You’ll press the <span class="left-arrow-red">left arrow key (for not a match)</span> for the <strong>first 3 letters</strong> since there aren’t 3 screens before those yet! </p>
      </div>
    </div>
  <div class="press-key">Press <span class="button-text">ANY KEY</span> when you're ready to get started. </div>`,
  },
];

function getDelayInstructions() {
  return {
    stimulus: () => [instructions[Math.min(delay, instructions.length - 1)].audio],
    prompt: () => [instructions[Math.min(delay, instructions.length - 1)].prompt],
    ...instructions_trial_parameters,
    on_finish: () => {
      instructions[delay].shown = true;
    },
  };
}

const if_getDelayInstructions = {
  timeline: [getDelayInstructions()],
  conditional_function: function () {
    return (if_last_y === 1);
  },
};

export function getNbackInstructions() {
  return {
    stimulus: () => [instructions[Math.min(delay, instructions.length - 1)].audio],
    prompt: () => [instructions[Math.min(delay, instructions.length - 1)].prompt],
    ...instructions_trial_parameters,
    on_finish: () => {
      instructions[delay].shown = true;
    },
  };
}

const start_adaptive_block = {
  type: jsPsychHtmlKeyboardResponse,
  data: {
    trial_id: "delay_text",
  },
  stimulus: () => `<div class = "centerbox"> <h1 class = "block-text"> Now, you're looking for matching letters between ${delay} screen${(delay === 1) ? "" : "s"}!</h1>  <p class = "block-text">You should press the <span class="right-arrow-blue">${utils.CORRECT_KEY_TEXT}</span> when the current letter matches the letter that appeared ${delay} screen${(delay === 1) ? "" : "s"} before. Otherwise, press the <span class="left-arrow-red">${utils.WRONG_KEY_TEXT}.</span></p>
  <div><p class = "block-text"><strong>${(delay <= 3) ? "Press Y if you'd like to listen to the instructions again." : ""}</strong> </p></div>, 
  <div class="press-key">Press the<span class ="button-text"> SPACE BAR</span> to begin the next round.</div>`,
  choices: [" ", "y", "n", "Y", "N"],
  on_finish: () => {
    block_trial = 0;
    stims = [];

    // adaptive trials have 'delay' more trials
    // for instance, if delay = 2, number of trials = ADAPTIVE_NUM_TRIALS + 2
    trials_left = utils.ADAPTIVE_NUM_TRIALS + delay;
    target_trials = [];
    for (let i = 0; i < delay; i++) {
      target_trials.push('0');
    }
    let trials_to_add = [];
    for (let j = 0; j < (trials_left - delay); j++) {
      if (j < (Math.round(utils.ADAPTIVE_NUM_TRIALS / 3))) {
        trials_to_add.push('target');
      } else {
        trials_to_add.push('0');
      }
    }
    trials_to_add = jsPsych.randomization.shuffle(trials_to_add);
    target_trials = target_trials.concat(trials_to_add);
    block_acc = 0;
  },
};

export const instructions_loop = {
  timeline: [if_getDelayInstructions, start_adaptive_block],
  loop_function: function (data) {
    if (jsPsych.pluginAPI.compareKeys(data.values()[data.values().length - 1].response, 'y')) {
      if_last_y = 1;
      return true;
    }
    if_last_y = 0;
    return false;
  },
};

export const exit_fullscreen = {
  type: jsPsychFullScreen,
  fullscreen_mode: false,
  delay_after: 0,
};

export const waitFor = (conditionFunction) => {
  const poll = (resolve) => {
    if (conditionFunction()) resolve();
    // eslint-disable-next-line no-unused-vars
    else setTimeout((_) => poll(resolve), 400);
  };

  return new Promise(poll);
};