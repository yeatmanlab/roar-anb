/* eslint-disable max-len */
// jsPsych imports
import jsPsychFullScreen from '@jspsych/plugin-fullscreen';
import jsPsychPreload from '@jspsych/plugin-preload';
import jsPsychHtmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import jsPsychCallFunction from '@jspsych/plugin-call-function';
import jsPsychSurveyText from '@jspsych/plugin-survey-text';
import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import {
  audioContent,
  preloadAudio,
} from 'roar-utils';

// Import necessary for async in the top level of the experiment script
import 'regenerator-runtime/runtime';

// CSS imports
import './css/roar.css';
import './css/custom.css';

// Local modules
import { config, jsPsych, timeline } from './config';

// ***** assets *****//
// images and gifs //
import right_arrow_image from '../assets/right-arrow-image.png';
import left_arrow_image from '../assets/left-arrow-image.png';
import lab_background_image from '../assets/background-image.png';
import intro_woofus_gif from '../assets/woofus-instruction-book-intro.gif';
import animated_woofus_gif from '../assets/woofus_animated.gif';
import welcome_screen_gif from '../assets/welcome-animated.gif';
import robot_intro_gif from '../assets/robot-intro.gif';
import trial_screen_gif from '../assets/trial_screen_2.gif';
import cat_right_arrow_frown_gif from '../assets/cat-right-arrow-frown.gif';
import cat_smile_gif from '../assets/cat-smile-animated.gif';
import cat_intro_gif from '../assets/cat-intro.gif';
import instructions_3_gif from '../assets/instructions-3.gif';
import cat_arrows_gif from '../assets/cat-arrows-animated.gif';
import one_back_instructions_gif from '../assets/one-back-instructions-animation.gif';
import two_back_instructions_gif from '../assets/two-back-instructions-animation.gif';
import game_break_1_gif from '../assets/game-break-1-animation.gif';
import game_break_2_gif from '../assets/game-break-2-animation.gif';
import game_break_3_gif from '../assets/game-break-3-animation.gif';
import game_break_4_gif from '../assets/game-break-4-animation.gif';
import game_break_5_gif from '../assets/game-break-5-animation.gif';
import game_break_6_gif from '../assets/game-break-6-animation.gif';
import game_break_7_gif from '../assets/game-break-7-animation.gif';
import game_break_8_gif from '../assets/game-break-8-animation.gif';
import game_break_9_gif from '../assets/game-break-9-animation.gif';
import three_back_instructions_gif from '../assets/three-back-instructions-animation.gif';
import cat_right_arrow_flash_gif from '../assets/cat-right-arrow-flash.gif';
import cat_left_arrow_flash_gif from '../assets/cat-left-arrow-flash.gif';
import ns_brain_gif from '../assets/ns_brain.gif';

// audios files //
import welcome_screen_audio from '../assets/welcome-audio.mp3';
import intro_1_audio from '../assets/intro-1-audio.mp3';
import intro_2_audio from '../assets/intro-2-audio.mp3';
import intro_3_audio from '../assets/intro-3-audio.mp3';
import intro_4_audio from '../assets/intro-4-audio.mp3';
import right_arrow_incorrect_audio from '../assets/right-arrow-incorrect-audio.mp3';
import right_arrow_correct_audio from '../assets/right-arrow-correct-audio.mp3';
import instructions_1_audio from '../assets/instructions-1-audio.mp3';
import instructions_2_audio from '../assets/instructions-2-audio.mp3';
import instructions_2_audio_casing_on from '../assets/instructions-2-audio-casing-on.mp3';
import instructions_3_audio from '../assets/instructions-3-audio.mp3';
import one_back_instructions_audio from '../assets/one-back-instructions-audio.mp3';
import one_back_prac_1J_correct_audio from '../assets/one-back-prac-1J-correct-audio.mp3';
import one_back_prac_1J_incorrect_audio from '../assets/one-back-prac-1J-incorrect-audio.mp3';
import one_back_prac_2F_correct_audio from '../assets/one-back-prac-2F-correct-audio.mp3';
import one_back_prac_2F_incorrect_audio from '../assets/one-back-prac-2F-incorrect-audio.mp3';
import one_back_prac_3M_correct_audio from '../assets/one-back-prac-3M-correct-audio.mp3';
import one_back_prac_3M_incorrect_audio from '../assets/one-back-prac-3M-incorrect-audio.mp3';
import one_back_prac_4F_correct_audio from '../assets/one-back-prac-4F-correct-audio.mp3';
import one_back_prac_4F_incorrect_audio from '../assets/one-back-prac-4F-incorrect-audio.mp3';
import one_back_prac_5F_correct_audio from '../assets/one-back-prac-5F-correct-audio.mp3';
import one_back_prac_5F_incorrect_audio from '../assets/one-back-prac-5F-incorrect-audio.mp3';
import two_back_instructions_audio from '../assets/two-back-instructions-audio.mp3';
import two_back_prac_1J_correct_audio from '../assets/two-back-prac-1J-correct-audio.mp3';
import two_back_prac_1J_incorrect_audio from '../assets/two-back-prac-1J-incorrect-audio.mp3';
import two_back_prac_2F_correct_audio from '../assets/two-back-prac-2F-correct-audio.mp3';
import two_back_prac_2F_incorrect_audio from '../assets/two-back-prac-2F-incorrect-audio.mp3';
import two_back_prac_3M_correct_audio from '../assets/two-back-prac-3M-correct-audio.mp3';
import two_back_prac_3M_incorrect_audio from '../assets/two-back-prac-3M-incorrect-audio.mp3';
import two_back_prac_4F_correct_audio from '../assets/two-back-prac-4F-correct-audio.mp3';
import two_back_prac_4F_incorrect_audio from '../assets/two-back-prac-4F-incorrect-audio.mp3';
import two_back_prac_5F_correct_audio from '../assets/two-back-prac-5F-correct-audio.mp3';
import two_back_prac_5F_incorrect_audio from '../assets/two-back-prac-5F-incorrect-audio.mp3';
import three_back_instructions_audio from '../assets/three-back-instructions-audio.mp3';
import fix_robot_1_audio from '../assets/fix-robot-1-audio.mp3';
import fix_robot_2_audio from '../assets/fix-robot-2-audio.mp3';
import fix_robot_3_audio from '../assets/fix-robot-3-audio.mp3';
import fix_robot_4_audio from '../assets/fix-robot-4-audio.mp3';
import fix_robot_5_audio from '../assets/fix-robot-5-audio.mp3';
import fix_robot_6_audio from '../assets/fix-robot-6-audio.mp3';
import fix_robot_7_audio from '../assets/fix-robot-7-audio.mp3';
import generic_game_break_audio from '../assets/generic-game-break-audio.mp3';
import level_up_audio from '../assets/level-up-audio.mp3';
import level_down_audio from '../assets/level-down-audio.mp3';
import end_game_audio from '../assets/end-game-audio.mp3';

// no story mode audios //
import ns_intro_1_audio from '../assets/ns-intro-1-audio.mp3';
import ns_intro_2_audio from '../assets/ns-intro-2-audio.mp3';
import ns_one_back_prac_1J_correct_audio from '../assets/ns-one-back-prac-1J-correct-audio.mp3';
import ns_one_back_prac_1J_incorrect_audio from '../assets/ns-one-back-prac-1J-incorrect-audio.mp3';
import ns_one_back_prac_2F_correct_audio from '../assets/ns-one-back-prac-2F-correct-audio.mp3';
import ns_one_back_prac_2F_incorrect_audio from '../assets/ns-one-back-prac-2F-incorrect-audio.mp3';
import ns_one_back_prac_3M_correct_audio from '../assets/ns-one-back-prac-3M-correct-audio.mp3';
import ns_one_back_prac_3M_incorrect_audio from '../assets/ns-one-back-prac-3M-incorrect-audio.mp3';
import ns_one_back_prac_4F_correct_audio from '../assets/ns-one-back-prac-4F-correct-audio.mp3';
import ns_one_back_prac_4F_incorrect_audio from '../assets/ns-one-back-prac-4F-incorrect-audio.mp3';
import ns_one_back_prac_5F_correct_audio from '../assets/ns-one-back-prac-5F-correct-audio.mp3';
import ns_one_back_prac_5F_incorrect_audio from '../assets/ns-one-back-prac-5F-incorrect-audio.mp3';
import ns_instructions_3_audio from '../assets/ns-instructions-3-audio.mp3';
import ns_two_back_prac_1J_correct_audio from '../assets/ns-two-back-prac-1J-correct-audio.mp3';
import ns_two_back_prac_1J_incorrect_audio from '../assets/ns-two-back-prac-1J-incorrect-audio.mp3';
import ns_two_back_prac_2F_correct_audio from '../assets/ns-two-back-prac-2F-correct-audio.mp3';
import ns_two_back_prac_2F_incorrect_audio from '../assets/ns-two-back-prac-2F-incorrect-audio.mp3';
import ns_two_back_prac_3M_correct_audio from '../assets/ns-two-back-prac-3M-correct-audio.mp3';
import ns_two_back_prac_3M_incorrect_audio from '../assets/ns-two-back-prac-3M-incorrect-audio.mp3';
import ns_two_back_prac_4F_correct_audio from '../assets/ns-two-back-prac-4F-correct-audio.mp3';
import ns_two_back_prac_4F_incorrect_audio from '../assets/ns-two-back-prac-4F-incorrect-audio.mp3';
import ns_two_back_prac_5F_correct_audio from '../assets/ns-two-back-prac-5F-correct-audio.mp3';
import ns_two_back_prac_5F_incorrect_audio from '../assets/ns-two-back-prac-5F-incorrect-audio.mp3';
import ns_level_up_audio from '../assets/ns-level-up-audio.mp3';
import ns_level_down_audio from '../assets/ns-level-down-audio.mp3';
import ns_game_break_audio_1 from '../assets/ns-game-break-1-audio.mp3';
import ns_game_break_audio_2 from '../assets/ns-game-break-2-audio.mp3';
import ns_game_break_audio_3 from '../assets/ns-game-break-3-audio.mp3';
import ns_game_break_audio_4 from '../assets/ns-game-break-4-audio.mp3';
import ns_game_break_audio_5 from '../assets/ns-game-break-5-audio.mp3';
import ns_end_game_audio from '../assets/ns-end-game-audio.mp3';

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
let credit_let = true; // default to true

