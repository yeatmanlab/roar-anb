// jsPsych imports
import jsPsychFullScreen from '@jspsych/plugin-fullscreen';
import jsPsychHtmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import jsPsychCallFunction from '@jspsych/plugin-call-function';
import jsPsychSurveyText from '@jspsych/plugin-survey-text';

// Import necessary for async in the top level of the experiment script
import 'regenerator-runtime/runtime';

// CSS imports
import './css/roar.css';

// Local modules
import { initConfig, initRoarJsPsych, initRoarTimeline } from './config';

import { allTargets, preloadImages } from './loadAssets';

// ---------Initialize the jsPsych object and the timeline---------
const config = await initConfig();
const jsPsych = initRoarJsPsych(config);
const timeline = initRoarTimeline(config);

/* ************************************ */
/* Define helper functions */
/* ************************************ */
function assessPerformance() {
  /* Function to calculate the "credit_var", which is a boolean used to
  credit individual experiments in expfactory. */
  var experiment_data = [];    // TODO: change the trial type and fix this function jsPsych.data.getTrialsOfType('poldrack-single-stim')
  var missed_count = 0
  var trial_count = 0
  var rt_array = []
  var rt = 0
    //record choices participants made
  var choice_counts = {}
  choice_counts[-1] = 0
  choice_counts[32] = 0
  for (var i = 0; i < experiment_data.length; i++) {
    if (experiment_data[i].possible_responses != 'none') {
      trial_count += 1
      rt = experiment_data[i].rt
      key = experiment_data[i].key_press
      choice_counts[key] += 1
      if (rt == -1) {
        missed_count += 1
      } else {
        rt_array.push(rt)
      }
    }
  }
  //calculate average rt
  var avg_rt = -1
  if (rt_array.length !== 0) {
    avg_rt = math.median(rt_array)
  } 
  var missed_percent = missed_count/experiment_data.length
  //calculate whether response distribution is okay
  var responses_ok = true
  Object.keys(choice_counts).forEach(function(key, index) {
    if (choice_counts[key] > trial_count * 0.85) {
      responses_ok = false
    }
  })
  credit_var = (missed_percent < 0.4 && (avg_rt > 200) && responses_ok)
  jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
}

var getInstructFeedback = function() {
  return '<div class = "centerbox"><p class = center-block-text>' + feedback_instruct_text +
    '</p></div>'
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
};


//Calculates whether the last trial was correct and records the accuracy in data object
var record_acc = function(data) {
  var target_lower = data.target.toLowerCase()
  var stim_lower = curr_stim.toLowerCase(0)
  var key = data.response
  let correct = false;
  if (stim_lower == target_lower && jsPsych.pluginAPI.compareKeys(key, "ArrowLeft")) {
    correct = true
    if (block_trial >= delay) {
      block_acc += 1
    }
  } else if (stim_lower != target_lower && jsPsych.pluginAPI.compareKeys(key, "ArrowRight")) {
    correct = true
    if (block_trial >= delay) {
      block_acc += 1
    }
  }
  jsPsych.data.addDataToLastTrial({
    correct: correct,
    stim: curr_stim,
    trial_num: current_trial
  })
  current_trial = current_trial + 1
  block_trial = block_trial + 1
};

var update_delay = function() {
  var mistakes = base_num_trials - block_acc
  if (delay >= 2) {
    if (mistakes < 3) {
      delay += 1
    } else if (mistakes > 5) {
      delay -= 1
    }
  } else if (delay == 1) {
    if (mistakes < 3) {
      delay += 1
    }
  }
  block_acc = 0
  current_block += 1
};

var update_target = function() {
  if (stims.length >= delay) {
    target = stims.slice(-delay)[0]
  } else {
    target = ""
  }
};

var getStim = function() {
  var trial_type = target_trials.shift()
  var targets = letters.filter(function(x) { return x.toLowerCase() == target.toLowerCase()})
  var non_targets = letters.filter(function(x) { return x.toLowerCase() != target.toLowerCase()})
  if (trial_type === 'target') {
    curr_stim = randomDraw(targets)
  } else {
    curr_stim = randomDraw(non_targets)
  }
  stims.push(curr_stim)
  return '<div class = "centerbox"><div class = "center-text"><p>' + curr_stim + '</p></div></div>'
}

