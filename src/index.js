// jsPsych imports
import jsPsychFullScreen from '@jspsych/plugin-fullscreen';
import jsPsychPreload from '@jspsych/plugin-preload';
import jsPsychHtmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import videoKeyboardResponse from '@jspsych/plugin-video-keyboard-response';
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
  CORRECT_KEY_PRESS,
  CORRECT_KEY_TEXT,
  WRONG_KEY_PRESS,
  WRONG_KEY_TEXT,
} from './utils';

// assets
import intro_1_video from '../assets/intro-vid-pt-1.mp4';
import intro_2_video from '../assets/intro-vid-pt-2.mp4';
import intro_3_video from '../assets/intro-vid-pt-3.mp4';
import game_instructions_1_video from '../assets/game-instructions-1.mp4';
import game_instructions_2_video from '../assets/game-instructions-2.mp4';
import game_instructions_3_video from '../assets/game-instructions-3.mp4';
import pos_instuctions_feedback_video from '../assets/instructions-fb-pos.mp4';
import neg_instuctions_feedback_video from '../assets/instructions-fb-neg.mp4';
import two_back_instructions_video from '../assets/two-back-instructions.mp4';
import three_back_instructions_video from '../assets/three-back-instructions.mp4';
import fix_robot_1_video from '../assets/fix-robot-1.mp4';
import fix_robot_2_video from '../assets/fix-robot-2.mp4';
import fix_robot_3_video from '../assets/fix-robot-3.mp4';
import fix_robot_4_video from '../assets/fix-robot-4.mp4';
import fix_robot_5_video from '../assets/fix-robot-5.mp4';
import fix_robot_6_video from '../assets/fix-robot-6.mp4';
import fix_robot_n_video from '../assets/fix-robot-n.mp4';
import end_video from '../assets/end-video.mp4';
import generic_game_break_video from '../assets/game-break.mp4';
import right_arrow_image from '../assets/right-trial-screen-arrow.png';
import left_arrow_image from '../assets/left-trial-screen-arrow.png';
import trial_screen_robot_image from '../assets/robot-no-background.png';

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
    // we look up 2 trials back because we also add a
    // visual feedback trial after the stimulus is shown
    const last_trial_correct = jsPsych.data.get().last(2).values()[0].correct;
    if (last_trial_correct) {
      return audioContent.feedbackCorrect;
    }
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
  <div class="robot-div">
  <img src="${trial_screen_robot_image}" class="stimulus-robot"></img>
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
    stimulus: drawStim(stim),
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
    },
  };

  const practice_block_visual_feedback = {
    type: jsPsychHtmlKeyboardResponse,
    is_html: true,
    stimulus: () => {
      // fetching the value of keyboard response from previous block
      const response = jsPsych.data.get().last(1).values()[0].response;
      return drawStim(stim, response);
    },
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
    // fetching the value of keyboard response from previous block
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
  left_arrow_image,
  right_arrow_image,
];

const videos = [
  intro_1_video,
  intro_2_video,
  intro_3_video,
  game_instructions_1_video,
  game_instructions_2_video,
  game_instructions_3_video,
  pos_instuctions_feedback_video,
  neg_instuctions_feedback_video,
  two_back_instructions_video,
  three_back_instructions_video,
  fix_robot_1_video,
  fix_robot_2_video,
  fix_robot_3_video,
  fix_robot_4_video,
  fix_robot_5_video,
  fix_robot_6_video,
  fix_robot_n_video,
  generic_game_break_video,
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

const intro_video_1_node = {
  stimulus: [intro_1_video],
  ...video_parameters,
};

const intro_video_2_node = {
  stimulus: [intro_2_video],
  ...video_parameters,
};

const intro_video_3_node = {
  stimulus: [intro_3_video],
  ...video_parameters,
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
    // checking if the last trial was correct to push appropriate feedback video
    const last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
    if (last_trial_correct) {
      return [pos_instuctions_feedback_video];
    }
    return [neg_instuctions_feedback_video];
  },
};

