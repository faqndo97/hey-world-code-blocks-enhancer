import './index.css'
import browser from 'webextension-polyfill'

let preferredTheme = 'github-dark'

browser.storage.local.get("currentTheme").then((response) => {
  if ('currentTheme' in response) {
    preferredTheme = response.currentTheme
  } else {
    browser.storage.local.set({ currentTheme: preferredTheme })
  }

  addThemesStyles()

  const codeBlocks = document.querySelectorAll('pre');
  codeBlocks.forEach(async (codeBlock) => {
    await highlight(codeBlock)
    codeBlock.prepend(themeSwitcher())
  })
})


async function addThemesStyles() {
  const highlightThemes = ["github-dark", "github"]

  highlightThemes.forEach(async (theme) => {
    let highlightStylesheet = document.createElement('link');
    highlightStylesheet.rel = "stylesheet"
    highlightStylesheet.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${theme}.min.css`
    highlightStylesheet.type = 'text/css'
    highlightStylesheet.dataset.highlightTheme = theme

    if (theme !== preferredTheme) {
      highlightStylesheet.setAttribute("disabled", "disabled");
    }

    document.head.appendChild(highlightStylesheet);
  })
}

function themeSwitcher () {
  let themeSwitcher = document.createElement('div')
  themeSwitcher.style.cssText = 'text-align: right;'

  themeSwitcher.appendChild(copyCodeToClipboardBtn());
  themeSwitcher.appendChild(darkThemeBtn());
  themeSwitcher.appendChild(lightThemeBtn());

  return themeSwitcher
}

function darkThemeBtn() {
  const darkThemeBtn = document.createElement('button');
  darkThemeBtn.style.cssText = 'padding: 8px 12px; border: 1px solid gray; border-radius: 5px';
  if (preferredTheme === 'github-dark') darkThemeBtn.style.display = 'none'
  darkThemeBtn.classList.add('setDarkTheme')
  darkThemeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>';
  darkThemeBtn.addEventListener('click', (event) => {
    document.querySelector('[data-highlight-theme="github"')?.setAttribute("disabled", "disabled")
    document.querySelector('[data-highlight-theme="github-dark"')?.removeAttribute("disabled")
    document.querySelectorAll('.setLightTheme').forEach((btn) => { btn.style.display = null })
    document.querySelectorAll('.setDarkTheme').forEach((btn) => { btn.style.display = 'none' })
    browser.storage.local.set({ currentTheme: 'github-dark' })
  })

  return darkThemeBtn
}

function lightThemeBtn() {
  const lightThemeBtn = document.createElement('button');
  lightThemeBtn.style.cssText = 'padding: 8px 12px; border: 1px solid gray; border-radius: 5px;';
  if (preferredTheme === 'github') lightThemeBtn.style.display = 'none'
  lightThemeBtn.classList.add('setLightTheme')
  lightThemeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 8a2 2 0 1 0 4 4"></path><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>';
  lightThemeBtn.addEventListener('click', (event) => {
    document.querySelector('[data-highlight-theme="github-dark"')?.setAttribute("disabled", "disabled")
    document.querySelector('[data-highlight-theme="github"')?.removeAttribute("disabled")
    document.querySelectorAll('.setDarkTheme').forEach((btn) => { btn.style.display = null })
    document.querySelectorAll('.setLightTheme').forEach((btn) => { btn.style.display = 'none' })
    browser.storage.local.set({ currentTheme: 'github' })
  })

  return lightThemeBtn
}

function copyCodeToClipboardBtn() {
  const copyCodeToClipboardBtn = document.createElement('button');
  copyCodeToClipboardBtn.style.cssText = 'padding: 8px 12px; border: 1px solid gray; border-radius: 5px; margin-right: 8px;';
  const copyIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><path fill="currentColor" d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"/></svg>';
  const checkIcon = '<svg xmlns="http://www.w3.org/2000/svg" style="color: green" height="16" width="14" viewBox="0 0 448 512"><path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>'
  copyCodeToClipboardBtn.innerHTML = copyIcon
  copyCodeToClipboardBtn.addEventListener('click', (event) => {
    navigator.clipboard.writeText(copyCodeToClipboardBtn.parentElement?.parentElement?.textContent)
    copyCodeToClipboardBtn.innerHTML = checkIcon

    setTimeout(function() {
      copyCodeToClipboardBtn.innerHTML = copyIcon
    }, 1500);
  })

  return copyCodeToClipboardBtn
}

async function highlight(codeBlock) {
  const {data} = await browser.runtime.sendMessage({ action: 'highlight', value: codeBlock.textContent })
  codeBlock.innerHTML = data.highlightedCode
  codeBlock.dataset.highlighted = "yes"
  codeBlock.classList.add("hljs", `language-${data.language}`)
}