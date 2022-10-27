import jsPsychHtmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

let block;


// poldrack-text

block = {
	type: 'poldrack-text',
	text: '<div class = "centerbox"><p class = "center-block-text">Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	data: {
		trial_id: "end",
    	exp_id: 'adaptive_n_back'
	},
	timing_response: 180000,
	timing_post_trial: 0,
	on_finish: assessPerformance
};

block = {
	type: jsPsychHtmlKeyboardResponse,
	stimulus: '<div class = "centerbox"><p class = "center-block-text">Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
	choices: ['Enter'],
	data: {
		trial_id: "end",
    	exp_id: 'adaptive_n_back'
	},
	on_finish: assessPerformance
};


// poldrack-single-stim
// Diff: https://www.diffchecker.com/yPC1vUjl

block = {
	type: 'poldrack-single-stim',
	is_html: true,
	stimulus: getStim,
	data: {
		trial_id: "stim",
		exp_stage: "control",
		load: 0,
		target: 't',
	},
	choices: [37,40],
	timing_stim: 500,
	timing_response: 2000,
	timing_post_trial: 0,
	on_finish: function(data) {
		record_acc(data)
	}
};

block = {
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
		record_acc(data)
	}
};


// survey-text

block = {
	type: 'survey-text',
	data: {
		   exp_id: "adaptive_n_back",
		trial_id: "post task questions"
	},
	questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
			   '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
	rows: [15, 15],
	columns: [60,60]
 };
 
block = {
	type: 'survey-text',
	data: {
		   exp_id: "adaptive_n_back",
		trial_id: "post task questions"
	},
	questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
			   '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
	rows: [15, 15],
	columns: [60,60]
 };
 
// the steps

let timeline = [];
const jsPsych = initJsPsych();

// do stuff here

jsPsych.run(timeline);

// preloading assets (such as photos, videos, audio files, anything media)

let block = {
	type: jsPsychPreload,
	images: ['img/blue.png', 'img/orange.png']
};

let block = {
	type: jsPsychHtmlKeyboardResponse,
	stimulus: "Welcome to the experiment. Press any key to begin."
};