// task specific variables
let letters = 'bBdDgGtTvV';
if (config.utils.CASING_CHOICE === 0) {
  letters = letters.toLowerCase().split("");
} else if (config.utils.CASING_CHOICE === 1) {
  letters = letters.toUpperCase().split("");
} else {
  letters = letters.split("");
}

const control_before = Math.round(Math.random()); // 0 control comes before test, 1, after
let block_acc = 0; // record block accuracy to determine next blocks delay
let delay = 1; // starting delay
let previous_delay = -1;
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

/* ************************************ */
/* Define helper functions */
/* ************************************ */
const updateProgressBar = () => {
  // additional blocks for practice and control
  // eslint-disable-next-line max-len
  const total_blocks = config.utils.NUM_BLOCKS + 1 + Number(config.utils.SHOW_CONTROL_TRIALS);
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
  if (config.utils.IGNORE_CASE) {
    stim_lower = curr_stim.toLowerCase();
    target_lower = data.target.toLowerCase();
  }

  const key = data.response;
  let correct = false;
  // eslint-disable-next-line max-len
  if (stim_lower === target_lower && jsPsych.pluginAPI.compareKeys(key, config.utils.CORRECT_KEY_PRESS)) {
    correct = true;
    if (block_trial >= delay) {
      block_acc += 1;
    }
  // eslint-disable-next-line max-len
  } else if (stim_lower !== target_lower && jsPsych.pluginAPI.compareKeys(key, config.utils.WRONG_KEY_PRESS)) {
    correct = true;
    if (block_trial >= delay) {
      block_acc += 1;
    }
  }
  jsPsych.data.addDataToLastTrial({
    correct: (correct ? 1 : 0),
    stim: curr_stim,
    trialNumTotal: current_trial + 1,
    target: data.target,
  });
  current_trial += 1;
  block_trial += 1;
};

const update_delay = () => {
  const mistakes = config.utils.ADAPTIVE_NUM_TRIALS - block_acc;
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
    <p style="font-size: ${config.utils.STIMULUS_FONT_SIZE}px" class="stimulus-stext">${stim}</p>
    <div class="arrow-div">
    <div class="right-arrow-div" id="${(jsPsych.pluginAPI.compareKeys(direction, "ArrowRight") && (feedback)) ? "arrow-bg-color" : ''}">
      <img src="${right_arrow_image}" class="right-arrow"></img>
    </div>
    <div class="left-arrow-div" id="${(jsPsych.pluginAPI.compareKeys(direction, "ArrowLeft") && (feedback)) ? "arrow-bg-color" : ''}">
    <img src="${left_arrow_image}" class="left-arrow"></img>
    </div>
  </div>
  </div>`;
}

const getStim = () => {
  const trial_type = target_trials.shift();
  const targets = letters.filter((x) => {
    if (config.utils.IGNORE_CASE) {
      return x.toLowerCase() === target.toLowerCase();
    }
    return x === target;
  });
  const non_targets = letters.filter((x) => {
    if (config.utils.IGNORE_CASE) {
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
  stimulus: `<div class = "centerbox"><h1 class = "block-text">In this block you do not have to match letters to previous letters.</h1><p class = "block-text"> Instead, press the <span class="right-arrow-blue">${config.utils.CORRECT_KEY_TEXT}</span> everytime you see a "t" or "T" and the <span class="left-arrow-red">${config.utils.WRONG_KEY_TEXT}</span> for all other letters.</p><p class = center-block-text>Press <strong>the space bar</strong> to begin.</p></div>
  <div class="press-key">Press the<span class ="button-text"> SPACE BAR</span> to continue. </div>`,
  choices: [" "],
  data: {
    trial_id: "instruction",
  },
  on_finish: () => {
    target_trials = jsPsych.randomization.repeat(['target', '0', '0'], Math.round(config.utils.CONTROL_NUM_TRIALS / 3)).slice(0, config.utils.CONTROL_NUM_TRIALS);
    target = 't';
  },
};

const adaptive_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: () => getStim(),
  data: () => ({
    ...blockConfig.adaptive,
    save_trial: true,
    nBack: delay,
    target: target,
    stim: curr_stim,
    block_num: current_block + 1,
    // trialnumblock, item (stim), truefalse, casing choice
  }),
  choices: [config.utils.CORRECT_KEY_PRESS, config.utils.WRONG_KEY_PRESS],
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
    // we look up 2 trials back because we also add a
    // visual feedback trial after the stimulus is shown
    const last_trial_correct = jsPsych.data.get().last(2).values()[0].correct;
    if (last_trial_correct) {
      return audioContent.feedbackCorrect;
    }
    return audioContent.feedbackIncorrect;
  },
};

// Define control (0-back) block
const control_trials = [];
for (let i = 0; i < config.utils.CONTROL_NUM_TRIALS; i++) {
  const control_block = {
    type: jsPsychHtmlKeyboardResponse,
    is_html: true,
    stimulus: getStim,
    data: {
      ...blockConfig.control,
      nBack: 0,
      save_trial: true,
      target: 't',

      config_casing_choice: config.utils.CASING_CHOICE,
    },
    choices: [config.utils.CORRECT_KEY_PRESS, config.utils.WRONG_KEY_PRESS],
    on_finish: (data) => {
      record_acc(data);
      // Score the response as correct or incorrect.
      const stim = stims.slice(-1)[0];
      let matching_response = stim === 't';
      if (config.utils.IGNORE_CASE) {
        matching_response = stim.toLowerCase() === 't';
      }

      if (matching_response) {
        // eslint-disable-next-line max-len
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, config.utils.CORRECT_KEY_PRESS);
      } else {
        // eslint-disable-next-line max-len
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, config.utils.WRONG_KEY_PRESS);
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

// trials to add gamification //
const images = [
  left_arrow_image,
  right_arrow_image,
  lab_background_image,
  intro_woofus_gif,
  animated_woofus_gif,
  welcome_screen_gif,
  robot_intro_gif,
  trial_screen_gif,
  cat_right_arrow_frown_gif,
  cat_right_arrow_flash_gif,
  cat_left_arrow_flash_gif,
  cat_smile_gif,
  cat_intro_gif,
  instructions_3_gif,
  cat_arrows_gif,
  one_back_instructions_gif,
  two_back_instructions_gif,
  game_break_1_gif,
  game_break_2_gif,
  game_break_3_gif,
  game_break_4_gif,
  game_break_5_gif,
  game_break_6_gif,
  game_break_7_gif,
  game_break_8_gif,
  game_break_9_gif,
  three_back_instructions_gif,
  ns_brain_gif,
];

const preload_images = {
  type: jsPsychPreload,
  image: images,
};

const audios = [
  welcome_screen_audio,
  intro_1_audio,
  intro_2_audio,
  intro_3_audio,
  intro_4_audio,
  right_arrow_incorrect_audio,
  right_arrow_correct_audio,
  instructions_1_audio,
  instructions_2_audio,
  instructions_3_audio,
  ns_instructions_3_audio,
  one_back_instructions_audio,
  one_back_prac_1J_correct_audio,
  one_back_prac_1J_incorrect_audio,
  one_back_prac_2F_correct_audio,
  one_back_prac_2F_incorrect_audio,
  one_back_prac_3M_correct_audio,
  one_back_prac_3M_incorrect_audio,
  one_back_prac_4F_correct_audio,
  one_back_prac_4F_incorrect_audio,
  one_back_prac_5F_correct_audio,
  one_back_prac_5F_incorrect_audio,
  two_back_instructions_audio,
  two_back_prac_1J_correct_audio,
  two_back_prac_1J_incorrect_audio,
  two_back_prac_2F_correct_audio,
  two_back_prac_2F_incorrect_audio,
  two_back_prac_3M_correct_audio,
  two_back_prac_3M_incorrect_audio,
  two_back_prac_4F_correct_audio,
  two_back_prac_4F_incorrect_audio,
  two_back_prac_5F_correct_audio,
  two_back_prac_5F_incorrect_audio,
  three_back_instructions_audio,
  fix_robot_1_audio,
  fix_robot_2_audio,
  fix_robot_3_audio,
  fix_robot_4_audio,
  fix_robot_5_audio,
  fix_robot_6_audio,
  fix_robot_7_audio,
  generic_game_break_audio,
  level_up_audio,
  level_down_audio,
  end_game_audio,
  ns_intro_1_audio,
  ns_intro_2_audio,
  ns_one_back_prac_1J_correct_audio,
  ns_one_back_prac_1J_incorrect_audio,
  ns_one_back_prac_2F_correct_audio,
  ns_one_back_prac_2F_incorrect_audio,
  ns_one_back_prac_3M_correct_audio,
  ns_one_back_prac_3M_incorrect_audio,
  ns_one_back_prac_4F_correct_audio,
  ns_one_back_prac_4F_incorrect_audio,
  ns_one_back_prac_5F_correct_audio,
  ns_one_back_prac_5F_incorrect_audio,
  ns_instructions_3_audio,
  ns_two_back_prac_1J_correct_audio,
  ns_two_back_prac_1J_incorrect_audio,
  ns_two_back_prac_2F_correct_audio,
  ns_two_back_prac_2F_incorrect_audio,
  ns_two_back_prac_3M_correct_audio,
  ns_two_back_prac_3M_incorrect_audio,
  ns_two_back_prac_4F_correct_audio,
  ns_two_back_prac_4F_incorrect_audio,
  ns_two_back_prac_5F_correct_audio,
  ns_two_back_prac_5F_incorrect_audio,
  ns_level_down_audio,
  ns_level_up_audio,
  ns_game_break_audio_1,
  ns_game_break_audio_2,
  ns_game_break_audio_3,
  ns_game_break_audio_4,
  ns_game_break_audio_5,
  ns_end_game_audio,
];

const preload_audio = {
  type: jsPsychPreload,
  audio: audios,
};

const welcome_screen_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: welcome_screen_audio,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: `<div class = "background">
  <img class = "lab-background-image" style="height: 120%; " src="${welcome_screen_gif}"></img>  
  </div>
  <div class="press-key">Press <span class = "button-text">ANY KEY</span> to get started! </div>`,
};

const intro_1_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: intro_1_audio,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${lab_background_image}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
      <img class="bookleft" src="${intro_woofus_gif}"></img>
      </div>
    <div class="text-box">
      <p class="middle"> Hi Friend! My name is Dr. Woofus and I'm Stanford's only dog scientist. Today we built our very first robot, but something doesn't look quite right. <br/> <br/> This is what the instruction book says he's <i> supposed </i> to look like.</p>
    </div>
  </div>
<div class="press-key">Press <span class = "button-text">ANY KEY</span> to see what we're working with! </div>`,
};

