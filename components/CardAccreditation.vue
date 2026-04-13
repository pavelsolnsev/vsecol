<template>
  <div v-for="(accreditation, index) in data" :key="index" class="card-license">
    <p class="card-license__name">
      Аккредитация<br />№ {{ accreditation.number }}<br />от {{ licenseDate(accreditation.issued_at) }}
    </p>
    <a
      v-if="accreditation.ticket && hasLink"
      class="card-license__link"
      :href="`${ACCREDITATION_LINK + accreditation.ticket}/`"
      target="_blank"
      rel="nofollow"
      >Смотреть в реестре аккредитаций</a
    >
  </div>
</template>

<script setup>
const ACCREDITATION_LINK = 'https://islod.obrnadzor.gov.ru/accredreestr/details/';

defineProps({
  type: {
    type: String,
    validator(value) {
      return ['license', 'accreditation'].indexOf(value) !== -1;
    },
    default: 'license',
  },

  data: {
    type: Array,
    default: () => {
      return [];
    },
  },

  hasLink: {
    type: Boolean,
    default: false,
  },
});

const licenseDate = (date) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
</script>

<style lang="scss">
.card-license {
  position: relative;
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  width: 100%;
  min-height: to-rem(176);
  padding: to-rem(24) to-rem(16);
  background-color: var(--base-gray-second);
  border-radius: to-rem(8);
  font-size: to-rem(16);
  line-height: to-rem(24);

  @media (min-width: 767px) {
    width: calc(50% - 8px);
    margin-bottom: 0;
  }

  @media (min-width: 1024px) {
    flex: 1;
    width: calc(50% - 16px);
  }

  &::after {
    content: '';
    position: absolute;
    top: to-rem(24);
    right: to-rem(16);
    width: to-rem(24);
    height: to-rem(24);
    background-image: url('~/assets/icons/doc.svg');
  }

  &__name {
    min-height: to-rem(72);
  }

  &__link {
    color: var(--base-blue);
    font-size: to-rem(12);
  }

  &__see {
    font-size: to-rem(12);
    line-height: to-rem(16);
  }
}
</style>