const game_instructions_1_block = {
  stimulus: [game_instructions_1_video],
  type: videoKeyboardResponse,
  trial_ends_after_video: false,
  response_allowed_while_playing: true,
  trial_duration: null,
  width: VIDEO_WIDTH,
  height: VIDEO_HEIGHT,
  data: {
    task: "practice_response",
  },
  choices: [CORRECT_KEY_PRESS, WRONG_KEY_PRESS],
  on_finish: (data) => {
    // (right_arrow) {
    //   data.correct = jsPsych.pluginAPI.compareKeys(data.response, CORRECT_KEY_PRESS);
    // } else {
    data.correct = jsPsych.pluginAPI.compareKeys(data.response, CORRECT_KEY_PRESS);
  },
};

const game_instructions_2_block = {
  stimulus: [game_instructions_2_video],
  type: videoKeyboardResponse,
  ...video_parameters,
};

const game_instructions_3_block = {
  stimulus: [game_instructions_3_video],
  type: videoKeyboardResponse,
  ...video_parameters,
};

const generic_game_break_block = {
  stimulus: [generic_game_break_video],
  type: videoKeyboardResponse,
  ...video_parameters,
};

const end_video_block = {
  stimulus: [end_video],
  type: videoKeyboardResponse,
  ...video_parameters,
};

const instructions = [
  {}, // add dummy items for intuitive indexing
  {}, // add dummy items for intuitive indexing
  {
    // two-back instructions
    video: two_back_instructions_video,
    shown: false,
  },
  {
    // three-back instructions
    video: three_back_instructions_video,
    shown: false,
  },
];

const fix_robot_videos = [
  {}, // dummy fix robot video
  fix_robot_1_video,
  fix_robot_2_video,
  fix_robot_3_video,
  fix_robot_4_video,
  fix_robot_5_video,
  fix_robot_6_video,
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
adaptive_n_back_experiment.push(intro_video_1_node);
adaptive_n_back_experiment.push(intro_video_2_node);
adaptive_n_back_experiment.push(intro_video_3_node);
// // 1-back instructions
adaptive_n_back_experiment.push(game_instructions_1_block, game_instructions_feedback_trial);
adaptive_n_back_experiment.push(game_instructions_2_block);

// practice block
adaptive_n_back_experiment = adaptive_n_back_experiment.concat(practice_trials);
adaptive_n_back_experiment.push(update_progress_bar_block);
adaptive_n_back_experiment.push(game_instructions_3_block);

if (SHOW_CONTROL_TRIALS && control_before === 0) {
  adaptive_n_back_experiment.push(start_control_block);
  adaptive_n_back_experiment = adaptive_n_back_experiment.concat(control_trials);
  adaptive_n_back_experiment.push(update_progress_bar_block);
  adaptive_n_back_experiment.push(generic_game_break_block);
}

for (let b = 1; b <= NUM_BLOCKS; b++) {
  adaptive_n_back_experiment.push(start_adaptive_block);
  adaptive_n_back_experiment.push(adaptive_test_node);
  adaptive_n_back_experiment.push(update_delay_block);

  if (b < NUM_BLOCKS) {
    const fix_robot_video_block = {
      stimulus: [(b >= fix_robot_videos.length) ? fix_robot_n_video : fix_robot_videos[b]],
      type: videoKeyboardResponse,
      ...video_parameters,
    };
    adaptive_n_back_experiment.push(fix_robot_video_block);
  }

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
  // do not show game break for last adaptive block, so we must show it before the control block
  adaptive_n_back_experiment.push(generic_game_break_block);
  adaptive_n_back_experiment.push(start_control_block);
  adaptive_n_back_experiment = adaptive_n_back_experiment.concat(control_trials);
  adaptive_n_back_experiment.push(update_progress_bar_block);
  // do not show game break since this is the final block
}

adaptive_n_back_experiment.push(post_task_block);
adaptive_n_back_experiment.push(end_video_block);

timeline.push(...adaptive_n_back_experiment);
timeline.push(exit_fullscreen);

jsPsych.run(timeline);