const intro_2_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: intro_2_audio,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${lab_background_image}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
      <img class="woofusleft" src="${robot_intro_gif}"></img>
      </div>
    <div class="text-box">
      <p class="middle"> See what I mean? Somehow his arms and legs ended up all twisted. <br/> <br/> We need your help figuring out where we went wrong. I think it's my memory that's failing me. <br/> <br/> We're going to play some memory games so you can help me fix our robot friend. </p>
    </div>
  </div>
<div class="press-key">Press <span class = "button-text">ANY KEY</span> to continue. </div>`,
};

const intro_3_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: intro_3_audio,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${lab_background_image}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
      <img class="trial-animation-left" src="${trial_screen_gif}"></img>
      </div>
    <div class="text-box">
      <p class="middle"> This is what the game will look like. Do you see any letters that match back to back? <br/> <br/> First, you'll help us reorder robot's arm and leg mix-up and then we'll improve his memory skills. <br/> <br/> Mr. Robot needs different levels of difficulty to really train all that complicated robot memory, so our instructions will change throughout. Sometimes we'll be looking for matching pairs of letters back to back and sometimes with gaps in the middle. I'll let you know when we're switching!  </p>
    </div>
  </div>
<div class="press-key">Press <span class = "button-text">ANY KEY</span> to continue. </div>`,
};

const intro_4_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: intro_4_audio,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${lab_background_image}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
      <img class="catleft" src="${cat_intro_gif}"></img>
      </div>
    <div class="text-box">
      <p class="middle"> Let's start by getting you familiar with the tools you'll use today. My assistant, Cat-rina Whiskers, will walk us through all our instructions. </p>
    </div>
  </div>
<div class="press-key">Press <span class = "button-text">ANY KEY</span> to learn how to play. </div>`,
};

const ns_intro_1_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: ns_intro_1_audio,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: `<div class="column_2_upper"> 
    <h1> Welcome to the memory activity! </h1>  
      <p> In this activity, you'll be matching letters based on the last screens you saw.</p>
      <p> The instructions will change throughout to be more or less challenging. </p>
      <p> Sometimes you’ll be looking for pairs of letters back to back and sometimes with gaps in the middle. </p>
  </div>
  <div class="column_2_lower">
    <img class="adventure_mid_break" style="height:50vh" src="${ns_brain_gif}"></img>
    <div class="press-key">Press <span class ="button-text"> ANY KEY</span> to learn more about the game.
    </div>`,
};
// TODO: add casing parameter here to change prompt/ stim
const ns_intro_2_one_back_instructions_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: ns_intro_2_audio,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: `<div> 
  <h1> Let's start with matching back to back </h1>  
  <p> You’ll use the <span class ="right-arrow-blue"><strong>right arrow key</span></strong> to say when there <span class ="right-arrow-blue"><strong>is a match</span></strong> and you'll use the <span class ="left-arrow-red"><strong>left arrow key</span></strong> to say when there <span class ="left-arrow-red"><strong>is not a match</span></strong> (you'll also press the left arrow key for the first item where there isn’t anything to match to just yet).</p>
  <p> Remember the instructions will change throughout, but for now we're matching back to back!</p>
  </div> 
  <div class="press-key">Press <span class ="button-text"> ANY KEY</span> to do a few practice matching letters back to back.
  </div>
  <div class="arrow-div">
    <div class="right-arrow-div">
      <img src="${right_arrow_image}" class="right-arrow"></img>
    </div>
    <div class="left-arrow-div">
    <img src="${left_arrow_image}" class="left-arrow"></img>
    </div>
  </div>`,
};

const intro_trial_blocks = {
  timeline: [welcome_screen_block, intro_1_block, intro_2_block, intro_3_block, intro_4_block],
};

const ns_intro_trial_blocks = {
  timeline: [ns_intro_1_block, ns_intro_2_one_back_instructions_block],
};

const instructions_1_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: instructions_1_audio,
  response_allowed_while_playing: true,
  choices: "ALL_KEYS",
  on_finish: (data) => {
    data.correct = jsPsych.pluginAPI.compareKeys(data.response, config.utils.CORRECT_KEY_PRESS);
  },
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${lab_background_image}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
      <img class="catleft" src="${cat_arrows_gif}"></img>
      </div>
    <div class="text-box">
      <p class="middle"> To play this game and help Mr. Robot, we're going to use our left and right arrow keys. Can you find yours? They'll look like the ones on my screen. Let's try it out, press your <span class ="right-arrow-blue"> RIGHT arrow key</span> to continue. </p>
    </div>
  </div>
<div class="press-key">Press the<span class ="right-arrow-blue"> RIGHT arrow key</span> to continue. </div>`,
};

const right_arrow_feedback_node = {
  type: jsPsychAudioKeyboardResponse,
  response_allowed_while_playing: true,
  trial_duration: null,
  stimulus: () => {
    const last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
    if (last_trial_correct) {
      return right_arrow_correct_audio;
    }
    return right_arrow_incorrect_audio;
  },
  choices: "ALL_KEYS",
  on_finish: (data) => {
    data.correct = jsPsych.pluginAPI.compareKeys(data.response, config.utils.CORRECT_KEY_PRESS);
  },
  prompt: () => {
    // checking if the last trial was correct to push appropriate feedback prompt
    const last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
    if (last_trial_correct) {
      return `<div class = "background">
      <img class = "lab-background-image" src="${lab_background_image}"></img>  
      </div>
      <div class="row">
        <div class="column_1">
          <img class="catleft" src="${cat_smile_gif}"></img>
          </div>
        <div class="text-box">
          <p class="middle"> Awesome job! That's correct, that's your <span class ="right-arrow-blue"> right arrow key</span>. We'll use this button to tell Mr. Robot when letters <i> do </i> match.  </p>
        </div>
      </div>
    <div class="press-key">Press <span class = "button-text">ANY KEY</span> to continue. </div>`;
    }
    return `<div class = "background">
    <img class = "lab-background-image" src="${lab_background_image}"></img>  
    </div>
    <div class="row">
      <div class="column_1">
        <img class="catleft" src="${cat_right_arrow_frown_gif}"></img>
        </div>
      <div class="text-box">
        <p class="middle"> Hmm, not quite! Let's try that again. This is the button you're looking for. </p>
      </div>
    </div>
  <div class="press-key">Press <span class ="right-arrow-blue">RIGHT arrow key</span> to continue. </div>`;
  },
};

