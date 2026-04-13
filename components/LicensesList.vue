<template>
  <div class="licenses">
    <CardLicense v-if="Object.keys(licenses).length" type="license" :data="licenses" :has-link="hasLink" />
    <CardLicense
      v-if="Object.keys(accreditations).length"
      type="accreditation"
      :data="accreditations"
      :has-link="hasLink"
    />
  </div>
</template>

<script setup>
import CardLicense from '~/components/CardLicense.vue';

defineProps({
  licenses: {
    type: Object,
    default: () => {
      return {};
    },
  },
  accreditations: {
    type: Object,
    default: () => {
      return {};
    },
  },
  hasLink: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss">
.licenses {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: to-rem(40);
  gap: to-rem(32);

  @media (min-width: 767px) {
    flex-direction: row;
  }

  @media (min-width: 1440px) {
    flex-direction: row;
    margin-bottom: to-rem(48);
  }
}
</style>
