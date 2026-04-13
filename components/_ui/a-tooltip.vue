<template>
  <div class="tooltip">
    <slot></slot>
    <span class="tooltiptext tooltip-right">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: 'Нет подходящих результатов',
  },
  position: {
    type: String,
    default: 'top',
  },
});
</script>

<style lang="scss">
/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;

  @media (min-width: 1024px) {
    display: block;
  }

  .tooltiptext {
    position: absolute;
    z-index: 1;
    display: none;
    visibility: hidden;
    width: fit-content;
    padding: to-rem(4) to-rem(8);
    color: var(--base-white);
    background-color: var(--base-blue);
    border-radius: to-rem(6);
    opacity: 1;
    text-align: center;
    text-wrap: nowrap;
    transition: opacity 0.6s;
  }
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}

.tooltip-top {
  left: 50%;
  bottom: 125%;
  margin-left: to-rem(-60);
}

.tooltip-top::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: to-rem(-5);
  border-width: to-rem(5);
  border-style: solid;
  border-color: var(--base-gray-border) transparent transparent;
}

.tooltip-right {
  top: to-rem(-7);
  left: 140%;
}

.tooltip-right::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 100%;
  margin-top: to-rem(-5);
  border-width: to-rem(5);
  border-style: solid;
  border-color: transparent var(--base-blue) transparent transparent;
}
</style>