const instructions_2_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: () => {
    if (config.utils.CASING_CHOICE === 2) {
      return instructions_2_audio_casing_on;
    }
    return instructions_2_audio;
  },
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: () => {
    if (config.utils.CASING_CHOICE === 2) {
      return `<div class = "background">
  <img class = "lab-background-image" src="${lab_background_image}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
      <img class="trial-animation-left" src="${instructions_3_gif}"></img>
      </div>
    <div class="text-box">
      <p class="middle"> Let's review how you'll use your arrow keys. Your screen is going to flash with letters and <i> <strong> for now </i> </strong> you'll tell me when the letters match back to back. You'll use your <span class="left-arrow-red"> left arrow key to tell me if the current letter does not match the last</span> and the <span class ="right-arrow-blue">right arrow key to tell me if it does match</span>. <br/> <br/> Capitalization doesn't matter, so it doesn't matter if it's a little t or a big T! <br/> <br/> Press the <span class="left-arrow-red">left arrow key</span> for the very first letter you see (to say there wasn't a match since nothing came before it!) </p>
    </div>
  </div>
<div class="press-key">Press <span class="button-text">ANY KEY</span> to practice. </div>`;
    } return `<div class = "background">
    <img class = "lab-background-image" src="${lab_background_image}"></img>  
    </div>
    <div class="row">
      <div class="column_1">
        <img class="trial-animation-left" src="${instructions_3_gif}"></img>
        </div>
      <div class="text-box">
        <p class="middle"> Let's review how you'll use your arrow keys. Your screen is going to flash with letters and <i> <strong> for now </i> </strong> you'll tell me when the letters match back to back. You'll use your <span class="left-arrow-red"> left arrow key to tell me if the current letter does not match the last</span> and the <span class ="right-arrow-blue">right arrow key to tell me if it does match</span>. <br/> <br/> Press the <span class="left-arrow-red">left arrow key</span> for the very first letter you see (to say there wasn't a match since nothing came before it!) </p>
      </div>
    </div>
  <div class="press-key">Press <span class="button-text">ANY KEY</span> to practice. </div>`;
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
      const response_is_correct_key_press = jsPsych.pluginAPI.compareKeys(data.response, config.utils.CORRECT_KEY_PRESS);
      // eslint-disable-next-line max-len
      return [response_is_correct_key_press ? config.utils.WRONG_KEY_PRESS : config.utils.CORRECT_KEY_PRESS];
    },
    response_allowed_while_playing: true,
    prompt: () => {
      const data = jsPsych.data.get().last(3).values()[0];
      // eslint-disable-next-line max-len
      const is_right_arrow = (jsPsych.pluginAPI.compareKeys(data.response, config.utils.CORRECT_KEY_PRESS));
      let correct_practice_trial_response;
      if (data.correct) {
        // eslint-disable-next-line max-len
        correct_practice_trial_response = is_right_arrow ? config.utils.CORRECT_KEY_PRESS : config.utils.WRONG_KEY_PRESS;
      } else {
        // eslint-disable-next-line max-len
        correct_practice_trial_response = is_right_arrow ? config.utils.WRONG_KEY_PRESS : config.utils.CORRECT_KEY_PRESS;
      }
      if (config.story) {
        return `<div class = "background">
      <img class = "lab-background-image" src="${lab_background_image}"></img>  
      </div>
      <div class="row">
        <div class="column_1">
          <img class="catleft" src="${(correct_practice_trial_response === config.utils.CORRECT_KEY_PRESS) ? cat_right_arrow_flash_gif : cat_left_arrow_flash_gif}"></img>
          </div>
        <div class="text-box">
          <p class="middle"> <strong> ${data.correct ? "Awesome job!" : "Almost!"} </br> </br> <span style="font-weight: normal">You hit the <span class="${is_right_arrow ? 'right-arrow-blue' : 'left-arrow-red'}">${is_right_arrow ? "right arrow key" : "left arrow key"}</span> which is for <span class="${is_right_arrow ? 'right-arrow-blue' : 'left-arrow-red'}">${is_right_arrow ? "match" : "not a match"}</span>. ${staticStims[idx]} and ${staticStims[idx - delay]} ${(staticStims[idx] === staticStims[idx - delay]) ? "do" : "do not"} match, so that's ${data.correct ? "correct!" : "incorrect."} We'd press the <span class="${staticStims[idx] === staticStims[idx - delay] ? 'right-arrow-blue' : 'left-arrow-red'}">${(staticStims[idx] === staticStims[idx - delay]) ? "RIGHT arrow key" : "LEFT arrow key"}</span>.</span></p>
        </div>
      </div>
    <div class="press-key">Press the <span class="button-text"><span class="${staticStims[idx] === staticStims[idx - delay] ? 'right-arrow-blue' : 'left-arrow-red'}">${(staticStims[idx] === staticStims[idx - delay]) ? "RIGHT arrow key" : "LEFT arrow key"}</span></span><span style="color: black"> to continue.</span></div>`;
      }
      return `<div> <h1 style="color: black; font-size: 3.5vh"> ${data.correct ? "Awesome job!" : "Almost!"}</h1> </br>
      <h3 style="color: black; font-weight: normal"> You hit the <span class="${is_right_arrow ? 'right-arrow-blue' : 'left-arrow-red'}">${is_right_arrow ? "right arrow key" : "left arrow key"}</span> which is for <span class="${is_right_arrow ? 'right-arrow-blue' : 'left-arrow-red'}">${is_right_arrow ? "match" : "not a match"}</span>. ${staticStims[idx]} and ${staticStims[idx - delay]} ${(staticStims[idx] === staticStims[idx - delay]) ? "do" : "do not"} match, so that's ${data.correct ? "correct!" : "incorrect."} We'd press the <span class="${staticStims[idx] === staticStims[idx - delay] ? 'right-arrow-blue' : 'left-arrow-red'}">${(staticStims[idx] === staticStims[idx - delay]) ? "RIGHT arrow" : "LEFT arrow"}</span> key. </h3>
    </div>
  </div>
  <div class="press-key">Press the <span class="button-text"><span class="${staticStims[idx] === staticStims[idx - delay] ? 'right-arrow-blue' : 'left-arrow-red'}">${(staticStims[idx] === staticStims[idx - delay]) ? "RIGHT arrow key" : "LEFT arrow key"}</span></span><span style="color: black"> to continue.</span></div>
  <div class="arrow-div">
    <div class="right-arrow-div">
      <img src="${right_arrow_image}" class="right-arrow"></img>
    </div>
    <div class="left-arrow-div">
    <img src="${left_arrow_image}" class="left-arrow"></img>
    </div>
  </div>`;
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
      const response_is_correct_key_press = jsPsych.pluginAPI.compareKeys(data.response, config.utils.CORRECT_KEY_PRESS);
      // eslint-disable-next-line max-len
      return [response_is_correct_key_press ? config.utils.WRONG_KEY_PRESS : config.utils.CORRECT_KEY_PRESS];
    },
    response_allowed_while_playing: true,
    prompt: () => {
      const data = jsPsych.data.get().last(3).values()[0];
      // eslint-disable-next-line max-len
      const is_right_arrow = (jsPsych.pluginAPI.compareKeys(data.response, config.utils.CORRECT_KEY_PRESS));
      let correct_practice_trial_response;
      if (data.correct) {
        // eslint-disable-next-line max-len
        correct_practice_trial_response = is_right_arrow ? config.utils.CORRECT_KEY_PRESS : config.utils.WRONG_KEY_PRESS;
      } else {
        correct_practice_trial_response = is_right_arrow ? config.utils.WRONG_KEY_PRESS : config.utils.CORRECT_KEY_PRESS;
      }
      if (config.story) {
        return `<div class = "background">
      <img class = "lab-background-image" src="${lab_background_image}"></img>  
      </div>
      <div class="row">
        <div class="column_1">
          <img class="catleft" src="${(correct_practice_trial_response === config.utils.CORRECT_KEY_PRESS) ? cat_right_arrow_flash_gif : cat_left_arrow_flash_gif}"></img>
          </div>
        <div class="text-box">
          <p class="middle"> <strong> ${data.correct ? "Awesome job!" : "Almost!"} </br> </br> <span style="font-weight: normal">You hit the <span class="${is_right_arrow ? 'right-arrow-blue' : 'left-arrow-red'}">${is_right_arrow ? "right arrow key" : "left arrow key"}</span> which is for <span class="${is_right_arrow ? 'right-arrow-blue' : 'left-arrow-red'}">${is_right_arrow ? "match" : "not a match"}</span>. <br/> <br/> ${staticStims[idx]} and ${staticStims[idx - delay]} ${(staticStims[idx] === staticStims[idx - delay]) ? "do" : "do not"} match, so that's ${data.correct ? "correct!" : "incorrect."} We'd press the <span class="${staticStims[idx] === staticStims[idx - delay] ? 'right-arrow-blue' : 'left-arrow-red'}">${(staticStims[idx] === staticStims[idx - delay]) ? "RIGHT arrow" : "LEFT arrow"}</span> key. </span></p>
        </div>
      </div>
    <div class="press-key">Press the <span class="button-text"><span class="${staticStims[idx] === staticStims[idx - delay] ? 'right-arrow-blue' : 'left-arrow-red'}">${(staticStims[idx] === staticStims[idx - delay]) ? "RIGHT arrow key" : "LEFT arrow key"}</span><span style="color: black"> to continue.</span></div>`;
      }
      return `<div>
  <h1 style="color: black; font-size: 3.5vh"> ${data.correct ? "Awesome job!" : "Almost!"}</h1> </br>
  <h3 style="color: black; font-weight: normal"> You hit the <span class="${is_right_arrow ? 'right-arrow-blue' : 'left-arrow-red'}">${is_right_arrow ? "right arrow key" : "left arrow key"}</span> which is for <span class="${is_right_arrow ? 'right-arrow-blue' : 'left-arrow-red'}">${is_right_arrow ? "match" : "not a match"}.</span> ${staticStims[idx]} and ${staticStims[idx - delay]} ${(staticStims[idx] === staticStims[idx - delay]) ? "do" : "do not"} match, so that's ${data.correct ? "correct!" : "incorrect."} We'd press the <span class="${staticStims[idx] === staticStims[idx - delay] ? 'right-arrow-blue' : 'left-arrow-red'}">${(staticStims[idx] === staticStims[idx - delay]) ? "RIGHT arrow" : "LEFT arrow"}</span> key. </h3>
  </div>
</div>
<div class="press-key">Press the <span class="button-text"><span class="${staticStims[idx] === staticStims[idx - delay] ? 'right-arrow-blue' : 'left-arrow-red'}">${(staticStims[idx] === staticStims[idx - delay]) ? "RIGHT arrow key" : "LEFT arrow key"}</span><span style="color: black"> to continue.</span></div>
<div class="arrow-div">
    <div class="right-arrow-div">
      <img src="${right_arrow_image}" class="right-arrow"></img>
    </div>
    <div class="left-arrow-div">
    <img src="${left_arrow_image}" class="left-arrow"></img>
    </div>
  </div>`;
    },
  };
}

