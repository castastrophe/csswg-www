/**
 * Disclosure-menu behavior.
 *
 * Expected markup:
 *   <li class="has-submenu">
 *     <button aria-expanded="false" aria-controls="submenu-id">Trigger</button>
 *     <ul id="submenu-id" hidden>...</ul>
 *   </li>
 *
 * The trigger is a <button> (NOT an <a>) because it controls UI state,
 * not navigation. Initial state is collapsed (aria-expanded="false", hidden).
 */

function setOpen(menuItem, isOpen) {
	const trigger = menuItem.querySelector('[aria-expanded]');
	const submenu = menuItem.querySelector('ul');
	if (!trigger || !submenu) return;
	trigger.setAttribute('aria-expanded', String(isOpen));
	submenu.hidden = !isOpen;
}

function closeAll() {
	document.querySelectorAll('.has-submenu').forEach(item => setOpen(item, false));
}

document.querySelectorAll('.has-submenu').forEach(menuItem => {
	setOpen(menuItem, false);
	const trigger = menuItem.querySelector('[aria-expanded]');
	if (!trigger) return;

	trigger.addEventListener('click', event => {
		const wasOpen = trigger.getAttribute('aria-expanded') === 'true';
		closeAll();
		setOpen(menuItem, !wasOpen);
		event.stopPropagation();
	});
});

document.addEventListener('click', event => {
	if (!event.target.closest('.has-submenu')) closeAll();
});

document.addEventListener('keydown', event => {
	if (event.key === 'Escape') closeAll();
});

/* Translations popover is fully handled by the platform via the popover API
 * (popovertarget on the trigger + popover="auto" on the panel). No JS needed. */
