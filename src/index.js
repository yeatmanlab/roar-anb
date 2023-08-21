import store from "store2";

// Import necessary for async in the top level of the experiment script
import 'regenerator-runtime/runtime';

// Local modules
import { initConfig } from "./experiment/config/config";
import { buildExperiment } from "./experiment/experiment";
import "./experiment/css/roar.css";
import { waitFor } from "./experiment/experimentHelpers";

class RoarANB {
  constructor(firekit, gameParams, userParams, displayElement) {
    // TODO: Add validation of params so that if any are missing, we throw an error
    this.gameParams = gameParams;
    this.userParams = userParams;
    this.firekit = firekit;
    this.displayElement = displayElement;
  }

  async init() {
    await this.firekit.startRun();
    const config = await initConfig(
      this.firekit,
      this.gameParams,
      this.userParams,
      this.displayElement,
    );
    store.session.set("config", config);
    return buildExperiment(config);
  }

  async run() {
    const { jsPsych, timeline } = await this.init();
    jsPsych.run(timeline);

    await waitFor(() => this.firekit.run.completed === true);
  }
}

export default RoarANB;