const one_back_feedback_audios = [
  [one_back_prac_1J_correct_audio, one_back_prac_1J_incorrect_audio],
  [one_back_prac_2F_correct_audio, one_back_prac_2F_incorrect_audio],
  [one_back_prac_3M_correct_audio, one_back_prac_3M_incorrect_audio],
  [one_back_prac_4F_correct_audio, one_back_prac_4F_incorrect_audio],
  [one_back_prac_5F_correct_audio, one_back_prac_5F_incorrect_audio],
];
const ns_one_back_feedback_audios = [
  [ns_one_back_prac_1J_correct_audio, ns_one_back_prac_1J_incorrect_audio],
  [ns_one_back_prac_2F_correct_audio, ns_one_back_prac_2F_incorrect_audio],
  [ns_one_back_prac_3M_correct_audio, ns_one_back_prac_3M_incorrect_audio],
  [ns_one_back_prac_4F_correct_audio, ns_one_back_prac_4F_incorrect_audio],
  [ns_one_back_prac_5F_correct_audio, ns_one_back_prac_5F_incorrect_audio],
];

const two_back_feedback_audios = [
  [two_back_prac_1J_correct_audio, two_back_prac_1J_incorrect_audio],
  [two_back_prac_2F_correct_audio, two_back_prac_2F_incorrect_audio],
  [two_back_prac_3M_correct_audio, two_back_prac_3M_incorrect_audio],
  [two_back_prac_4F_correct_audio, two_back_prac_4F_incorrect_audio],
  [two_back_prac_5F_correct_audio, two_back_prac_5F_incorrect_audio],
];
const ns_two_back_feedback_audios = [
  [ns_two_back_prac_1J_correct_audio, ns_two_back_prac_1J_incorrect_audio],
  [ns_two_back_prac_2F_correct_audio, ns_two_back_prac_2F_incorrect_audio],
  [ns_two_back_prac_3M_correct_audio, ns_two_back_prac_3M_incorrect_audio],
  [ns_two_back_prac_4F_correct_audio, ns_two_back_prac_4F_incorrect_audio],
  [ns_two_back_prac_5F_correct_audio, ns_two_back_prac_5F_incorrect_audio],
];

function practiceFirstStimFeedback() {
  return {
    type: jsPsychAudioKeyboardResponse,
    choices: [config.utils.WRONG_KEY_PRESS],
    response_allowed_while_playing: true,
    prompt: () => {
      const data = jsPsych.data.get().last(3).values()[0];
      const is_right_arrow = (jsPsych.pluginAPI.compareKeys(data.response, config.utils.CORRECT_KEY_PRESS));
      if (config.story) {
        return `<div class = "background">
    <img class = "lab-background-image" src="${lab_background_image}"></img>  
    </div>
    <div class="row">
      <div class="column_1">
        <img class="catleft" src="${cat_left_arrow_flash_gif}"></img>
        </div>
      <div class="text-box">
        <p class="middle"> <strong> Remember, press the <span class="right-arrow-blue">RIGHT arrow key when the letters match</span> and the <span class="left-arrow-red">LEFT arrow key when the letters do not match</span>.</strong> <br/> <br/> We're practicing to recognize matching letters ${(delay === 1) ? "back to back" : "with the one 2 screens ago"}. <br/> <br/> That means you were comparing ${staticStims[0]} and nothing because ${(delay === 1) ? "J was the first letter!" : "there weren't two screens before J yet!"} <br/> <br/> You hit the <span class="${is_right_arrow ? 'right-arrow-blue' : 'left-arrow-red'}">${is_right_arrow ? "right arrow key" : "left arrow key"}</span> which is for <span class="${is_right_arrow ? 'right-arrow-blue' : 'left-arrow-red'}">${is_right_arrow ? "match" : "not a match"}</span>. <br/> <br/> Since ${staticStims[0]} is our first letter, there's nothing for it to match to, so that's ${data.correct ? "correct!" : "incorrect."} We'd press the <span class="left-arrow-red">LEFT arrow key</span>.</p> 
      </div>
    </div>
  <div class="press-key">Press the <span class="button-text"><span class="left-arrow-red">LEFT arrow key</span></span><span style="color: black"> to continue.</span></div>`;
      }
      return `<div>
      <h1 style="color: black; font-size: 3.5vh"> Remember, press the <span class="right-arrow-blue">RIGHT arrow key when the letters match</span> and the <span class="left-arrow-red">LEFT arrow key when the letters do not match</span>.</strong></h1> <br/> <br/> 
       <p> We're practicing to recognize matching letters ${(delay === 1) ? "back to back" : "with the one 2 screens ago"}. That means you were comparing ${staticStims[0]} and nothing because ${(delay === 1) ? "J was the first letter." : "there weren't two screens before J yet."} </p> 
       <p> You hit the <span class="${is_right_arrow ? 'right-arrow-blue' : 'left-arrow-red'}">${is_right_arrow ? "right" : "left"}</span> arrow key which is for <span class="${is_right_arrow ? 'right-arrow-blue' : 'left-arrow-red'}">${is_right_arrow ? "match" : "not a match"}</span>. Since ${staticStims[0]} is our first letter, there's nothing for it to match to, so that's ${data.correct ? "correct!" : "incorrect."} We'd press the <span class="left-arrow-red">LEFT arrow key</span>.</p> 
      </div>
    </div>
  <div class="press-key">Press <span class="button-text"><span class="left-arrow-red">the LEFT arrow key</span></span><span style="color: black"> to continue.</span></div>
  <div class="arrow-div">
    <div class="right-arrow-div">
      <img src="${right_arrow_image}" class="right-arrow"></img>
    </div>
    <div class="left-arrow-div">
    <img src="${left_arrow_image}" class="left-arrow"></img>
    </div>
  </div>`;
    },
  };
}

