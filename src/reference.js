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
