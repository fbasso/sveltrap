<style>
    .sidebar {
        max-width: 200px;
    }
</style>

<script lang="ts">

  import {onMount, onDestroy} from 'svelte';
  import {location, lang} from '../../services/router';

  import Alert from './alert/Alert.svelte';
  import Accordion from './accordion/Accordion.svelte';
  import Calendar from './calendar/Calendar.svelte';
  import Collapse from './collapse/Collapse.svelte';
  import Dropdown from './dropdown/Dropdown.svelte';
  import Modal from './modal/Modal.svelte';
  import Tabset from './tabset/Tabset.svelte';

  const menu = [
      {
        id: 'accordion',
        label: 'Accordion',
        component: Accordion
      },
      {
        id: 'alert',
        label: 'Alert',
        component: Alert
      },
      {
        id: 'button',
        label: 'Button',
        component: ''
      },
      {
        id: 'calendar',
        label: 'Calendar',
		component: Calendar
	  },
      {
        id: 'collapse',
        label: 'Collapse',
        component: Collapse
      },
      {
        id: 'dropdown',
        label: 'Dropdown',
        component: Dropdown
      },
      {
        id: 'modal',
        label: 'Modal',
        component: Modal
      },
      {
        id: 'tabset',
        label: 'Tabset',
        component: Tabset
      }
  ];


  const getItem = (id) => {
    return menu.filter((item) => {
      return item.id === id;
    })[0];
  }

  let activeMenu;

  const routerRegExp = /([^\/]+)$/gi;
  $: {
      const matches = $location.pathname.match(routerRegExp);
      activeMenu = getItem(matches && matches[0] ?matches[0] : 'alert');
  }

</script>
<div class="row">
    <div class="sidebar col">
        <ul class="nav flex-column">
            {#each menu as menuItem}
            <li class="nav-item" class:active="{activeMenu === menuItem.id}">
                <a class="nav-link" href="/{$lang}/documentation/{menuItem.id}">{menuItem.label}</a>
            </li>
            {/each}
        </ul>
    </div>
    <div class="col">
        <svelte:component this={activeMenu.component}></svelte:component>
    </div>
</div>