const nodes = [
    { id: 1, name: 'i1' },
    { id: 2, name: 'i2', parentId: 1 },
    { id: 4, name: 'i4', parentId: 3 },
    { id: 3, name: 'i3', parentId: 2 },
    { id: 8, name: 'i8', parentId: 7 },
];
// init and find out the root node.
let root;
const nodesObj = {};
nodes.forEach((node) => {
    if (!node.parentId) {
        if (!root) {
            root = node;
        }
        else {
            throw new Error(`Invalid tree, there are two root.`);
        }
    }
    nodesObj[node.id] = node;
});
nodes.forEach((node) => {
    if (node.parentId) {
        const parent = nodesObj[node.parentId];
        if (!parent) {
            throw new Error(`Invalid tree, there is a node: (${node.id}) that can't find its parent`);
        }
        if (!parent.children) {
            parent.children = [node];
        }
        else {
            parent.children.push(node);
        }
    }
});
console.dir(JSON.stringify(root, null, 2));
//# sourceMappingURL=question3.js.map