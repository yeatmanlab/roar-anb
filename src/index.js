// jsPsych imports
import jsPsychFullScreen from '@jspsych/plugin-fullscreen';
import jsPsychPreload from '@jspsych/plugin-preload';
import jsPsychHtmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import videoKeyboardResponse from '@jspsych/plugin-video-keyboard-response';
import jsPsychCallFunction from '@jspsych/plugin-call-function';
import jsPsychSurveyText from '@jspsych/plugin-survey-text';
import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import {
  // CORRECT_KEY_PRESS,
  // CORRECT_KEY_TEXT,
  // WRONG_KEY_PRESS,
  // WRONG_KEY_TEXT,
  audioContent,
  preloadAudio,
} from 'roar-utils';

// Import necessary for async in the top level of the experiment script
import 'regenerator-runtime/runtime';

// CSS imports
import './css/roar.css';
import './css/custom.css';

// Local modules
import { initConfig, initRoarJsPsych, initRoarTimeline } from './config';
import {
  NUM_BLOCKS,
  ADAPTIVE_NUM_TRIALS,
  PRACTICE_NUM_TRIALS,
  CONTROL_NUM_TRIALS,
  SHOW_CONTROL_TRIALS,
  STIMULUS_FONT_SIZE,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  IGNORE_CASE,
} from './utils';

// assets
import intro_video_1 from '../assets/intro-vid-updated.mp4';
import intro_video_2 from '../assets/intro-pt-2-updated.mp4';
import intro_video_3 from '../assets/intro-pt-3-updated.mp4';
import game_instructions_1 from '../assets/game-instructions-1.mp4';
import game_instructions_2 from '../assets/game-instructions-2.mp4';
import game_instructions_3 from '../assets/game-instructions-3-new.mp4';
import pos_instuctions_feedback from '../assets/instruction-fb-pos.mp4';
import neg_instuctions_feedback from '../assets/new-wrong-arrow.mp4';
import two_back_instructions from '../assets/two-back-instructions.mp4';
import three_back_instructions from '../assets/three-back-instructions.mp4';
import fix_robot_1 from '../assets/fix-robot-1.mp4';
import fix_robot_2 from '../assets/fix-robot-2.mp4';
import fix_robot_3 from '../assets/fix-robot-3.mp4';
import fix_robot_4 from '../assets/fix-robot-4.mp4';
import fix_robot_5 from '../assets/fix-robot-5.mp4';
import fix_robot_6 from '../assets/fix-robot-6.mp4';
import fix_robot_n from '../assets/fix-robot-n.mp4';
import right_arrow_image from '../assets/right-trial-screen-arrow.png';
import left_arrow_image from '../assets/left-trial-screen-arrow.png';
import end_video from '../assets/end-video.mp4';
import generic_game_break from '../assets/game-break.mp4';
import trial_screen_robot from '../assets/robot-no-bkgrnd.png';
// import final_robot_smiling_image from '../assets/final-smiling.png';
// import final_robot_image from '../assets/final.png';

const CORRECT_KEY_PRESS = 'ArrowRight';
const CORRECT_KEY_TEXT = 'right arrow key';
const WRONG_KEY_PRESS = 'ArrowLeft';
const WRONG_KEY_TEXT = 'left arrow key';



// ---------Initialize the jsPsych object and the timeline---------
const config = await initConfig();
const jsPsych = initRoarJsPsych(config);
const timeline = initRoarTimeline(config);

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
let credit_let = true; // default to true

// task specific variables
const letters = 'bBdDgGtTvV'.split("");
const control_before = Math.round(Math.random()); // 0 control comes before test, 1, after
let block_acc = 0; // record block accuracy to determine next blocks delay
let delay = 1; // starting delay
let trials_left = 0; // counter used by adaptive_test_node
let target_trials = []; // array defining whether each trial in a block is a target trial
let current_trial = 0;
let current_block = 0;
let block_trial = 0;
let target = "";
let curr_stim = '';
let response = "";
let stims = []; // hold stims per block
const blockConfig = {
  adaptive: { trial_id: "stim", exp_stage: "adaptive" },
  control: { trial_id: "stim", exp_stage: "control" },
};

