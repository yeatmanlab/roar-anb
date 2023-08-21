import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import i18next from "i18next";
import { mediaAssets } from "../experimentHelpers";
import '../i18n';

const game_break_1_block = {
  type: jsPsychAudioKeyboardResponse,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  stimulus: mediaAssets.audio.fixRobot1,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
    <img class="catleft" src="${mediaAssets.images.gameBreak1Animation}"></img>
    </div>
    <div class="text-box" style="border-radius:30%">
    <p class="middle"> <span style="font-size: 5vh; color: rgba(76,101,139,1); text-align: center; ">${i18next.t('gameBreak.game_break_1_block.text1')}</p>  
    </div>
  </div>
<div class="press-key">${i18next.t('gameBreak.game_break_1_block.text2')}</div>`,
};

const game_break_2_block = {
  type: jsPsychAudioKeyboardResponse,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  stimulus: mediaAssets.audio.fixRobot2,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
    <img class="catleft" src="${mediaAssets.images.gameBreak2Animation}"></img>
    </div>
    <div class="text-box" style="border-radius:30%">
    <p class="middle"> <span style="font-size: 5vh; color: rgba(76,101,139,1); text-align: center; ">${i18next.t('gameBreak.game_break_2_block.text1')}</p>  
    </div>
  </div>
<div class="press-key">${i18next.t('gameBreak.game_break_2_block.text2')}</div>`,
};

const game_break_3_block = {
  type: jsPsychAudioKeyboardResponse,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  stimulus: mediaAssets.audio.fixRobot3,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
    <img class="catleft" src="${mediaAssets.images.gameBreak3Animation}"></img>
    </div>
    <div class="text-box" style="border-radius:30%">
    <p class="middle">${i18next.t('gameBreak.game_break_3_block.text1')}</p>  
    </div>
  </div>
<div class="press-key">${i18next.t('gameBreak.game_break_3_block.text2')}</div>`,
};

const game_break_4_block = {
  type: jsPsychAudioKeyboardResponse,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  stimulus: mediaAssets.audio.fixRobot4,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
    <img class="catleft" src="${mediaAssets.images.gameBreak4Animation}"></img>
    </div>
    <div class="text-box" style="border-radius:30%">
    <p class="middle"> <span style="font-size: 5vh; color: rgba(76,101,139,1); text-align: center; ">${i18next.t('gameBreak.game_break_4_block.text1')}</p>  
    </div>
  </div>
<div class="press-key">${i18next.t('gameBreak.game_break_4_block.text2')}</div>`,
};

const game_break_5_block = {
  type: jsPsychAudioKeyboardResponse,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  stimulus: mediaAssets.audio.fixRobot5,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
    <img class="catleft" src="${mediaAssets.images.gameBreak5Animation}"></img>
    </div>
    <div class="text-box" style="border-radius:30%">
    <p class="middle">${i18next.t('gameBreak.game_break_5_block.text1')}</p>  
    </div>
  </div>
<div class="press-key">${i18next.t('gameBreak.game_break_5_block.text2')}</div>`,
};

const game_break_6_block = {
  type: jsPsychAudioKeyboardResponse,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  stimulus: mediaAssets.audio.fixRobot6,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
    <img class="catleft" src="${mediaAssets.images.gameBreak6Animation}"></img>
    </div>
    <div class="text-box" style="border-radius:30%">
    <p class="middle">${i18next.t('gameBreak.game_break_6_block.text1')}</p>  
    </div>
  </div>
<div class="press-key">${i18next.t('gameBreak.game_break_6_block.text2')}</div>`,
};

const game_break_7_block = {
  type: jsPsychAudioKeyboardResponse,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  stimulus: mediaAssets.audio.fixRobot7,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
    <img class="catleft" src="${mediaAssets.images.gameBreak7Animation}"></img>
    </div>
    <div class="text-box" style="border-radius:30%">
    <p class="middle">${i18next.t('gameBreak.game_break_7_block.text1')}</p>  
    </div>
  </div>
<div class="press-key">${i18next.t('gameBreak.game_break_7_block.text2')}</div>`,
};

export const generic_game_break_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: mediaAssets.audio.genericGameBreak,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: `  <div class = "background">
  <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
    <img class="catleft" src="${mediaAssets.images.woofusAnimated}"></img>
    </div>
    <div class="text-box" style="border-radius:30%">
    <p class="middle"> <span style="font-size: 5vh; color: rgba(76,101,139,1); text-align: center; ">${i18next.t('gameBreak.generic_game_break_block.text1')}</p>  
    </div>
  </div>
<div class="press-key">${i18next.t('gameBreak.generic_game_break_block.text2')}</div>`,
};

export const game_break_blocks = [
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

export const level_up_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: mediaAssets.audio.levelUpSeeNewInstructions,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: `<div class = "centerbox"> <h1 class = "block-text">${i18next.t('gameBreak.level_up_block.text1')}</div>
  <div class="press-key">${i18next.t('gameBreak.level_up_block.text2')}</div>`,
};

export const level_down_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: mediaAssets.audio.levelDown,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: `<div class = "centerbox"> <h1 class = "block-text">${i18next.t('gameBreak.level_down_block.text1')}</div>
  <div class="press-key">${i18next.t('gameBreak.level_down_block.text2')}</div>`,
};
