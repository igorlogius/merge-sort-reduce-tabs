/* global browser */

// actually move and sort
async function merge(winId, tabs){
    const tabIds = tabs.sort( (a,b) => {
        if(a.url < b.url){ return -1;}
        if(a.url > b.url){ return 1;}
        return 0;
    }).map(t => t.id);
    return browser.tabs.move(tabIds, {windowId: winId, index:-1});
}

// only remove if tabs have the same url and are in the same container!!
function reduce(tabs){
    const uniqueTabStore = new Set();
    // key := url+container =>  value := tabId
    const toRemove = new Set();
    let tmp;
    for(const t of tabs){
        tmp = t.cookieStoreId+":"+t.url;
        if(uniqueTabStore.has(tmp)){
            // found a duplicate
            toRemove.add(t.id);
        }else{
            uniqueTabStore.add(tmp);
        }
    }
    if(toRemove.size > 0){
        browser.tabs.remove([...toRemove]);
    }
}

async function onBAClicked(tab) {
    const tabs = (await browser.tabs.query({pinned:false, windowType:"normal"}));
    await merge(tab.windowId, tabs);
    reduce(tabs);
}

browser.browserAction.onClicked.addListener(onBAClicked);

