<template>
  <div class="org-speciality">
    <div class="org-speciality__header">
      <div
        v-if="data && data?.extra !== undefined && isAllEmpty"
        class="org-speciality__toggle"
        @click="isShow = !isShow"
      >
        <IconToggleUp v-if="isShow" />
        <IconToggleDown v-else />
      </div>
      <div class="org-speciality__code">{{ data?.code }}</div>
      <div class="org-speciality__name">
        <NuxtLink
          :to="`/${type === 'university' ? 'vuz' : 'kolledzh'}${
            subject === 'moskva' || subject === 'sankt-peterburg' ? '' : '/subject_' + subject
          }/city_${city}/spec_${data?.code}/`"
          >{{ data?.name }}</NuxtLink
        >
      </div>
    </div>
    <template v-if="isShow && data && data?.extra !== undefined">
      <div class="org-speciality__bases">
        <div v-if="data?.extra?.base?.nine_classes?.has" class="org-speciality__base">
          <component
            :is="data?.extra?.base?.nine_classes?.has ? HexagonPositive : HexagonNegative"
            class="p-organization__tags-icon"
          />
          На базе 9 классов
        </div>
        <div v-if="data?.extra?.base?.eleven_classes?.has" class="org-speciality__base">
          <component
            :is="data?.extra?.base?.eleven_classes?.has ? HexagonPositive : HexagonNegative"
            class="p-organization__tags-icon"
          />
          На базе 11 классов
        </div>
      </div>
      <div class="org-speciality__values">
        <table class="org-speciality__table">
          <thead>
            <tr>
              <th class="org-speciality__col">Формат</th>
              <th>Бюджет</th>
              <th>Платно</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="org-speciality__col">Очно</td>
              <td>{{ data?.extra?.form?.full_time?.places?.budget?.has ? '+' : '-' }}</td>
              <td>{{ data?.extra?.form?.full_time?.places?.commercial?.has ? '+' : '-' }}</td>
            </tr>
            <tr>
              <td class="org-speciality__col">Заочно</td>
              <td>{{ data?.extra?.form?.in_absentia?.places?.budget?.has ? '+' : '-' }}</td>
              <td>{{ data?.extra?.form?.in_absentia?.places?.commercial?.has ? '+' : '-' }}</td>
            </tr>
            <tr>
              <td class="org-speciality__col">Оно-заочно</td>
              <td>{{ data?.extra?.form?.mixed?.places?.budget?.has ? '+' : '-' }}</td>
              <td>{{ data?.extra?.form?.mixed?.places?.commercial?.has ? '+' : '-' }}</td>
            </tr>
            <tr>
              <td class="org-speciality__col">Дистанционно</td>
              <td>{{ data?.extra?.form?.remotely?.places?.budget?.has ? '+' : '-' }}</td>
              <td>{{ data?.extra?.form?.remotely?.places?.commercial?.has ? '+' : '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup>
import HexagonPositive from '~/components/_icons/HexagonPositive.vue';
import HexagonNegative from '~/components/_icons/HexagonNegative.vue';
import IconToggleUp from '~/components/_icons/IconToggleUp.vue';
import IconToggleDown from '~/components/_icons/IconToggleDown.vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {};
    },
  },
  subject: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
});

const isShow = ref(false);
const isAllEmpty = ref(
  !!props.data?.extra?.form?.full_time?.places?.budget?.has ||
    !!props.data?.extra?.form?.full_time?.places?.commercial?.has ||
    !!props.data?.extra?.form?.in_absentia?.places?.budget?.has ||
    !!props.data?.extra?.form?.in_absentia?.places?.commercial?.has ||
    !!props.data?.extra?.form?.mixed?.places?.budget?.has ||
    !!props.data?.extra?.form?.mixed?.places?.commercial?.has ||
    !!props.data?.extra?.form?.remotely?.places?.budget?.has ||
    !!props.data?.extra?.form?.remotely?.places?.commercial?.has,
);
</script>

<style lang="scss" scoped>
.org-speciality {
  position: relative;
  padding: to-rem(16);
  margin-bottom: to-rem(8);
  background-color: var(--base-white);

  &__toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: absolute;
    top: to-rem(16);
    right: to-rem(16);
    width: to-rem(32);
    height: to-rem(32);
    border-radius: 100%;
    border: to-rem(1) solid var(--base-gray-selection);
  }

  &__code {
    margin-bottom: to-rem(8);
  }

  &__header {
    padding-right: to-rem(44);
  }

  &__name {
    color: var(--base-blue);
    font-weight: 700;
  }

  &__bases {
    gap: to-rem(8);
    display: flex;
    margin-top: to-rem(24);
  }

  &__base {
    display: flex;
    align-items: center;
    color: var(--base-gray);
  }

  &__container {
    gap: to-rem(24);
    display: flex;
    flex-direction: column;

    @media (min-width: 1440px) {
      flex-direction: row;
    }
  }

  &__values {
    width: 100%;
  }

  &__table {
    width: 100%;

    th {
      padding: 0;
      padding-right: to-rem(16);
      padding-top: to-rem(16);
      padding-bottom: to-rem(16);
      font-size: to-rem(16);
      font-weight: 400;
      line-height: to-rem(24);
      color: var(--base-gray);
      border-bottom: to-rem(1) solid var(--base-gray-selection);

      &:last-child {
        padding-right: 0;
      }
    }

    td {
      padding: 0;
      padding-right: to-rem(16);
      text-align: center;
      padding-top: to-rem(12);
      padding-bottom: to-rem(12);
      font-size: to-rem(14);
      line-height: to-rem(18);
      color: var(--base-black-light);

      &:last-child {
        padding-right: 0;
      }
    }
  }

  &__col {
    width: 100%;
    text-align: left !important;
  }
}
</style>
