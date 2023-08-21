/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-mutable-exports */
import { generateAssetObject, createPreloadTrials } from "@bdelab/roar-utils";
import { jsPsych } from './jsPsych';
import { initRoarJsPsych, initRoarTimeline } from "./config/config";
import assets from '../../assets.json';
// Import necessary for async in the top level of the experiment script
import 'regenerator-runtime/runtime';
import {
  getNbackPracticeTrials, update_progress_bar_block,
  start_control_block, control_trials,
  instructions_loop, adaptive_test_node, update_delay_block,
  getNbackInstructions, end_game_block, post_task_block,
  exit_fullscreen, instructions,
} from "./experimentHelpers";

import {
  welcome_screen_block, intro_1_block,
  intro_2_block, intro_3_block, intro_4_block,
} from "./trials/introduction";

import {
  instructions_1_block, right_arrow_redo, instructions_2_block, instructions_3_block,
} from "./trials/instructions";

import {
  generic_game_break_block, game_break_blocks, level_up_block, level_down_block,
} from "./trials/gameBreak";

import './css/roar.css';

export let mediaAssets;
export let preloadTrials;
const control_before = Math.round(Math.random()); // 0 control comes before test, 1, after
const delay = 1; // starting delay
const previous_delay = -1;

export function buildExperiment(config) {
  const bucketURI = 'https://storage.googleapis.com/roar-anb';

  mediaAssets = generateAssetObject(assets, bucketURI);
  preloadTrials = createPreloadTrials(assets, bucketURI).default;
  console.log(mediaAssets)

  initRoarJsPsych(config);
  const initialTimeline = initRoarTimeline(config);
  let timeline = [preloadTrials, ...initialTimeline.timeline];

  const pushTrialsToTimeline = () => {
    // intro trials
    timeline.push(welcome_screen_block);
    timeline.push(intro_1_block);
    timeline.push(intro_2_block);
    timeline.push(intro_3_block);
    timeline.push(intro_4_block);

    // beginning instruction trials
    timeline.push(instructions_1_block);
    timeline.push(right_arrow_redo);
    timeline.push(instructions_2_block);

    // practice block for one back //
    timeline = timeline.concat(getNbackPracticeTrials(1));
    timeline.push(update_progress_bar_block);
    timeline.push(instructions_3_block);

    if (config.utils.SHOW_CONTROL_TRIALS && control_before === 0) {
      timeline.push(start_control_block);
      timeline = timeline.concat(control_trials);
      timeline.push(update_progress_bar_block);
      timeline.push(generic_game_break_block);
    }

    for (let b = 1; b <= config.utils.NUM_BLOCKS; b++) {
      timeline.push(instructions_loop);
      timeline.push(adaptive_test_node);
      timeline.push(update_delay_block);

      if (b < config.utils.NUM_BLOCKS) {
        const grab_game_break_node = {
          timeline:
            [(b >= game_break_blocks.length) ? generic_game_break_block : game_break_blocks[b]],
        };
        timeline.push(grab_game_break_node);

        const if_level_up_node = {
          timeline: [level_up_block],
          conditional_function: () => (delay - previous_delay > 0),
        };

        const if_level_down_node = {
          timeline: [level_down_block],
          conditional_function: () => (delay - previous_delay < 0),
        };

        timeline.push(if_level_up_node);
        timeline.push(if_level_down_node);
      }

      timeline.push(update_progress_bar_block);

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
      timeline.push(if_delay_back_shown);
    }

    if (config.utils.SHOW_CONTROL_TRIALS && control_before === 1) {
      // do not show game break for last adaptive block, so we must show it before the control block
      timeline.push(generic_game_break_block);
      timeline.push(start_control_block);
      timeline = timeline.concat(control_trials);
      timeline.push(update_progress_bar_block);
      // do not show game break since this is the final block
    }

    timeline.push(end_game_block);
    timeline.push(post_task_block);
  };
  pushTrialsToTimeline();
  timeline.push(exit_fullscreen);

  jsPsych.run(timeline);

  return { jsPsych, timeline };
}
