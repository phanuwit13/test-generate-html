export const getStyle = () => {
  return fetch('./animate.txt')
    .then((response) => {
      return response.text()
    })
    .then((textContent) => {
      return textContent
    })
}

export const replaceSrcImage = (imageBg: string, str: string, url: string) => {
  return str.replace(imageBg, url)
}

export const addStylesheetRules = (rules:string) => {
  const styleEl = document.createElement('style')
  document.head.appendChild(styleEl)
  const styleSheet = styleEl.sheet
  styleSheet?.insertRule(rules, 0)
}
