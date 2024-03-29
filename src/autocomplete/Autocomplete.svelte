<script lang="ts">
	import {onMount, afterUpdate, createEventDispatcher, tick} from 'svelte';

	import Dropdown from '#sveltrap/dropdown/Dropdown.svelte';
	import ItemTemplate from './ItemTemplate.svelte';
	import {debounce} from '#sveltrap/util/util';
	import {qs, qsa, addClass, attr} from '#sveltrap/util/dom';
	import {getActiveIndex, getItems} from './autocomplete';

	const dispatch = createEventDispatcher();

	export let value = '';
	export let classname = '';
	export let readonly = false;
	export let getSuggestions;
	export let itemTemplate = ItemTemplate;
	export let itemProps = {};
	export let useCache = true;
	export let force = false;


	const cache = {};
	const noSelectionEvent = 'noselection';

	let inputContainer;
	let menuContainer;
	let lastKeydownEvent;
	let suggestions = [];

	let selectionDone = true;
	$: activeIndex = getActiveIndex(lastKeydownEvent, {node: menuContainer, activeIndex, items: suggestions, force});
	$: isExpanded = suggestions.length > 0;

	function clearSuggestions() {
		suggestions = [];
	}

	async function onKeyDown(e) {
		lastKeydownEvent = e;
	}

	function inputValue() {
		return qs(inputContainer, 'input').value;
	}

	function onBlur() {
		if (activeIndex == null) {
			if (!selectionDone) {
				dispatch(noSelectionEvent, inputValue());
			}
		} else {
			if (force) {
				const item = getItems(menuContainer)[activeIndex];
				if (item) {
					item.click();
				}
			} else if (!selectionDone) {
				dispatch(noSelectionEvent, inputValue());
			}
		}

		suggestions = [];
		activeIndex = null;
	}

	function getInput() {
		return qsa(inputContainer, 'input')[0];
	}
	onMount(function() {
		addClass(getInput(), 'dropdown-toggle');
	});

	afterUpdate(function() {
		if (menuContainer) {
			for(const element of qsa(menuContainer, '.dropdown-item')) {
				attr(element, 'tabindex', '-1');
			}
		}
	});

	const onInput = debounce(async function({target}) {
		// isSuggestionsEnable = true;
		// searchValue = e.target.value;
		selectionDone = false;
		const searchValue = target.value.trim();
		if (!searchValue) {
			suggestions = [];
			return;
		}

		if (useCache) {
			const cacheValue = cache[searchValue];
			if (cacheValue) {
				suggestions = cacheValue;
				return;
			}
		}
		const response = await getSuggestions(searchValue, itemProps);
		suggestions = response || [];

		if (useCache) {
			cache[searchValue] = suggestions;
		}

	}, 200);

	const onItemClick = function() {
		selectionDone = true;
	}

</script>

<Dropdown isExpanded={isExpanded} on:blur={onBlur} {onKeyDown} on:dropdownopen on:dropdownclose>
	<div bind:this={inputContainer} on:input={onInput}>
		<slot {readonly}>
			<input type="text" bind:value class="form-control {classname}" {readonly}>
		</slot>
	</div>
	{#if suggestions.length}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div bind:this={menuContainer} class="m-0 dropdown-menu" on:click={() => onItemClick()} on:click|preventDefault|stopPropagation={clearSuggestions}>
		{#each suggestions as item}
			<svelte:component this={itemTemplate} {...itemProps} {item} on:click on:itemselect />
		{/each}
	</div>
	{/if}
</Dropdown>