function practice2BackSecondStimFeedback() {
  return {
    type: jsPsychAudioKeyboardResponse,
    choices: [config.utils.WRONG_KEY_PRESS],
    response_allowed_while_playing: true,
    prompt: () => {
      const data = jsPsych.data.get().last(3).values()[0];
      const is_right_arrow = (jsPsych.pluginAPI.compareKeys(data.response, config.utils.CORRECT_KEY_PRESS));
      if (config.story) {
        return `<div class = "background">
    <img class = "lab-background-image" src="${lab_background_image}"></img>  
    </div>
    <div class="row">
      <div class="column_1">
        <img class="catleft" src="${cat_left_arrow_flash_gif}"></img>
        </div>
      <div class="text-box">
        <p class="middle"> We're practicing to recognize matching letters with the one 2 screens ago. <br/> <br/> Our last screens were ${staticStims[1]}, ${staticStims[0]}, and nothing. That means you were comparing ${staticStims[1]} and nothing since it didn't have a screen 2 before it. <br/> <br/> You hit the <span class="${is_right_arrow ? 'right-arrow-blue' : 'left-arrow-red'}">${is_right_arrow ? "right arrow key" : "left arrow key"}</span> which is for <span class="${is_right_arrow ? 'right-arrow-blue' : 'left-arrow-red'}">${is_right_arrow ? "match" : "not a match"}</span>. <br/> <br/> Since ${staticStims[1]} doesn't have anything to match to 2 screens ago, that's ${data.correct ? "correct!" : "incorrect."} We'd press the <span class="left-arrow-red">LEFT arrow key</span>.</p> 
      </div>
    </div>
  <div class="press-key">Press the<span class="button-text"><span class="left-arrow-red"> LEFT arrow key</span></span><span style="color: black"> to continue.</span></div>`;
      }
      return `<div>
      <h1 style="color: black; font-size: 3.5vh">We're practicing to recognize matching letters with the one 2 screens ago.</h1> <br/> <br/> Our last screens were ${staticStims[1]}, ${staticStims[0]}, and nothing. That means you were comparing ${staticStims[1]} and nothing since it didn't have a screen 2 before it. </p> 
       <p> You hit the <span class="${is_right_arrow ? 'right-arrow-blue' : 'left-arrow-red'}">${is_right_arrow ? "right arrow key" : "left arrow key"}</span> which is for <span class="${is_right_arrow ? 'right-arrow-blue' : 'left-arrow-red'}">${is_right_arrow ? "match" : "not a match"}</span>. Since ${staticStims[1]} doesn't have anything to match to 2 screens ago, that's ${data.correct ? "correct!" : "incorrect."} We'd press the <span class="left-arrow-red">LEFT arrow key</span>.</p> 
      </div>
    </div>
  <div class="press-key">Press the<span class="button-text"><span class="left-arrow-red"> LEFT arrow key</span></span><span style="color: black"> to continue.</span> </div>
  <div class="arrow-div">
  <div class="right-arrow-div">
    <img src="${right_arrow_image}" class="right-arrow"></img>
  </div>
  <div class="left-arrow-div">
  <img src="${left_arrow_image}" class="left-arrow"></img>
  </div>
</div>`;
    },
  };
}

const one_back_feedback_trials = [];
const two_back_feedback_trials = [];

one_back_feedback_trials.push({
  ...practiceFirstStimFeedback(0),
  stimulus: () => {
    const correct_repsonse = jsPsych.data.get().last(3).values()[0].correct;
    if (config.story) {
      if (correct_repsonse) {
        return one_back_feedback_audios[0][0];
      }
      return one_back_feedback_audios[0][1];
    }
    if (correct_repsonse) {
      return ns_one_back_feedback_audios[0][0];
    }
    return ns_one_back_feedback_audios[0][1];
  },
});
two_back_feedback_trials.push({
  ...practiceFirstStimFeedback(0),
  stimulus: () => {
    const correct_repsonse = jsPsych.data.get().last(3).values()[0].correct;
    if (config.story) {
      if (correct_repsonse) {
        return two_back_feedback_audios[0][0];
      }
      return two_back_feedback_audios[0][1];
    }
    if (correct_repsonse) {
      return ns_two_back_feedback_audios[0][0];
    }
    return ns_two_back_feedback_audios[0][1];
  },
});
two_back_feedback_trials.push({
  ...practice2BackSecondStimFeedback(1),
  stimulus: () => {
    const correct_repsonse = jsPsych.data.get().last(3).values()[0].correct;
    if (config.story) {
      if (correct_repsonse) {
        return two_back_feedback_audios[1][0];
      }
      return two_back_feedback_audios[1][1];
    }
    if (correct_repsonse) {
      return ns_two_back_feedback_audios[1][0];
    }
    return ns_two_back_feedback_audios[1][1];
  },
});

for (let i = 1; i < staticStims.length; i++) {
  const one_back_feedback_audio_block = {
    ...getCommonOneBackProperties(i),
    stimulus: () => {
      const correct_response = jsPsych.data.get().last(3).values()[0].correct;
      if (config.story) {
        if (correct_response) {
          return one_back_feedback_audios[i][0];
        }
        return one_back_feedback_audios[i][1];
      }
      if (correct_response) {
        return ns_one_back_feedback_audios[i][0];
      }
      return ns_one_back_feedback_audios[i][1];
    },
  };
  one_back_feedback_trials.push(one_back_feedback_audio_block);
}

for (let i = 2; i < staticStims.length; i++) {
  const two_back_feedback_audio_block = {
    ...getCommonTwoBackProperties(i),
    stimulus: () => {
      const correct_response = jsPsych.data.get().last(3).values()[0].correct;
      if (config.story) {
        if (correct_response) {
          return two_back_feedback_audios[i][0];
        }
        return two_back_feedback_audios[i][1];
      }
      if (correct_response) {
        return ns_two_back_feedback_audios[i][0];
      }
      return ns_two_back_feedback_audios[i][1];
    },
  };

  two_back_feedback_trials.push(two_back_feedback_audio_block);
}

