(()=> {
  chrome.browserAction.onClicked.addListener(()=> {
    if (chrome.extension.inIncognitoContext) {
      var appUrl = chrome.extension.getURL('index.html')
      chrome.tabs.create({ url: appUrl })
    } else {
      chrome.runtime.openOptionsPage()
    }
  })
})()