var getData = function() {
  return {
    trial_id: "stim",
    exp_stage: "adaptive",
    load: delay,
    target: target,
    block_num: current_block
  }
}

var getText = function() {
  return '<div class = "centerbox"><p class = "block-text">In these next blocks, you should press the left arrow key when the current letter matches the letter that appeared ' +
  delay +
    ' trials before. Otherwise press the down arrow key</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
// TODO: check what's this being used for
var credit_var = true //default to true

// task specific variables
var letters = 'bBdDgGtTvV'.split("")
// var num_blocks = 20 // number of adaptive blocks
// var base_num_trials = 20 // total num_trials = base + load 
// var control_num_trials = 42
// TODO: uncomment the above 3 lines and delete the 3 below
var num_blocks = 2 // number of adaptive blocks
var base_num_trials = 2 // total num_trials = base + load 
var control_num_trials = 3
var control_before = Math.round(Math.random()) //0 control comes before test, 1, after
var block_acc = 0 // record block accuracy to determine next blocks delay
var delay = 2 // starting delay
var trials_left = 0 // counter used by adaptive_test_node
var target_trials = [] // array defining whether each trial in a block is a target trial
var current_trial = 0
var current_block = 0  
var block_trial = 0
var target = ""
var curr_stim = ''
var stims = [] //hold stims per block

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
//Set up post task questionnaire
var post_task_block = {
  type: jsPsychSurveyText,
  data: {
    exp_id: "adaptive_n_back",
    trial_id: "post task questions"
  },
  questions: [
    { prompt: "Please summarize what you were asked to do in this task." },
    { prompt: "Do you have any comments about this task?" }
  ],
  rows: [15, 15],
  columns: [60,60]
};

/* define static blocks */
var feedback_instruct_text =
  'Welcome to the experiment. This task will take around 20 minutes. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
  type: jsPsychHtmlKeyboardResponse,
  data: {
    trial_id: 'instruction'
  },
  stimulus: getInstructFeedback,
  choices: ['Enter']
};

var end_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class = "centerbox"><p class = "center-block-text">Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  choices: ['Enter'],
  data: {
    trial_id: "end",
    exp_id: 'adaptive_n_back'
  },
  on_finish: assessPerformance
};

var start_practice_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class = "centerbox"><p class = "block-text">Starting practice. During practice, you should press the left arrow key when the current letter matches the letter that appeared 1 trial before. Otherwise press the down arrow key</p><p class = center-block-text>You will receive feedback about whether you were correct or not during practice. There will be no feedback during the main experiment. Press <strong>enter</strong> to begin.</p></div>',
  choices: ['Enter'],
  data: {
    trial_id: "instruction",
  },
};

var update_delay_block = {
  type: jsPsychCallFunction,
  func: update_delay,
  data: {
    trial_id: "update_delay"
  },
  timing_post_trial: 0
}

var update_target_block = {
  type: jsPsychCallFunction,
  func: update_target,
  data: {
    trial_id: "update_target"
  },
  timing_post_trial: 0
}

var start_control_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class = "centerbox"><p class = "block-text">In this block you do not have to match letters to previous letters. Instead, press the left arrow key everytime you see a "t" or "T" and the down arrow key for all other letters.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  choices: ['Enter'],
  data: {
    trial_id: "instruction"
  },
  on_finish: function() {
    target_trials = jsPsych.randomization.repeat(['target','0', '0'], Math.round(control_num_trials/3)).slice(0,control_num_trials)
    target = 't'
  }
};

var start_adaptive_block = {
  type: jsPsychHtmlKeyboardResponse,
  data: {
    exp_stage: "adaptive",
    trial_id: "delay_text"
  },
  stimulus: getText,
  choices: ['Enter'],
  on_finish: function() {
    block_trial = 0
    stims = []
    trials_left = base_num_trials + delay
    target_trials = []
    for (var i = 0; i < delay; i++) {
      target_trials.push('0')
    }
    var trials_to_add = []
    for ( var j = 0; j < (trials_left - delay); j++) {
      if (j < (Math.round(base_num_trials/3))) {
        trials_to_add.push('target')
      } else {
        trials_to_add.push('0')
      }
    }
    trials_to_add = jsPsych.randomization.shuffle(trials_to_add)
    target_trials = target_trials.concat(trials_to_add)
    block_acc = 0;
  }
};