function getNbackPracticeTrials() {
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
        story: config.story,
        audio_feedback: config.audioFeedback,
        task_variant: config.taskVariant,
        user_mode: config.userMode,
        config_num_blocks: config.utils.NUM_BLOCKS,
        config_adaptive_num_trials: config.utils.ADAPTIVE_NUM_TRIALS,
        config_show_control_trials: config.utils.SHOW_CONTROL_TRIALS,
        config_casing_choice: config.utils.CASING_CHOICE,
      },
      choices: [config.utils.CORRECT_KEY_PRESS, config.utils.WRONG_KEY_PRESS],
      on_finish: (data) => {
        if (data.stimIndex >= delay) {
          data.target = staticStims[data.stimIndex - delay];
        }
        // Score the response as correct or incorrect.
        let matching_response = data.stim === data.target;
        if (config.utils.IGNORE_CASE === true) {
          matching_response = data.stim.toLowerCase() === data.target?.toLowerCase();
        }

        if (matching_response) {
          data.correct = jsPsych.pluginAPI.compareKeys(data.response, config.utils.CORRECT_KEY_PRESS);
        } else {
          data.correct = jsPsych.pluginAPI.compareKeys(data.response, config.utils.WRONG_KEY_PRESS);
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

const instructions_3_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: () => {
    if (config.story) {
      return instructions_3_audio;
    }
    return ns_instructions_3_audio;
  },
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: () => {
    if (config.story) {
      return `<div class = "background">
  <img class = "lab-background-image" src="${lab_background_image}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
    <img class="catleft" src="${cat_smile_gif}"></img>
    </div>
    <div class="text-box">
      <p class="middle"> Awesome, now that you have the hang of it, I'm going to let you take hold of the tools! Remember that our instructions will change throughout the game, so pay careful attention! </p>
    </div>
  </div>
<div class="press-key">Press <span class="button-text">ANY KEY</span> when you're ready to begin. </div>`;
    } return `<div> 
    <h2> Awesome job, you're all finished with practice! </h2>
    <p> Press any key to get started with your first block matching back to back letters.</p>
    </div>`;
  },
};

const instructions_trial_parameters = {
  type: jsPsychAudioKeyboardResponse,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
};

const game_break_1_block = {
  type: jsPsychAudioKeyboardResponse,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  stimulus: fix_robot_1_audio,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${lab_background_image}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
    <img class="catleft" src="${game_break_1_gif}"></img>
    </div>
    <div class="text-box" style="border-radius:30%">
    <p class="middle"> <span style="font-size: 5vh; color: rgba(76,101,139,1); text-align: center; ">Look, we're a little closer!</span> <br/> <br/>Keep going. Press any key to conitnue!</p>  
    </div>
  </div>
<div class="press-key">Press <span class="button-text">ANY KEY</span> continue.</div>`,
};

const game_break_2_block = {
  type: jsPsychAudioKeyboardResponse,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  stimulus: fix_robot_2_audio,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${lab_background_image}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
    <img class="catleft" src="${game_break_2_gif}"></img>
    </div>
    <div class="text-box" style="border-radius:30%">
    <p class="middle"> <span style="font-size: 5vh; color: rgba(76,101,139,1); text-align: center; ">Amazing work!</span> <br/> <br/>Keep going. Press any button to keep working on Mr. Robot.</p>  
    </div>
  </div>
<div class="press-key">Press <span class="button-text">ANY KEY</span> continue.</div>`,
};

const game_break_3_block = {
  type: jsPsychAudioKeyboardResponse,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  stimulus: fix_robot_3_audio,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${lab_background_image}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
    <img class="catleft" src="${game_break_3_gif}"></img>
    </div>
    <div class="text-box" style="border-radius:30%">
    <p class="middle"> Wow, what a silly mistake! <br/> <br/>Keep going to help Mr. Robot! </p>  
    </div>
  </div>
<div class="press-key">Press <span class="button-text">ANY KEY</span> continue.</div>`,
};

const game_break_4_block = {
  type: jsPsychAudioKeyboardResponse,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  stimulus: fix_robot_4_audio,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${lab_background_image}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
    <img class="catleft" src="${game_break_4_gif}"></img>
    </div>
    <div class="text-box" style="border-radius:30%">
    <p class="middle"> <span style="font-size: 5vh; color: rgba(76,101,139,1); text-align: center; ">Woah, that's amazing!</span> <br/> <br/> Robot looks just like the instruction book said he would. Now, I need you to help our robot friend game some memory skills of his own. Let's do it! </p>  
    </div>
  </div>
<div class="press-key">Press <span class="button-text">ANY KEY</span> continue.</div>`,
};

const game_break_5_block = {
  type: jsPsychAudioKeyboardResponse,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  stimulus: fix_robot_5_audio,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${lab_background_image}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
    <img class="catleft" src="${game_break_5_gif}"></img>
    </div>
    <div class="text-box" style="border-radius:30%">
    <p class="middle"> Robot's memory is starting to fill up! Keep working hard. Press any button continue.</p>  
    </div>
  </div>
<div class="press-key">Press <span class="button-text">ANY KEY</span> continue.</div>`,
};

const game_break_6_block = {
  type: jsPsychAudioKeyboardResponse,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  stimulus: fix_robot_6_audio,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${lab_background_image}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
    <img class="catleft" src="${game_break_6_gif}"></img>
    </div>
    <div class="text-box" style="border-radius:30%">
    <p class="middle"> Mr. Robot is going to have an amazing memory!</p>  
    </div>
  </div>
<div class="press-key">Press <span class="button-text">ANY KEY</span> continue.</div>`,
};

const game_break_7_block = {
  type: jsPsychAudioKeyboardResponse,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  stimulus: fix_robot_7_audio,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${lab_background_image}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
    <img class="catleft" src="${game_break_7_gif}"></img>
    </div>
    <div class="text-box" style="border-radius:30%">
    <p class="middle"> His memory is really shaping up well! Press any button to keep improving Robot's memory! </p>  
    </div>
  </div>
<div class="press-key">Press <span class="button-text">ANY KEY</span> continue.</div>`,
};

const generic_game_break_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: generic_game_break_audio,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: `  <div class = "background">
  <img class = "lab-background-image" src="${lab_background_image}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
    <img class="catleft" src="${animated_woofus_gif}"></img>
    </div>
    <div class="text-box" style="border-radius:30%">
    <p class="middle"> <span style="font-size: 5vh; color: rgba(76,101,139,1); text-align: center; ">Good work!</span> <br/> <br/>You are working so hard, Mr. Robot owes you big time! Press any key to conitnue improving Robot's memory!</p>  
    </div>
  </div>
<div class="press-key">Press <span class="button-text">ANY KEY</span> continue.</div>`,
};

const end_game_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: () => {
    if (config.story) {
      return end_game_audio;
    }
    return ns_end_game_audio;
  },
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: () => {
    if (config.story) {
      return `  <div class = "background">
  <img class = "lab-background-image" src="${lab_background_image}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
    <img class="catleft" src="${game_break_9_gif}"></img>
    </div>
    <div class="text-box" style="border-radius:30%">
    <p class="middle"> <span style="font-size: 5vh; color: rgba(76,101,139,1); text-align: center; ">Look at that, Mr. Robot's memory is all full!</span> <br/> <br/>Thanks so much for all your help today. You helped us build our very first robot and we couldn't be more thankful. Press any key when you're ready to sign off!</p>  
    </div>
  </div>
<div class="press-key">Press <span class="button-text">ANY KEY</span> to sign off.</div>`;
    } return `<div>
    <h2> Awesome! </h2>
    <h3> Thank you so much for participating in our memory game! </h3>
    <div class="press-key">Press <span class ="button-text"> ANY KEY</span> to save your progress. </div>`;
  },
  on_finish: assessPerformance,
};

const level_up_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: () => {
    if (config.story) {
      return level_up_audio;
    }
    return ns_level_up_audio;
  },
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: () => {
    if (config.story) {
      return `<div class = "centerbox"> <h1 class = "block-text"> Woohoo, level up! </h1>  <p class = "block-text"> You're doing so great that Mr. Robot is ready to kick it up a notch! Press any key to see what your new instructions are.</p></div>
  <div class="press-key">Press <span class ="button-text"> ANY KEY</span> to continue. </div>`;
    }
    return `<div>
    <h2> Great work! </h2>
    <h3> We’re going to make the instructions a little more complicated. </h3>
    <div class="press-key">Press <span class ="button-text"> ANY KEY</span> to see your new instructions. </div>`;
  },
};

const level_down_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: () => {
    if (config.story) {
      return level_down_audio;
    }
    return ns_level_down_audio;
  },
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: () => {
    if (config.story) {
      return `<div class = "centerbox"> <h1 class = "block-text"> Uh oh, level down. ): </h1>  <p class = "block-text"> Robot's getting a little overwhelmed. Let's back it up for him. Press any key to see what your new instructions are </p></div>
  <div class="press-key">Press the<span class ="button-text"> ANY KEY</span> to continue. </div>`;
    }
    return `<div>
    <h2> You're doing fantastic! </h2>
    <h3> We’re going to try some matching that’s a little easier. </h3>
    <div class="press-key">Press <span class ="button-text"> ANY KEY</span> to see your new instructions. </div>`;
  },
};

const instructions = [
  {}, // add dummy var for intuitive indexing
  {
    audio: one_back_instructions_audio,
    shown: false,
    prompt: () => {
      if (config.story) {
        return `<div class = "background">
    <img class = "lab-background-image" src="${lab_background_image}"></img>  
    </div>
    <div class="row">
      <div class="column_1">
      <img class="catleft" src="${one_back_instructions_gif}"></img> 
      </div>
      <div class="text-box">
      <p class="middle"> In this next round, you'll be comparing the most recent letter with the one <strong>directly before it</strong>. <br/> <br/> After each new letter you see, press the <span class="right-arrow-blue">right arrow key</span> if it matches with the one you saw <strong>1 screen ago</strong> and the <span class="left-arrow-red">left arrow key</span> if it does not. <br/> <br/> You’ll press the <span class="left-arrow-red">left arrow key (for not a match)</span> for the <strong>first letter</strong> since there isn't a screen before that one yet! </p>
      </div>
    </div>
  <div class="press-key">Press <span class="button-text">ANY KEY</span> to continue. </div>`;
      }
      return `<div> 
      <p> In this next round, you'll be comparing the most recent letter with the one <strong>directly before it</strong>. </p>  
      <p> <br/> <br/> After each new letter you see, press the <span class="right-arrow-blue">right arrow key</span> if it matches with the one you saw <strong>1 screen ago</strong> and the <span class="left-arrow-red">left arrow key</span> if it does not.</p>
      <p> <br/> <br/> You’ll press the <span class="left-arrow-red">left arrow key (for not a match)</span> for the <strong>first letter</strong> since there isn't a screen before that one yet! </p>
      </div> 
      <div class="press-key">Press <span class ="button-text"> ANY KEY</span> to continue.
      </div>
      <div class="arrow-div">
        <div class="right-arrow-div">
          <img src="${right_arrow_image}" class="right-arrow"></img>
        </div>
        <div class="left-arrow-div">
        <img src="${left_arrow_image}" class="left-arrow"></img>
        </div>
      </div>`;
    },
  },
  {
    audio: two_back_instructions_audio,
    shown: false,
    prompt: () => {
      if (config.story) {
        return `<div class = "background">
    <img class = "lab-background-image" src="${lab_background_image}"></img>  
    </div>
    <div class="row">
      <div class="column_1">
      <img class="catleft" src="${two_back_instructions_gif}"></img>
      </div>
      <div class="text-box">
      <p class="middle"> In this next round, you'll be comparing the most recent letter with the one <strong>2 screens ago</strong>. <br/> <br/> After each new letter you see, press the <span class="right-arrow-blue">right arrow key</span> if it matches with the one you saw <strong>2 screens ago</strong> and the <span class="left-arrow-red">left arrow key</span> if it does not. <br/> <br/> You’ll press the <span class="left-arrow-red">left arrow key (for not a match)</span> for the <strong>first 2 letters</strong> since there aren’t 2 screens before those yet! </p>
      </div>
    </div>
  <div class="press-key">Press <span class="button-text">ANY KEY</span> when you're ready to do some practice. </div>`;
      } return `<div> 
    <h1> Matching to the letter 2 screens ago </h1>  
    <p> In this next round, you’ll be comparing the most recent letter with the one <strong>2 screens ago</strong>. </p> 
    <p> <br/> After each new letter you see, press the <span class="right-arrow-blue">right arrow key</span> if it matches with the one you saw <strong>2 screens ago</strong> and the <span class="left-arrow-red">left arrow key</span> if it does not.</p> 
    <p> <br/> You’ll press the <span class="left-arrow-red">left arrow key (for not a match)</span> for the <strong>first 2 letters</strong> since there aren’t 2 screens before those yet.</p>
    </div> 
    <div class="press-key">Press <span class ="button-text"> ANY KEY</span> when you're ready to do some practice.
    </div>
    <div class="arrow-div">
      <div class="right-arrow-div">
        <img src="${right_arrow_image}" class="right-arrow"></img>
      </div>
      <div class="left-arrow-div">
      <img src="${left_arrow_image}" class="left-arrow"></img>
    </div>
    </div>`;
    },
  },
  {
    audio: three_back_instructions_audio,
    shown: false,
    prompt: () => {
      if (config.story) {
        return `<div class = "background">
    <img class = "lab-background-image" src="${lab_background_image}"></img>  
    </div>
    <div class="row">
      <div class="column_1">
      <img class="catleft" src="${three_back_instructions_gif}"></img>
      </div>
      <div class="text-box">
      <p class="middle"> For these next ones, you'll be comparing the most recent letter with the one <strong>3 screens ago</strong>. <br/> <br/> After each new letter you see, press the <span class="right-arrow-blue">right arrow key</span> if it matches with the one you saw <strong>3 screens ago</strong> and the <span class="left-arrow-red">left arrow key</span> if it does not. <br/> <br/> You’ll press the <span class="left-arrow-red">left arrow key (for not a match)</span> for the <strong>first 3 letters</strong> since there aren’t 3 screens before those yet! </p>
      </div>
    </div>
  <div class="press-key">Press <span class="button-text">ANY KEY</span> when you're ready to get started. </div>`;
      } return `<div> 
      <h1> Matching to the letter 3 screens ago </h1>  
      <p> For these next ones, you'll be comparing the most recent letter with the one <strong>3 screens ago</strong>. 
      <p> <br/> <br/>After each new letter you see, press the <span class="right-arrow-blue">right arrow key</span> if it matches with the one you saw <strong>3 screens ago</strong> and the <span class="left-arrow-red">left arrow key</span> if it does not.</p>
      <p> <br/> <br/> You’ll press the <span class="left-arrow-red">left arrow key (for not a match)</span> for the <strong>first 3 letters</strong> since there aren’t 3 screens before those yet.</p>
      </div> 
      <div class="press-key">Press <span class ="button-text"> ANY KEY</span> when you're ready to get started.
      </div>
      <div class="arrow-div">
        <div class="right-arrow-div">
          <img src="${right_arrow_image}" class="right-arrow"></img>
        </div>
        <div class="left-arrow-div">
        <img src="${left_arrow_image}" class="left-arrow"></img>
      </div>
      </div>`;
    },
  },
];

