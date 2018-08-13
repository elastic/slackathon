export default function normalizeOutput(node) {
  if (typeof node === 'object') {
    if (!node.type) throw new Error('Objects must have a type propery');
    if (!node.value) throw new Error('Objects must have a value property');
    return node;
  }

  return { type: typeof node, value: node };
}
