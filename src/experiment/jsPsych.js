import { initJsPsych } from "jspsych";
import i18next from "i18next";
import './i18n';

// eslint-disable-next-line import/prefer-default-export
export const jsPsych = initJsPsych({
  show_progress_bar: false,
  auto_update_progress_bar: false,
  message_progress_bar: `${i18next.t('progressBar')}`,
  on_finish: () => {
    document.body.style.cursor = "auto";
  },
});