function getDelayInstructions() {
  return {
    stimulus: () => instructions[Math.min(delay, instructions.length - 1)].audio,
    prompt: () => instructions[Math.min(delay, instructions.length - 1)].prompt(),
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

function getNbackInstructions() {
  return {
    stimulus: () => [instructions[Math.min(delay, instructions.length - 1)].audio],
    prompt: () => [instructions[Math.min(delay, instructions.length - 1)].prompt()],
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
  stimulus: () => `<div class = "centerbox"> <h1 class = "block-text"> Now, you're looking for matching letters between ${delay} screen${(delay === 1) ? "" : "s"}!</h1>  <p class = "block-text">You should press the <span class="right-arrow-blue">${config.utils.CORRECT_KEY_TEXT}</span> when the current letter matches the letter that appeared ${delay} screen${(delay === 1) ? "" : "s"} before. Otherwise, press the <span class="left-arrow-red">${config.utils.WRONG_KEY_TEXT}.</span></p>
  <div><p class = "block-text"><strong>${(delay <= 3) ? "Press Y if you'd like to listen to the instructions again." : ""}</strong> </p></div>, 
  <div class="press-key">Press the<span class ="button-text"> SPACE BAR</span> to begin the next round.</div>`,
  choices: [" ", "y", "n", "Y", "N"],
  on_finish: () => {
    block_trial = 0;
    stims = [];

    // adaptive trials have 'delay' more trials
    // for instance, if delay = 2, number of trials = ADAPTIVE_NUM_TRIALS + 2
    trials_left = config.utils.ADAPTIVE_NUM_TRIALS + delay;
    target_trials = [];
    for (let i = 0; i < delay; i++) {
      target_trials.push('0');
    }
    let trials_to_add = [];
    for (let j = 0; j < (trials_left - delay); j++) {
      if (j < (Math.round(config.utils.ADAPTIVE_NUM_TRIALS / 3))) {
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

const ns_game_break_audios = [ns_game_break_audio_1, ns_game_break_audio_2, ns_game_break_audio_3, ns_game_break_audio_4, ns_game_break_audio_5];
let current_audio_index = 0;

const ns_game_break = {
  type: jsPsychAudioKeyboardResponse,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  stimulus: () => {
    if (current_audio_index < ns_game_break_audios.length) {
      return ns_game_break_audios[current_audio_index];
    // eslint-disable-next-line no-else-return
    } else {
      return null; // Return null if at the end of the array
    }
  },
  prompt: () => {
    if (current_audio_index < ns_game_break_audios.length) {
      return `<div>
      <h2> Great work, you're making progress! Only ${config.utils.NUM_BLOCKS - (current_block)} ${(config.utils.NUM_BLOCKS - (current_block) === 1) ? "block" : "blocks"} left!</h2> <br/> <br/> <h3> Keep going. Press any key to continue!</h3>
      </div>
      <div class="press-key">Press <span class="button-text">ANY KEY</span> to continue.</div>`;
    }
    return `<div>
      <h2> Great work, you've completed all blocks!</h2>
      </div>`;
  },
  on_finish: () => {
    current_audio_index++;
  },
};

const instructions_loop = {
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

const game_break_blocks = [
  {}, // dummy fix robot video
  {
    timeline: [game_break_1_block],
  },
  {
    timeline: [game_break_2_block],
  },
  {
    timeline: [game_break_3_block],
  },
  {
    timeline: [game_break_4_block],
  },
  {
    timeline: [game_break_5_block],
  },
  {
    timeline: [game_break_6_block],
  },
  {
    timeline: [game_break_7_block],
  },
  {
    timeline: [generic_game_break_block],
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
adaptive_n_back_experiment.push(preload_audio);
adaptive_n_back_experiment.push(preloadAudio);
adaptive_n_back_experiment.push(preload_images);

// intro trials
if (config.story) {
  adaptive_n_back_experiment.push(intro_trial_blocks);
} else {
  adaptive_n_back_experiment.push(ns_intro_trial_blocks);
}

// beginning instruction trials
if (config.story) {
  adaptive_n_back_experiment.push(instructions_1_block);
}

// having player find right arrow key
const right_arrow_redo = {
  timeline: [right_arrow_feedback_node],
  loop_function: function () {
    const last_trial_correct = jsPsych.data.get().last(2).values()[0].correct;
    if (last_trial_correct) {
      return false;
    }
    return true;
  },
};
if (config.story) {
  adaptive_n_back_experiment.push(right_arrow_redo);
}
if (config.story) {
  adaptive_n_back_experiment.push(instructions_2_block);
}

// practice block for one back //
adaptive_n_back_experiment = adaptive_n_back_experiment.concat(getNbackPracticeTrials(1));
adaptive_n_back_experiment.push(update_progress_bar_block);
adaptive_n_back_experiment.push(instructions_3_block);

if (config.utils.SHOW_CONTROL_TRIALS && control_before === 0) {
  adaptive_n_back_experiment.push(start_control_block);
  adaptive_n_back_experiment = adaptive_n_back_experiment.concat(control_trials);
  adaptive_n_back_experiment.push(update_progress_bar_block);
  adaptive_n_back_experiment.push(generic_game_break_block);
}

for (let b = 1; b <= config.utils.NUM_BLOCKS; b++) {
  adaptive_n_back_experiment.push(instructions_loop);
  adaptive_n_back_experiment.push(adaptive_test_node);
  adaptive_n_back_experiment.push(update_delay_block);

  if (b < config.utils.NUM_BLOCKS) {
    const grab_game_break_node = {
      timeline: [(b >= game_break_blocks.length) ? generic_game_break_block : game_break_blocks[b]],
      conditional_function: () => config.story,
    };

    const ns_game_break_node = {
      timeline: [ns_game_break],
      conditional_function: () => !config.story,
    };

    const if_level_up_node = {
      timeline: [level_up_block],
      conditional_function: () => (delay - previous_delay > 0),
    };

    const if_level_down_node = {
      timeline: [level_down_block],
      conditional_function: () => (delay - previous_delay < 0),
    };

    adaptive_n_back_experiment.push(
      {
        timeline: [grab_game_break_node,
          ns_game_break_node,
          if_level_up_node,
          if_level_down_node],
      },
    );
  }

  adaptive_n_back_experiment.push(update_progress_bar_block);

  const delay_back_instruction_trial = getNbackInstructions(delay);

  const code_practice = {
    timeline: [...getNbackPracticeTrials(delay)],
    conditional_function: () => (delay === 2),
  };

  const if_delay_back_shown = {
    timeline: [delay_back_instruction_trial, code_practice],
    conditional_function: () => delay < instructions.length
      && instructions[delay].shown !== undefined
      && !instructions[delay].shown,
  };
  adaptive_n_back_experiment.push(if_delay_back_shown);
}

if (config.utils.SHOW_CONTROL_TRIALS && control_before === 1) {
  // do not show game break for last adaptive block, so we must show it before the control block
  adaptive_n_back_experiment.push(generic_game_break_block);
  adaptive_n_back_experiment.push(start_control_block);
  adaptive_n_back_experiment = adaptive_n_back_experiment.concat(control_trials);
  adaptive_n_back_experiment.push(update_progress_bar_block);
  // do not show game break since this is the final block
}

adaptive_n_back_experiment.push(end_game_block);
adaptive_n_back_experiment.push(post_task_block);

timeline.push(...adaptive_n_back_experiment);
timeline.push(exit_fullscreen);

jsPsych.run(timeline);
