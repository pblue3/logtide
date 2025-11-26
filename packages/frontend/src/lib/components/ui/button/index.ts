import Root from "./button.svelte";

export {
	Root,
	//
	Root as Button,
};

// Re-export buttonVariants and types for use in other components
export { buttonVariants, type ButtonVariant, type ButtonSize } from "./button-variants.js";
