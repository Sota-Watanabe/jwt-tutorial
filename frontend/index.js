const Enquirer = require("enquirer");
const dotenv = require("dotenv");
const envVariables = dotenv.config().parsed;
const { CurlGenerator } = require("curl-generator");
const { exec } = require("child_process");

const requestInfo = { url: "", method: "", body: {}, headers: {} };
(async () => {
  let question = {
    type: "input",
    name: "url",
    message: "どこへリクエストを飛ばしますか？",
  };
  let answer = await Enquirer.prompt(question);
  requestInfo.url = answer.url;

  question = {
    type: "select",
    name: "method",
    message: "メソッドは？",
    choices: ["GET", "POST", "PUT", "DELETE"],
  };
  answer = await Enquirer.prompt(question);
  requestInfo.method = answer.method;

  const envVariableKeys = Object.keys(envVariables);
  const choicesItems = envVariableKeys.map((v) => v.toLowerCase());
  question = {
    name: "selections",
    type: "select",
    multiple: true,
    message: "Bodyにセットするものは？",
    choices: choicesItems,
  };
  answer = await Enquirer.prompt(question);
  answer.selections.forEach((element) => {
    requestInfo.body[element] = envVariables[element.toUpperCase()];
  });

  question = {
    name: "selections",
    type: "select",
    multiple: true,
    message: "Headersにセットするものは？",
    choices: choicesItems,
  };
  answer = await Enquirer.prompt(question);
  answer.selections.forEach((element) => {
    requestInfo.headers[element] = envVariables[element.toUpperCase()];
  });

  Object.keys(requestInfo).forEach(
    (key) =>
      Object.keys(requestInfo[key]).length === 0 && delete requestInfo[key]
  );

  const curlSnippet = CurlGenerator(requestInfo);
  console.log(`コマンドを作成しました。\n${curlSnippet}`)
  question = {
    name: "confirm",
    type: "confirm",
    message: '実行しますか？',
    default: true,
  };
  answer = await Enquirer.prompt(question);
  if(answer.confirm) {
    execShell(curlSnippet);
  }
})();

function execShell(script) {
  exec(script, (err, stdout, stderr) => {
    if (err) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}
