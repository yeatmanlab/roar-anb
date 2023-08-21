import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import i18next from "i18next";
import { mediaAssets } from "../experimentHelpers";
import '../i18n';
import { jsPsych } from "../jsPsych";
import { utils } from '../../utils';

export const instructions_1_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: mediaAssets.audio.instructions1Audio,
  response_allowed_while_playing: true,
  choices: "ALL_KEYS",
  on_finish: (data) => {
    data.correct = jsPsych.pluginAPI.compareKeys(data.response, utils.CORRECT_KEY_PRESS);
  },
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
      <img class="catleft" src="${mediaAssets.images.catArrowsAnimated}"></img>
      </div>
    <div class="text-box">
      <p class="middle">${i18next.t('instructions.instructions_1_block.text1')}</p>
    </div>
  </div>
<div class="press-key">${i18next.t('instructions.instructions_1_block.text2')}</div>`,
};

export const right_arrow_feedback_node = {
  type: jsPsychAudioKeyboardResponse,
  response_allowed_while_playing: true,
  trial_duration: null,
  stimulus: () => {
    const last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
    if (last_trial_correct) {
      return mediaAssets.audio.rightArrowCorrect;
    }
    return mediaAssets.audio.rightArrowIncorrect;
  },
  choices: "ALL_KEYS",
  on_finish: (data) => {
    data.correct = jsPsych.pluginAPI.compareKeys(data.response, utils.CORRECT_KEY_PRESS);
  },
  prompt: () => {
    // checking if the last trial was correct to push appropriate feedback prompt
    const last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
    if (last_trial_correct) {
      return `<div class = "background">
      <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
      </div>
      <div class="row">
        <div class="column_1">
          <img class="catleft" src="${mediaAssets.images.catSmileAnimated}"></img>
          </div>
        <div class="text-box">
          <p class="middle">${i18next.t('instructions.right_arrow_feedback_node.text1')}</p>
        </div>
      </div>
    <div class="press-key">${i18next.t('instructions.right_arrow_feedback_node.text2')}</div>`;
    }
    return `<div class = "background">
    <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
    </div>
    <div class="row">
      <div class="column_1">
        <img class="catleft" src="${mediaAssets.images.catRightArrowFrown}"></img>
        </div>
      <div class="text-box">
        <p class="middle">${i18next.t('instructions.right_arrow_feedback_node.text3')}</p>
      </div>
    </div>
  <div class="press-key">${i18next.t('instructions.right_arrow_feedback_node.text4')}</div>`;
  },
};

export const right_arrow_redo = {
  timeline: [right_arrow_feedback_node],
  loop_function: function () {
    const last_trial_correct = jsPsych.data.get().last(2).values()[0].correct;
    if (last_trial_correct) {
      return false;
    }
    return true;
  },
};

export const instructions_2_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: mediaAssets.audio.instructions2Audio,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
      <img class="trial-animation-left" src="${mediaAssets.images.instructions3}"></img>
      </div>
    <div class="text-box">
      <p class="middle">${i18next.t('instructions.instructions_2_block.text1')}</p>
    </div>
  </div>
<div class="press-key">${i18next.t('instructions.instructions_2_block.text2')}</div>`,
};

export const instructions_3_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: mediaAssets.audio.instructions3Audio,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
    <img class="catleft" src="${mediaAssets.images.catSmileAnimated}"></img>
    </div>
    <div class="text-box">
      <p class="middle">${i18next.t('instructions.instructions_3_block.text1')}</p>
    </div>
  </div>
<div class="press-key">${i18next.t('instructions.instructions_3_block.text2')}</div>`,
};
