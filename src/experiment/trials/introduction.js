import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import i18next from "i18next";
import { mediaAssets } from "../experimentHelpers";
import '../i18n';

export const welcome_screen_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: mediaAssets.audio.welcomeAudio,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${mediaAssets.images.welcomeAnimated}"></img>  
  </div>
  <div class="press-key"> ${i18next.t('introduction.welcome_screen_block.text1')} </div>`,
};

export const intro_1_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: mediaAssets.audio.intro1,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
      <img class="bookleft" src="${mediaAssets.images.woofusInstructionBookIntro}"></img>
      </div>
    <div class="text-box">
      <p class="middle"> ${i18next.t('introduction.intro_1_block.text1')} </p>
    </div>
  </div>
<div class="press-key">${i18next.t('introduction.intro_1_block.text2')}</div>`,
};

export const intro_2_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: mediaAssets.audio.intro2,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
      <img class="woofusleft" src="${mediaAssets.images.robotIntro}"></img>
      </div>
    <div class="text-box">
      <p class="middle">${i18next.t('introduction.intro_2_block.text1')}</p>
    </div>
  </div>
<div class="press-key">${i18next.t('introduction.intro_2_block.text2')}</div>`,
};

export const intro_3_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: mediaAssets.audio.intro3,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
      <img class="trial-animation-left" src="${mediaAssets.images.trialScreen2}"></img>
      </div>
    <div class="text-box">
      <p class="middle">${i18next.t('introduction.intro_3_block.text1')}</p>
    </div>
  </div>
<div class="press-key">${i18next.t('introduction.intro_3_block.text2')}</div>`,
};

export const intro_4_block = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: mediaAssets.audio.intro4,
  choices: "ALL_KEYS",
  response_allowed_while_playing: true,
  prompt: `<div class = "background">
  <img class = "lab-background-image" src="${mediaAssets.images.backgroundImage}"></img>  
  </div>
  <div class="row">
    <div class="column_1">
      <img class="catleft" src="${mediaAssets.images.catIntro}"></img>
      </div>
    <div class="text-box">
      <p class="middle">${i18next.t('introduction.intro_4_block.text1')}</p>
    </div>
  </div>
<div class="press-key">${i18next.t('introduction.intro_4_block.text2')}</div>`,
};
