export default function withinElement(node, tagName) {
  tagName = tagName.toUpperCase();
  while (node) {
    if (node.tagName && node.tagName.toUpperCase() === tagName) return true;
    node = node.parentNode;
  }
  return false;
}
