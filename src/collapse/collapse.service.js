
const updateAttribute = (node, collapseId, isExpanded) => {
	node.setAttribute('aria-controls', collapseId);
	node.setAttribute('role', 'button');
	node.setAttribute('aria-expanded', !!isExpanded);

}


export const collapse = (node, {collapseId, isExpanded}) => {
	updateAttribute(node, collapseId, isExpanded);
	return {
		update: ({collapseId, isExpanded}) => {
			updateAttribute(node, collapseId, isExpanded);
		}
	};
}