var adaptive_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: getStim,
  data: getData,
  choices: ['ArrowLeft', 'ArrowRight'],
  on_finish: function(data) {
    record_acc(data);
  }
};

var feedback_trial = {
  type: jsPsychHtmlKeyboardResponse,
  choices: 'NO_KEYS',
  trial_duration: 1000,
  stimulus: function(){
    // The feedback stimulus is a dynamic parameter because we can't know in advance whether
    // the stimulus should be 'correct' or 'incorrect'.
    // Instead, this function will check the accuracy of the last response and use that information to set
    // the stimulus value on each trial.
    var last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
    if(last_trial_correct){
    return '<div class = "centerbox"><div style="color:green;font-size:60px"; class = center-text>Correct!</div></div>'; // the parameter value has to be returned from the function
    } else {
    return '<div class = "centerbox"><div style="color:red;font-size:60px"; class = center-text>Wrong!</div></div>'; // the parameter value has to be returned from the function
    }
  }
}

//Setup 1-back practice
const practice_trials = []
for (var i = 0; i < (base_num_trials + 1); i++) {
  var stim = randomDraw(letters)
  stims.push(stim)
  if (i >= 1) {
    target = stims[i - 1]
  }
  let practice_block = {
    type: jsPsychHtmlKeyboardResponse,
    is_html: true,
    stimulus: '<div class = "centerbox"><div class = center-text><p>' + stim + '</p></div></div>',
    data: {
      trial_id: "stim",
      exp_stage: "practice",
      stim: stim,
      target: target
    },
    choices: ['ArrowLeft', 'ArrowRight'],
    on_finish: function(data){
      // Score the response as correct or incorrect.
      const matching_response = stim.toLowerCase(0) == target.toLowerCase();
      if (matching_response)
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, "ArrowLeft");
      else
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, "ArrowRight");
    }
  };
  
  practice_trials.push(practice_block, feedback_trial);
}

//Define control (0-back) block
var control_trials = []
for (var i = 0; i < control_num_trials; i++) {
  var control_block = {
    type: jsPsychHtmlKeyboardResponse,
    is_html: true,
    stimulus: getStim,
    data: {
      trial_id: "stim",
      exp_stage: "control",
      load: 0,
      target: 't',
    },
    choices: ['ArrowLeft', 'ArrowRight'],
    on_finish: function(data) {
      record_acc(data);
      // Score the response as correct or incorrect.
      const stim = stims.slice(-1)[0];
      const matching_response = stim.toLowerCase() == 't';
      if (matching_response)
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, "ArrowLeft");
      else
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, "ArrowRight");
    }
  };
  
  control_trials.push(control_block, feedback_trial)
}

var adaptive_test_node = {
  timeline: [update_target_block, adaptive_block, feedback_trial],
  loop_function: function() {
    trials_left -= 1
    if (trials_left === 0) {
      return false
    } else { 
      return true 
    }
  }
}

//Set up experiment
var adaptive_n_back_experiment = []
adaptive_n_back_experiment.push(start_practice_block);
adaptive_n_back_experiment = adaptive_n_back_experiment.concat(practice_trials);

if (control_before === 0) {
  adaptive_n_back_experiment.push(start_control_block)
  adaptive_n_back_experiment = adaptive_n_back_experiment.concat(control_trials)
}
for (var b = 0; b < num_blocks; b++) { 
  adaptive_n_back_experiment.push(start_adaptive_block)
  adaptive_n_back_experiment.push(adaptive_test_node)
  adaptive_n_back_experiment.push(update_delay_block)
}

if (control_before == 1) {
  adaptive_n_back_experiment.push(start_control_block)
  adaptive_n_back_experiment = adaptive_n_back_experiment.concat(control_trials)
}
//Set up control
adaptive_n_back_experiment.push(post_task_block)
adaptive_n_back_experiment.push(end_block)

const exit_fullscreen = {
  type: jsPsychFullScreen,
  fullscreen_mode: false,
  delay_after: 0,
};

timeline.push(...adaptive_n_back_experiment);
timeline.push(exit_fullscreen);

jsPsych.run(timeline);
