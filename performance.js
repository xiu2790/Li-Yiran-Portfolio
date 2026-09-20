// Defer large gallery images and audio until the visitor opens or plays them.
(() => {
  const defer = root => {
    root.querySelectorAll?.('img').forEach(image => { image.loading = 'lazy'; image.decoding = 'async'; });
    root.querySelectorAll?.('audio').forEach(audio => { audio.preload = 'none'; });
  };
  defer(document);
  new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
    if (node.nodeType === 1) defer(node);
  }))).observe(document.body, {childList:true, subtree:true});
})();
