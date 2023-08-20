// TODO: NOTE: THIS IS THE SCORING DOCUMENT FROM SRE, NOT ANB.

/* eslint-disable import/prefer-default-export */
import _fromPairs from "lodash/fromPairs";
import _omit from "lodash/omit";
import _toPairs from "lodash/toPairs";
import * as Papa from "papaparse";
import store from "store2";

export class RoarScores {
  constructor() {
    this.tableURL = "https://storage.googleapis.com/roar-sre/scores/sre_lookup_v1.csv";
    this.lookupTable = [];
    this.tableLoaded = false;
  }

  async initTable() {
    return new Promise((resolve, reject) => {
      const grade = store.session.get("config").userMetadata?.grade;

      if (!grade) reject();

      Papa.parse(this.tableURL, {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        step: (row) => {
          if (grade === Number(row.data.grade)) this.lookupTable.push(_omit(row.data, [""]));
        },
        complete: () => {
          this.tableLoaded = true;
          resolve();
        },
      });
    });
  }

  /**
   * This function calculates computed scores given raw scores for each subtask.
   *
   * The input raw scores are expected to conform to the following interface:
   *
   * interface IRawScores {
   *   [key: string]: {
   *     practice: ISummaryScores;
   *     test: ISummaryScores;
   *   };
   * }
   *
   * where the top-level keys correspond to this assessment's subtasks. If this
   * assessment has no subtasks, then there will be only one top-level key called
   * "composite." Each summary score object implements this interface:
   *
   * interface ISummaryScores {
   *   thetaEstimate: number | null;
   *   thetaSE: number | null;
   *   numAttempted: number;
   *   numCorrect: number;
   *   numIncorrect: number;
   * }
   *
   * The returned computed scores must have that same top-level keys as the
   * input raw scores, and each value must be an object with arbitrary computed
   * scores.  For example, one might return the SRE score (i.e., total correct
   * minus the total incorrect), a predicted TOSREC standard score, and a
   * predicted TOSREC percentile.
   *
   * {
   *   practice: {
   *    sreScore: w;
   *   },
   *   ai: {
   *     sreScore: x;
   *   },
   *   lab: {
   *     sreScore: y;
   *   },
   *   tosrec: {
   *     sreScore: z;
   *   },
   *   composite: {
   *     sreScore: y;
   *     tosrecSS: number;
   *     tosrecPercentile: number;
   *   }
   * }
   *
   * @param {*} rawScores
   * @returns {*} computedScores
   */
  computedScoreCallback = async (rawScores) => {
    // This returns an object with the same top-level keys as the input raw scores
    // But the values are the number of correct trials minus the number of
    // incorrect trials, not including practice trials.
    const computedScores = _fromPairs(_toPairs(rawScores).map(([subTask, subScore]) => {
      // For the "practice" subtask, we want to use the raw scores associated
      // with the "practice" assessment stage. For all others, we want to use the
      // "test" assessment stage.
      const scoringStage = subTask === "practice" ? "practice" : "test";
      const numCorrect = subScore[scoringStage]?.numCorrect || 0;
      const numIncorrect = subScore[scoringStage]?.numIncorrect || 0;
      const sreScore = numCorrect - numIncorrect;
      return [subTask, { sreScore }];
    }));

    // computedScores should now have keys for each corpus: lab, ai, and tosrec
    // But for the composite score, we just take the score for the lab corpus
    // We also clip the composite score to a minimum of 0.
    const compositeScore = Math.max(computedScores.lab?.sreScore || 0, 0);

    computedScores.composite = {
      sreScore: compositeScore,
    }

    const grade = store.session.get("config").userMetadata?.grade;
    if (grade) {
      if (!this.tableLoaded) {
        await this.initTable();
      }

      // Then we find the row in the lookup table that corresponds to the composite score.
      const myRow = this.lookupTable.find((row) => row.sreScore === compositeScore);

      // And add columns in the lookup table except for the grade and sreScore.
      const { grade, sreScore, ...normedScores } = myRow;

      computedScores.composite = {
        sreScore: compositeScore,
        ...normedScores,
      };
    }

    return computedScores;
  };
}