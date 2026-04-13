<template>
  <section v-if="item" class="prof-card-block prof-card-block_bg" :class="is.diploma && 'prof-card-block_gray'">
    <ATitle v-if="!is.diploma && !is.careerProspects" tag="h2" class="prof-card-block__title">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-html="item.title"
    /></ATitle>

    <!-- eslint-disable-next-line vue/no-v-html -->
    <p v-if="(is.introduction || is.whoIs) && description" class="prof-card-block__description" v-html="description" />
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p v-if="is.whoIs && secondary" class="prof-card-block__secondary" v-html="secondary" />

    <template v-if="is.salary">
      <div v-if="tabs" class="prof-card-block__tabs">
        <AButton
          v-for="tab in tabs"
          :key="tab.slug"
          class="prof-card-block__tab"
          :variant="currentTab !== tab.slug ? 'contrast' : undefined"
          block
          @click="currentTab = tab.slug"
        >
          {{ tab.name }}
        </AButton>
      </div>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <p v-if="annotation" class="prof-card-block__description" v-html="annotation" />

      <div v-if="salaryItems?.length" ref="containerRef" class="prof-card-block__levels" v-bind="swiperSettings">
        <div v-for="level in salaryItems" :key="level[0]" class="prof-card-block__level">
          <div class="prof-card-block__tag">{{ `${level[0][0].toUpperCase()}${level[0].slice(1)}` }}</div>

          <div>
            <div class="prof-card-block__salary">
              {{ `от ${useCost(level[1].min, true)} до ${useCost(level[1].max, true)} тыс. ₽/мес` }}
            </div>
            <p v-if="level[1].description" class="prof-card-block__salary-description">{{ level[1].description }}</p>
          </div>
        </div>
      </div>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <p v-if="conclusion" class="prof-card-block__description last-desc" v-html="conclusion" />
    </template>

    <template v-if="isShowListItems">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p v-if="annotation" class="prof-card-block__description" v-html="annotation" />

      <ul v-if="listItems?.length" class="prof-card-block__list">
        <li v-for="(map, index) in listItems" :key="index" class="prof-card-block__item">
          <IconCheckProf v-if="is.whatDoes" class="prof-card-block__icon" />
          <div v-else class="prof-card-block__num">{{ index + 1 }}.</div>
          <div v-for="(value, key) in map" :key="key">
            <span class="prof-card-block__bold">{{ key }}:</span> {{ value }}
          </div>
        </li>
      </ul>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <p v-if="conclusion" class="prof-card-block__description last-desc" v-html="conclusion" />
    </template>

    <template v-if="is.plusMinus">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p v-if="annotation" class="prof-card-block__description" v-html="annotation" />

      <div class="prof-card-block__table-wrapper">
        <div class="prof-card-block__table">
          <div v-if="listItems.positive?.length" class="prof-card-block__column plus">
            <div class="prof-card-block__table-item">Плюсы</div>
            <div v-for="(positiveItem, index) in listItems.positive" :key="index" class="prof-card-block__table-item">
              <span v-for="(positiveValue, positiveKey) in positiveItem" :key="positiveKey">
                <span class="prof-card-block__bold">{{ positiveKey }}:</span> {{ positiveValue }}
              </span>
            </div>
          </div>
          <div v-if="listItems.negative?.length" class="prof-card-block__column minus">
            <div class="prof-card-block__table-item">Минусы</div>
            <div v-for="(negativeItem, index) in listItems.negative" :key="index" class="prof-card-block__table-item">
              <span v-for="(negativeValue, negativeKey) in negativeItem" :key="negativeKey">
                <span class="prof-card-block__bold">{{ negativeKey }}:</span> {{ negativeValue }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-if="is.diploma" class="prof-card-block__diploma">
      <ATitle tag="h2" class="prof-card-block__title prof-card-block__diploma-title">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="item.title"
      /></ATitle>

      <NuxtImg src="/images/diploma.webp" alt="Diploma" class="prof-card-block__diploma-img" loading="lazy" />

      <!-- eslint-disable-next-line vue/no-v-html -->
      <p v-if="annotation" class="prof-card-block__bold prof-card-block__diploma-top" v-html="annotation" />

      <!-- eslint-disable-next-line vue/no-v-html -->
      <p v-if="conclusion" class="prof-card-block__diploma-bottom last-desc" v-html="conclusion" />
      <!-- <IconGerb class="prof-card-block__gerb" /> -->
    </div>

    <div v-if="is.careerProspects" class="prof-card-block__career">
      <ATitle tag="h2" class="prof-card-block__title">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="item.title"
      /></ATitle>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <p v-if="annotation" class="prof-card-block__description" v-html="annotation" />

      <ul class="prof-card-block__cards">
        <li v-for="(card, index) in listItems" :key="index" class="prof-card-block__card">
          <template v-for="(cardValue, cardKey) in card" :key="cardKey">
            <p class="prof-card-block__bold prof-card-block__card-title">{{ cardKey }}</p>
            <p class="prof-card-block__card-description">{{ cardValue }}</p>
          </template>
        </li>
      </ul>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <p v-if="conclusion" class="prof-card-block__description last-desc" v-html="conclusion" />
    </div>
  </section>
</template>

<script setup>
import ATitle from '~/components/_ui/a-title.vue';
import AButton from '~/components/_ui/a-button.vue';
import IconCheckProf from '~/components/_icons/IconCheckProf.vue';

const props = defineProps({
  item: { type: Object, default: null },
  data: { type: Object, default: null },
});

const swiperSettings = {
  slidesPerView: 'auto',
  spaceBetween: 8,
  freeMode: true,
};

const is = computed(() => {
  const { block } = props.item || {};
  return {
    introduction: block === 'Вступление',
    whoIs: block === 'Кто такой',
    salary: block === 'Зарплата',
    whatDoes: block === 'Чем занимается',
    specialization: block === 'Специализация',
    whatQualities: block === 'Какими качествами должен обладать',
    plusMinus: block === 'Плюсы и минусы профессии',
    careerProspects: block === 'Перспективы карьерного роста в профессии',
    whereWork: block === 'Где может работать',
    diploma: block === 'Диплом',
  };
});

const description = computed(() => {
  const { data } = props.item || {};
  if (is.value.introduction && typeof data === 'string') return data;
  if (is.value.whoIs && typeof data === 'object' && data && 'primary' in data) return data.primary;
  return null;
});

const secondary = computed(() => {
  const { data } = props.item || {};
  if (is.value.whoIs && typeof data === 'object' && data && 'secondary' in data) return data.secondary;
  return null;
});

const tabs = computed(() =>
  is.value.salary && props.item?.data ? Object.keys(props.item.data).map((el) => ({ name: el, slug: el })) : null,
);
const currentTab = ref(tabs.value?.[0]?.slug ?? null);
const annotation = computed(() => props.item?.annotation);
const conclusion = computed(() => props.item?.conclusion);

const salaryItems = computed(() => {
  if (!is.value.salary || !props.item?.data) return null;
  const map = props.item.data[currentTab.value];
  if (!map) return null;
  const copy = { ...map };
  if (copy['начальный уровень'])
    copy['начальный уровень'] = { ...copy['начальный уровень'], description: `${props.data?.name ?? ''} без опыта` };
  if (copy['средний уровень'])
    copy['средний уровень'] = {
      ...copy['средний уровень'],
      description: `Могут зарабатывать опытные специалисты,
         а в крупных городах и на известных проектах эта сумма может быть значительно выше.`,
    };
  if (copy['эксперт'])
    copy['эксперт'] = {
      ...copy['эксперт'],
      description: `Может получать топовый ${
        props.data?.name ?? ''
      }, работающий на высокобюджетных проектах, а иногда и значительно больше.`,
    };
  return Object.entries(copy).reverse();
});

const listItems = computed(() => props.item?.data);
const isShowListItems = computed(
  () => is.value.whatDoes || is.value.whatQualities || is.value.specialization || is.value.whereWork,
);
</script>

<style lang="scss" scoped>
.prof-card-block {
  position: relative;
  scroll-margin-top: to-rem(56);
  background-color: var(--base-gray-10);
  border-radius: var(--border-radius-x4);

  @media (min-width: 768px) {
    scroll-margin-top: to-rem(66);
  }

  @media (min-width: 1024px) {
    scroll-margin-top: to-rem(76);
  }

  &_bg {
    background-color: var(--base-gray-10);
  }

  &_gray {
    background-color: var(--base-gray-20);
    border: to-rem(1) solid var(--color-border);
  }

  &__title {
    font-size: to-rem(28);
    line-height: to-rem(34);
    margin-bottom: to-rem(24);

    @media (min-width: 768px) {
      font-size: to-rem(34);
      line-height: to-rem(42);
    }
  }

  &__description {
    margin-bottom: to-rem(24);
    font-size: to-rem(14);
    line-height: to-rem(18);

    @media (min-width: 768px) {
      font-size: to-rem(16);
      line-height: to-rem(24);
    }

    &.last-desc {
      margin-bottom: 0;
    }
  }

  &__num {
    color: var(--base-blue);
    font-size: to-rem(16);
    line-height: to-rem(24);
    font-weight: 700;
  }

  &__tabs {
    display: flex;
    gap: to-rem(10);
    padding: to-rem(6);
    background-color: var(--base-gray-smoky);
    margin-bottom: to-rem(24);
    width: max-content;
    border-radius: var(--border-radius-x2);
    width: 100%;

    @media (min-width: 768px) {
      width: max-content;
    }
  }

  &__tab {
    width: 100%;
    border-radius: var(--border-radius-x2);
    font-size: to-rem(16);
    line-height: to-rem(24);
    padding-block: to-rem(12);

    @media (min-width: 768px) {
      padding: to-rem(12) to-rem(40);
    }
  }

  &__secondary {
    position: relative;
    padding: to-rem(16);
    font-size: to-rem(14);
    line-height: to-rem(18);

    @media (min-width: 768px) {
      font-size: to-rem(16);
      line-height: to-rem(24);
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background-color: var(--base-blue-light);
      width: to-rem(4);
    }

    &::after {
      content: '';
      inset: 0;
      position: absolute;
      background-color: var(--base-blue);
      opacity: 0.08;
    }
  }

  &:deep(.tabs) {
    margin-bottom: to-rem(24);
  }

  &__levels {
    display: flex;
    flex-direction: column;
    gap: to-rem(14);
    margin-bottom: to-rem(24);

    @media (min-width: 768px) {
      background-color: var(--base-gray-smoky);
      border-radius: to-rem(16);
      padding: to-rem(16);
      gap: to-rem(16);
    }
  }

  &__bold {
    font-weight: 600;
  }

  &__level {
    padding: to-rem(16);
    border-radius: to-rem(16);
    min-width: to-rem(240);
    background-color: var(--base-gray-smoky);

    @media (min-width: 768px) {
      background-color: var(--base-white);
      min-width: to-rem(274);
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    @media (min-width: 1024px) {
      width: 100%;
    }
  }

  &__career {
    @media (min-width: 768px) {
      background-color: var(--base-gray-smoky);
      padding: to-rem(16);
      border-radius: to-rem(16);
    }
  }

  &__tag {
    color: var(--base-gray-80);
    font-size: to-rem(14);
    line-height: to-rem(18);
    width: max-content;
    margin-bottom: to-rem(14);
  }

  &__salary {
    font-weight: 700;
    font-size: to-rem(20);
    line-height: to-rem(24);
    color: var(--base-blue);

    &-description {
      margin-top: to-rem(8);
      color: var(--base-gray);
      font-size: to-rem(14);
      line-height: to-rem(18);
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: to-rem(8);
    margin-bottom: to-rem(24);
  }

  &__item {
    display: flex;
    gap: to-rem(10);

    @media (min-width: 768px) {
      gap: to-rem(16);
    }
  }

  &__icon {
    flex-shrink: 0;
  }

  &__table-wrapper {
    overflow-x: auto;
  }

  &__table {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-radius: to-rem(16);
    border: to-rem(1) solid var(--base-gray-selection);
    overflow-y: hidden;

    &-item {
      min-width: to-rem(220);
      padding: to-rem(16) to-rem(20);
      overflow: hidden;

      &:first-child {
        background-color: var(--base-gray-smoky);
        color: var(--base-blue);
        font-size: to-rem(18);
        line-height: to-rem(26);
        font-weight: 600;
      }

      &:not(:last-child) {
        border-bottom: 1px solid var(--base-gray-selection);
      }

      &:not(:first-child) {
        min-height: to-rem(180);
        border-bottom: 1px solid var(--base-gray-selection);

        @media (min-width: 768px) {
          min-height: to-rem(100);
        }
      }

      &:last-child {
        border-bottom: 0;
      }
    }
  }

  &__column {
    &:first-child {
      border-right: to-rem(1) solid var(--base-gray-selection);
    }

    &.plus .prof-card-block__table-item:first-child {
      border-top-left-radius: to-rem(16);
    }
    &.minus .prof-card-block__table-item:first-child {
      border-top-right-radius: to-rem(16);
    }
  }

  &__diploma {
    position: relative;
    border-radius: var(--border-radius-x3);
    background-color: var(--base-blue-pale);
    padding: to-rem(24);

    &-title {
      max-width: 70%;
    }

    &-top {
      font-weight: 700;
      font-size: to-rem(14);
      line-height: to-rem(18);
      margin-bottom: to-rem(32);
      max-width: 70%;

      @media (min-width: 768px) {
        font-size: to-rem(16);
        line-height: to-rem(24);
        margin-bottom: to-rem(55);
      }
    }

    &-bottom {
      font-size: to-rem(14);
      line-height: to-rem(18);

      @media (min-width: 768px) {
        font-size: to-rem(16);
        line-height: to-rem(24);
      }
    }

    &-img {
      display: none;
      position: absolute;
      top: to-rem(24);
      right: to-rem(24);
      width: to-rem(184);

      @media (min-width: 768px) {
        display: block;
      }
    }
  }

  &__gerb {
    position: absolute;
    right: to-rem(20);
    top: 0;
    --base-blue: #111111;
    opacity: 0.1;
    height: 100%;
    width: to-rem(220);
  }

  &__cards {
    display: flex;
    flex-direction: column;
    gap: to-rem(14);
    margin-bottom: to-rem(24);

    @media (min-width: 768px) {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: to-rem(16);
    }
  }

  &__card {
    padding: to-rem(16);
    background-color: var(--base-gray-smoky);
    border-radius: to-rem(16);

    @media (min-width: 768px) {
      background-color: var(--base-white);
    }

    &-title {
      color: var(--base-blue);
      font-size: to-rem(18);
      line-height: to-rem(24);
      margin-bottom: to-rem(14);
      font-weight: 700;

      @media (min-width: 768px) {
        line-height: to-rem(20);
        margin-bottom: to-rem(28);
      }
    }

    &-description {
      font-size: to-rem(14);
      line-height: to-rem(18);
      color: var(--base-gray);

      @media (min-width: 768px) {
        line-height: to-rem(16);
        margin-bottom: to-rem(24);
      }
    }
  }
}
</style>
