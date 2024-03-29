export const qs = function(element, selector) {
	return element.querySelector(selector);
};

export const qsa = function(element, selector) {
	return element.querySelectorAll(selector);
};

export const createElement = function(tagname) {
	return document.createElement(tagname);
};

export const contains = function(parentNode, element) {
	return parentNode.contains(element);
};

// matches() polyfill
// if (!Element.prototype.matches) {
// 	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
// }
export function matches(element, selector) {
	return element.matches && element.matches(selector);
}

export const containsClass = function(element, classname) {
	return element.classList.contains(classname);
};

export const toggleClass = function(element, classname, force) {
	const classList = element.classList;
	if (force == null) {
		force = !classList.contains(classname);
	}

	if (force) {
		classList.add(classname);
	} else {
		classList.remove(classname);
	}
};

function getArray(spaceSeparatedString) {
	return Array.isArray(spaceSeparatedString) ? spaceSeparatedString : spaceSeparatedString.split(' ');
}

export const addClass = function(element, classname) {
	classname = getArray(classname);
	const classList = element.classList;
	for(let i = 0; i < classname.length; i++) {
		classList.add(classname[i]);
	}
};

export const removeClass = function(element, classname) {
	classname = getArray(classname);
	const classList = element.classList;
	for(let i = 0; i < classname.length; i++) {
		classList.remove(classname[i]);
	}
};

export const attr = function(element, attributeName, value?) {
	if (value != null) {
		element.setAttribute(attributeName, value);
	} else {
		return element.getAttribute(attributeName);
	}
};

export const addEvent = function(element, type, fn) {

	element.addEventListener(type, fn);

	return function() {
		element.removeEventListener(type, fn);
	};

};

export function delegate(selector, fn) {
	return function(e, ...rest) {
		let target = e.target;
		if (matches(target, selector)) {
			fn(e);
		} else {
			target = target.parentNode;
			while(target && target !== target.parentNode) {
				if (matches(target, selector)) {
					fn(Object.assign({}, e, {target}), ...rest);
					return;
				}
				target = target.parentNode;
			}
		}
	};
}

