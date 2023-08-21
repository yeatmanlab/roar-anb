import { log } from "../src/experiment/config/logger";

const devFirebaseConfig = {
  apiKey: "AIzaSyCX9WR-j9yv1giYeFsMpbjj2G3p7jNHxIU",
  authDomain: "gse-yeatmanlab.firebaseapp.com",
  projectId: "gse-yeatmanlab",
  storageBucket: "gse-yeatmanlab.appspot.com",
  messagingSenderId: "292331000426",
  appId: "1:292331000426:web:91a04220991e3405737013",
  measurementId: "G-0TBTMDS993",
};

const productionFirebaseConfig = {
  apiKey: "AIzaSyDw0TnTXbvRyoVo5_oa_muhXk9q7783k_g",
  authDomain: "gse-roar-assessment.firebaseapp.com",
  projectId: "gse-roar-assessment",
  storageBucket: "gse-roar-assessment.appspot.com",
  messagingSenderId: "757277423033",
  appId: "1:757277423033:web:d6e204ee2dd1047cb77268",
};

export const firebaseConfig =
  // eslint-disable-next-line no-undef
  ROAR_DB === "production" ? productionFirebaseConfig : devFirebaseConfig;

export const roarConfig = {
  firebaseConfig,
}

const logMessage =
  `This ROAR app will write data to the ${roarConfig.firebaseConfig.projectId} firestore database`
log.info(logMessage);