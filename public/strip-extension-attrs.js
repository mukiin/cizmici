(function stripExtensionHydrationAttrs() {
  var known = ["bis_skin_checked", "bis_register", "cz-shortcut-listen"];

  function stripNode(node) {
    if (!node || node.nodeType !== 1) return;
    for (var i = 0; i < known.length; i += 1) {
      if (node.hasAttribute(known[i])) node.removeAttribute(known[i]);
    }
    var attrs = node.attributes;
    if (!attrs) return;
    for (var j = attrs.length - 1; j >= 0; j -= 1) {
      var name = attrs[j].name;
      if (name.indexOf("__processed_") === 0) node.removeAttribute(name);
    }
  }

  function stripTree(root) {
    if (!root) return;
    stripNode(root);
    var nodes = root.getElementsByTagName("*");
    for (var i = 0; i < nodes.length; i += 1) stripNode(nodes[i]);
  }

  stripTree(document.documentElement);

  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i += 1) {
      var mutation = mutations[i];
      if (mutation.type === "attributes") stripNode(mutation.target);
      var added = mutation.addedNodes;
      if (!added) continue;
      for (var n = 0; n < added.length; n += 1) {
        if (added[n].nodeType === 1) stripTree(added[n]);
      }
    }
  });

  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
  });

  window.addEventListener("DOMContentLoaded", function () {
    window.setTimeout(function () {
      observer.disconnect();
    }, 4000);
  });
})();
