import browser from "webextension-polyfill";
import hljs from 'highlight.js';

type Message = {
  action: 'highlight',
  value: '',
}

type ResponseCallback = (data: any) => void

async function handleMessage({action, value}: Message, response: ResponseCallback) {
  if (action === "highlight") {
    let result : any = ''

    // Regular expression to match the pattern ```language
    const regex = /^```(\w+)\n([\s\S]*)$/;

    // Extract the language and code content
    const match = value.match(regex);

    if (match) {
      const language = match[1];
      const codeContent = match[2];

      result = hljs.highlight(
        codeContent,
        { language }
      )
    } else {
      result = hljs.highlightAuto(value);
    }

    response({ message: 'success', data: {highlightedCode: result.value, language: result.language } });
  } else {
    response({data: null, error: 'Unknown action'});  
  }
}

// @ts-ignore
browser.runtime.onMessage.addListener((msg, sender, response) => {
  handleMessage(msg, response);
  return true;
});
