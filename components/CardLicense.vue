<template>
  <template v-if="type === 'license'">
    <div class="card-license">
      <p class="card-license__name">Лицензия<br />№ {{ data?.number }}<br />от {{ licenseDate(data?.issued_at) }}</p>

      <a
        v-if="data?.ticket && hasLink"
        class="card-license__link"
        :href="`${LICENSE_LINK + data?.ticket}/`"
        target="_blank"
        rel="nofollow"
        >Смотреть в реестре лицензий</a
      >
    </div>
  </template>
  <template v-else>
    <div class="card-license">
      <p class="card-license__name">
        Аккредитация<br />№ {{ data?.number }}<br />от {{ licenseDate(data?.issued_at) }}
      </p>
      <a
        v-if="data?.ticket && hasLink"
        class="card-license__link"
        :href="`${ACCREDITATION_LINK + data?.ticket}/`"
        target="_blank"
        rel="nofollow"
        >Смотреть в реестре аккредитаций</a
      >
    </div>
  </template>
</template>

<script setup>
const LICENSE_LINK = 'https://islod.obrnadzor.gov.ru/rlic/details/';
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
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  min-height: to-rem(176);
  padding: to-rem(24) to-rem(16);
  background-color: var(--base-gray-second);
  border-radius: to-rem(8);
  font-size: to-rem(16);
  line-height: to-rem(24);

  @media (min-width: 767px) {
    margin-bottom: 0;
  }

  @media (min-width: 1024px) {
    flex: 1;
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