/* ************************************ */
/* Define helper functions */
/* ************************************ */
const updateProgressBar = () => {
  const total_blocks = NUM_BLOCKS + 2; // additional blocks for practice and control
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

const getInstructFeedback = () => {
  const feedback_instruct_text = 'Welcome to the experiment. This task will take around 20 minutes. Press <strong>enter</strong> to begin.';
  return `<div class = "centerbox"><p class = center-block-text>${feedback_instruct_text}</p></div>`;
};

const randomDraw = (lst) => {
  const index = Math.floor(Math.random() * (lst.length));
  return lst[index];
};

// calculates whether the last trial was correct and records the accuracy in data object
const record_acc = (data) => {
  let stim_lower = curr_stim;
  let target_lower = data.target;
  if (IGNORE_CASE) {
    stim_lower = curr_stim.toLowerCase();
    target_lower = data.target.toLowerCase();
  }

  const key = data.response;
  let correct = false;
  if (stim_lower === target_lower && jsPsych.pluginAPI.compareKeys(key, CORRECT_KEY_PRESS)) {
    correct = true;
    if (block_trial >= delay) {
      block_acc += 1;
    }
  } else if (stim_lower !== target_lower && jsPsych.pluginAPI.compareKeys(key, WRONG_KEY_PRESS)) {
    correct = true;
    if (block_trial >= delay) {
      block_acc += 1;
    }
  }
  jsPsych.data.addDataToLastTrial({
    correct: correct,
    stim: curr_stim,
    trial_num: current_trial,
  });
  current_trial += 1;
  block_trial += 1;
};

const update_delay = () => {
  const mistakes = ADAPTIVE_NUM_TRIALS - block_acc;
  if (delay >= 2) {
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

function drawStim(stim) {
  return `<div class = "centerbox"><div class = center-text><p style="font-size: ${STIMULUS_FONT_SIZE}px">${stim}</p></div></div>`;
}

const getStim = () => {
  const trial_type = target_trials.shift();
  const targets = letters.filter((x) => {
    if (IGNORE_CASE) {
      return x.toLowerCase() === target.toLowerCase();
    }
    return x === target;
  });
  const non_targets = letters.filter((x) => {
    if (IGNORE_CASE) {
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
  return drawStim(curr_stim);
};

const getLatestStim = () => stims.slice(-1)[0];

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up post task questionnaire
const post_task_block = {
  type: jsPsychSurveyText,
  data: {
    exp_id: "adaptive_n_back",
    trial_id: "post task questions",
    save_trial: true,
  },
  questions: [
    { prompt: "Please summarize what you were asked to do in this task." },
    { prompt: "Do you have any comments about this task?" },
  ],
  rows: [15, 15],
  columns: [60, 60],
};

/* define static blocks */
const feedback_instruct_block = {
  type: jsPsychHtmlKeyboardResponse,
  data: {
    trial_id: 'instruction',
  },
  stimulus: getInstructFeedback,
  choices: ['Enter'],
};

const instructions_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: (() => {
    let html = `<div class = "centerbox"><p class = "block-text">In this experiment you will see a sequence of letters presented one at a time. Your job is to respond by pressing the <strong>${CORRECT_KEY_TEXT}</strong> when the letter matches the same letter that occured some number of trials before (the number of trials is called the "delay"), otherwise you should press the <strong>${WRONG_KEY_TEXT}</strong>. The letters will be both lower and upper case. ${IGNORE_CASE ? 'You should ignore the case (so "t" matches "T"), the letters are case-insensitive' : 'You should care about the case (so "t" only matches "t" and not "T"), the letters are case-sensitive'}.</p><p class = block-text>The specific delay you should pay attention to will differ between blocks of trials, and you will be told the delay before starting a block.</p><p class = block-text>For instance, if the delay is 2, you are supposed to press the ${CORRECT_KEY_TEXT} when the current letter matches the letter that occurred 2 trials ago. If you saw the sequence: g...G...v...T...b...t...b, you would press the ${CORRECT_KEY_TEXT} on the last "t" and the last "b" and the ${WRONG_KEY_TEXT} for every other letter.</p>`;

    if (SHOW_CONTROL_TRIALS) {
      html += `<p class = block-text>On one block of trials there will be no delay. On this block you will be instructed to press the ${CORRECT_KEY_TEXT} to the presentation of a specific letter on that trial. For instance, the specific letter may be "t", in which case you would press the ${CORRECT_KEY_TEXT} to "t"${IGNORE_CASE ? 'or "T"' : ''}.</p>`;
    }

    html += `<p class = block-text>Press <strong>enter</strong> to continue.</p></div>`;

    return html;
  })(),
  data: {
    trial_id: 'instruction',
  },
  choices: ['Enter'],
};

// const instruction_node = {
//   timeline: [feedback_instruct_block, instructions_block],
// };

const end_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class = "centerbox"><p class = "center-block-text">Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  choices: ['Enter'],
  data: {
    trial_id: "end",
    exp_id: 'adaptive_n_back',
  },
  on_finish: assessPerformance,
};

const start_practice_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div class = "centerbox"><p class = "block-text">Starting practice. During practice, you should press the ${CORRECT_KEY_TEXT} when the current letter matches the letter that appeared 1 trial before. Otherwise press the ${WRONG_KEY_TEXT}</p><p class = center-block-text>You will receive feedback about whether you were correct or not during practice. There will be no feedback during the main experiment. Press <strong>enter</strong> to begin.</p></div>`,
  choices: ['Enter'],
  data: {
    trial_id: "instruction",
  },
};

const update_delay_block = {
  type: jsPsychCallFunction,
  func: update_delay,
  data: {
    trial_id: "update_delay",
  },
  timing_post_trial: 0,
};

const update_progress_bar_block = {
  type: jsPsychCallFunction,
  func: updateProgressBar,
  data: {
    trial_id: "update_progress_bar",
  },
  timing_post_trial: 0,
};

const update_target_block = {
  type: jsPsychCallFunction,
  func: update_target,
  data: {
    trial_id: "update_target",
  },
  timing_post_trial: 0,
};

const start_control_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div class = "centerbox"><p class = "block-text">In this block you do not have to match letters to previous letters. Instead, press the ${CORRECT_KEY_TEXT} everytime you see a "t" or "T" and the ${WRONG_KEY_TEXT} for all other letters.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>`,
  choices: ['Enter'],
  data: {
    trial_id: "instruction",
  },
  on_finish: () => {
    target_trials = jsPsych.randomization.repeat(['target', '0', '0'], Math.round(CONTROL_NUM_TRIALS / 3)).slice(0, CONTROL_NUM_TRIALS);
    target = 't';
  },
};

const start_adaptive_block = {
  type: jsPsychHtmlKeyboardResponse,
  data: {
    exp_stage: "adaptive",
    trial_id: "delay_text",
  },
  stimulus: `<div class = "centerbox"><p class = "block-text">In these next blocks, you should press the ${CORRECT_KEY_TEXT} when the current letter matches the letter that appeared ${delay} trials before. Otherwise press the ${WRONG_KEY_TEXT}</p><p class = "center-block-text">Press <strong>enter</strong> to begin.</p></div>`,
  choices: ['Enter'],
  on_finish: () => {
    block_trial = 0;
    stims = [];
    trials_left = ADAPTIVE_NUM_TRIALS + delay;
    target_trials = [];
    for (let i = 0; i < delay; i++) {
      target_trials.push('0');
    }
    let trials_to_add = [];
    for (let j = 0; j < (trials_left - delay); j++) {
      if (j < (Math.round(ADAPTIVE_NUM_TRIALS / 3))) {
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

const adaptive_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: getStim,
  data: () => ({
    ...blockConfig.adaptive,
    load: delay,
    target: target,
    block_num: current_block,
  }),
  choices: [CORRECT_KEY_PRESS, WRONG_KEY_PRESS],
  on_finish: (data) => {
    record_acc(data);
  },
};

const feedback_trial = {
  type: jsPsychAudioKeyboardResponse,
  choices: 'NO_KEYS',
  trial_duration: 1000,
  stimulus: () => {
    // The feedback stimulus is a dynamic parameter because we can't know in advance whether
    // the stimulus should be 'correct' or 'incorrect'.
    // Instead, this function will check the accuracy of the last response
    // and use that information to set the stimulus value on each trial.
    const last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
    if (last_trial_correct) {
      // the parameter value has to be returned from the function
      return audioContent.feedbackCorrect;
    }
    // the parameter value has to be returned from the function
    return audioContent.feedbackIncorrect;
  },
};

function drawStim(stim, direction) {
  return `<div class = "centerbox"><div class="center-text stimulus-circle">
    <p style="font-size: ${STIMULUS_FONT_SIZE}px" class="stimulus-stext">${stim}</p>
    <div class="arrow-div">
    <div class="right-arrow-div" id="${(jsPsych.pluginAPI.compareKeys(direction, "ArrowRight")) ? "arrow-bg-color" : ''}">
      <img src="${right_arrow_image}" class="right-arrow"></img>
    </div>
    <div class="left-arrow-div" id="${(jsPsych.pluginAPI.compareKeys(direction, "ArrowLeft")) ? "arrow-bg-color" : ''}">
    <img src="${left_arrow_image}" class="left-arrow"></img>
  </div>
  </div>
  </div>`;
}

// Setup 1-back practice
const practice_trials = [];
for (let i = 0; i < PRACTICE_NUM_TRIALS; i++) {
  const stim = randomDraw(letters);
  stims.push(stim);
  if (i >= 1) {
    target = stims[i - 1];
  }
  const practice_block = {
    type: jsPsychHtmlKeyboardResponse,
    is_html: true,
    stimulus: drawStim(stim, "normal"),
    data: {
      trial_id: "stim",
      exp_stage: "practice",
      stim: stim,
      target: target,
      save_trial: true,
    },
    choices: [CORRECT_KEY_PRESS, WRONG_KEY_PRESS],
    on_finish: (data) => {
      // Score the response as correct or incorrect.
      let matching_response = data.stim === data.target;
      if (IGNORE_CASE === true) {
        matching_response = data.stim.toLowerCase() === data.target.toLowerCase();
      }

      if (matching_response) {
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, CORRECT_KEY_PRESS);
      } else {
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, WRONG_KEY_PRESS);
      }
      response = data.response;
      console.log("response-1", response);
    },
  };

  const practice_block_visual_feedback = {
    type: jsPsychHtmlKeyboardResponse,
    is_html: true,
    stimulus: drawStim(stim, response),
    trial_duration: 300,
    data: {
      trial_id: "stim",
      exp_stage: "practice",
      stim: stim,
      target: target,
      save_trial: true,
    },
    choices: [],
  };

  practice_trials.push(practice_block, practice_block_visual_feedback, feedback_trial);
}

// Define control (0-back) block
const control_trials = [];
for (let i = 0; i < CONTROL_NUM_TRIALS; i++) {
  const control_block = {
    type: jsPsychHtmlKeyboardResponse,
    is_html: true,
    stimulus: getStim,
    data: {
      ...blockConfig.control,
      load: 0,
      save_trial: true,
      target: 't',
    },
    choices: [CORRECT_KEY_PRESS, WRONG_KEY_PRESS],
    on_finish: (data) => {
      record_acc(data);
      // Score the response as correct or incorrect.
      const stim = stims.slice(-1)[0];
      let matching_response = stim === 't';
      if (IGNORE_CASE) {
        matching_response = stim.toLowerCase() === 't';
      }

      if (matching_response) {
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, CORRECT_KEY_PRESS);
      } else {
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, WRONG_KEY_PRESS);
      }
    },
  };

  control_trials.push(control_block, feedback_trial);
}


const adaptive_block_visual_feedback = {
  type: jsPsychHtmlKeyboardResponse,
  is_html: true,
  stimulus: () => {
    const response = jsPsych.data.get().last(1).values()[0].response;
    return drawStim(getLatestStim(), response);
  },
  trial_duration: 300,
  data: {
    trial_id: "stim",
    exp_stage: "practice",
    stim: getLatestStim,
    target: target,
    save_trial: true,
  },
  choices: [],
};

const adaptive_test_node = {
  timeline: [update_target_block, adaptive_block, adaptive_block_visual_feedback, feedback_trial],
  loop_function: () => {
    trials_left -= 1;
    if (trials_left === 0) {
      return false;
    }
    return true;
  },
};

// trials to add gamification
 const images = [
  // final_robot_smiling_image,
  // final_robot_image,
  left_arrow_image,
  right_arrow_image,
];

const videos = [
  intro_video_1,
  intro_video_2,
  intro_video_3,
  game_instructions_1,
  game_instructions_2,
  game_instructions_3,
  pos_instuctions_feedback,
  neg_instuctions_feedback,
  two_back_instructions,
  three_back_instructions,
  fix_robot_1,
  fix_robot_2,
  fix_robot_3,
  fix_robot_4,
  fix_robot_5,
  fix_robot_6,
  fix_robot_n,
  generic_game_break,
];

const preload_videos = {
  type: jsPsychPreload,
  video: videos,
};

const preload_images = {
  type: jsPsychPreload,
  image: images,
};

const video_parameters = {
  type: videoKeyboardResponse,
  trial_ends_after_video: false,
  response_allowed_while_playing: true,
  trial_duration: null,
  choices: "ALL_KEYS",
  width: VIDEO_WIDTH,
  height: VIDEO_HEIGHT,
};

const intro_video_node_1 = {
  stimulus: [intro_video_1],
  ...video_parameters,
};

const intro_video_node_2 = {
  stimulus: [intro_video_2],
  ...video_parameters,
};

const intro_video_node_3 = {
  stimulus: [intro_video_3],
  ...video_parameters,
};

// trying to figure out how to make it so that this will push only after the neg_instructions_fb
// is pushed (and makes sure that they get it right )
const neg_instuctions_feedback_parameters = {
  type: videoKeyboardResponse,
  trial_ends_after_video: false,
  response_allowed_while_playing: true,
  trial_duration: null,
  choices: [CORRECT_KEY_PRESS, WRONG_KEY_PRESS],
  width: VIDEO_WIDTH,
  height: VIDEO_HEIGHT,
  stimulus: () => {
    const last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
    if (last_trial_correct) {
      // the parameter value has to be returned from the function
      return [""];
    }
    // the parameter value has to be returned from the function
    return [neg_instuctions_feedback];
  },
};

const game_instructions_feedback_trial = {
  type: videoKeyboardResponse,
  trial_ends_after_video: true,
  response_allowed_while_playing: true,
  trial_duration: null,
  choices: "ALL_KEYS",
  width: VIDEO_WIDTH,
  height: VIDEO_HEIGHT,
  stimulus: () => {
    const last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
    if (last_trial_correct) {
      return [pos_instuctions_feedback];
    }
    return [neg_instuctions_feedback];
      // ...neg_instuctions_feedback_parameters];
  },
};

const game_instructions = {
  stimulus: [game_instructions_1],
  type: videoKeyboardResponse,
  trial_ends_after_video: false,
  response_allowed_while_playing: true,
  trial_duration: null,
  width: 1440,
  height: 1800,
  data: {
    task: "practice_response",
    correct_response: "CORRECT_KEY_PRESS",
  },
  choices: [CORRECT_KEY_PRESS, WRONG_KEY_PRESS],
  on_finish: (data) => {
    // Score the response as correct or incorrect.
    // (right_arrow) {
    //   data.correct = jsPsych.pluginAPI.compareKeys(data.response, CORRECT_KEY_PRESS);
    // } else {
    data.correct = jsPsych.pluginAPI.compareKeys(data.response, CORRECT_KEY_PRESS);
  },
};

const game_instructions_cont1 = {
  stimulus: [game_instructions_2],
  type: videoKeyboardResponse,
  ...video_parameters,
};

const game_instructions_prac_finish = {
  stimulus: [game_instructions_3],
  type: videoKeyboardResponse,
  ...video_parameters,
};

const game_break = {
  stimulus: [generic_game_break],
  type: videoKeyboardResponse,
  ...video_parameters,
};

const instructions = [
  {}, // add dummy items for intuitive indexing 
  {
    
  }, // add dummy items for intuitive indexing 
  {
    // two-back instructions
    video: two_back_instructions,
    shown: false,
  },
  {
    // three-back instructions
    video: three_back_instructions,
    shown: false,
  },
];

const exit_fullscreen = {
  type: jsPsychFullScreen,
  fullscreen_mode: false,
  delay_after: 0,
};

// set up the experiment
let adaptive_n_back_experiment = [];

// preload assets
adaptive_n_back_experiment.push(preloadAudio);
adaptive_n_back_experiment.push(preload_videos);
adaptive_n_back_experiment.push(preload_images);
// intro videos
// adaptive_n_back_experiment.push(intro_video_node_1);
// adaptive_n_back_experiment.push(intro_video_node_2);
// adaptive_n_back_experiment.push(intro_video_node_3);
// 1-back instructions
// adaptive_n_back_experiment.push(game_instructions, game_instructions_feedback_trial);
// adaptive_n_back_experiment.push(game_instructions_cont1);

// adaptive_n_back_experiment.push(instruction_node);
// adaptive_n_back_experiment.push(start_practice_block);
// adaptive_n_back_experiment = adaptive_n_back_experiment.concat(practice_trials);
// adaptive_n_back_experiment.push(update_progress_bar_block);
// adaptive_n_back_experiment.push(game_instructions_prac_finish);

// if (SHOW_CONTROL_TRIALS && control_before === 0) {
//   adaptive_n_back_experiment.push(start_control_block);
//   adaptive_n_back_experiment = adaptive_n_back_experiment.concat(control_trials);
//   adaptive_n_back_experiment.push(update_progress_bar_block);
//   adaptive_n_back_experiment.push(game_break);
// }

for (let b = 0; b < NUM_BLOCKS; b++) {
  // adaptive_n_back_experiment.push(start_adaptive_block);
  // adaptive_n_back_experiment.push(adaptive_test_node);
  adaptive_n_back_experiment.push(update_delay_block);

  if (b < NUM_BLOCKS - 1) { adaptive_n_back_experiment.push(game_break); }

  adaptive_n_back_experiment.push(update_progress_bar_block);

  if (instructions[delay].shown !== undefined && !instructions[delay].shown) {
    const delay_back_video = {
      stimulus: [instructions[delay].video],
      ...video_parameters,
    };

    adaptive_n_back_experiment.push(delay_back_video);
    instructions[delay].shown = true;
  }
}

if (SHOW_CONTROL_TRIALS && control_before === 1) {
  // we do not show game break for the last adaptive block, so we must show it before the control block 
  adaptive_n_back_experiment.push(game_break);
  adaptive_n_back_experiment.push(start_control_block);
  adaptive_n_back_experiment = adaptive_n_back_experiment.concat(control_trials);
  adaptive_n_back_experiment.push(update_progress_bar_block);
  // do not show game break since this is the final block 
}

// set up control
adaptive_n_back_experiment.push(post_task_block);
adaptive_n_back_experiment.push(end_block);

timeline.push(...adaptive_n_back_experiment);
timeline.push(exit_fullscreen);

jsPsych.run(timeline);
 