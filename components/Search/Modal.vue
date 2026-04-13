<template>
  <div v-if="isActive" class="modal-search">
    <div class="modal-search__backdrop" @click="emit('update:modelValue', false)"></div>

    <div class="modal-search__container">
      <div ref="target" class="modal-search__card">
        <div class="modal-search__header">
          <ATitle tag="h2" class="modal-search__title">{{ title }}</ATitle>
          <ModalClose class="modal-search__close" @click="emit('update:modelValue', false)" />
        </div>
        <div class="modal-search__query">
          <AInput v-model="search" placeholder="Название или аббревиатура" type="text" size="large" block>
            <template #append>
              <template v-if="search.length">
                <SearchRemove class="modal-search__icon" @click="search = ''" />
              </template>
              <template v-else>
                <SearchInput />
              </template>
            </template>
          </AInput>
        </div>
        <div
          v-if="search.length === 0 && organizationsUniversity.length === 0 && organizationsCollege.length === 0"
          class="modal-search__plug modal-search__plug--default"
        >
          <NuxtImg
            src="/images/search-decor-mobile.webp"
            alt=""
            class="modal-search__decor"
            loading="lazy"
            width="176"
            height="166"
          />
          Поиск лицензированных<br />
          организаций
        </div>
        <div
          v-if="
            organizationsUniversity.length === 0 && organizationsCollege.length === 0 && search.length > 0 && !isLoading
          "
          class="modal-search__plug modal-search__plug--empty"
        >
          По вашему запросу ничего не найдено
        </div>
        <div class="modal-search__result">
          <template v-if="isLoading">
            <APreloader />
          </template>

          <template v-else>
            <SearchList
              v-if="organizationsCollege.length > 0"
              title="Колледжи"
              :data="organizationsCollege"
              class="mb-10"
              @click="onClickOutsideModal"
            />

            <SearchList
              v-if="organizationsUniversity.length > 0"
              title="Вузы"
              :data="organizationsUniversity"
              class="mb-10"
              @click="onClickOutsideModal"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ATitle from '~/components/_ui/a-title.vue';
import AInput from '~/components/_ui/a-input.vue';
import APreloader from '~/components/_ui/a-preloader.vue';
import ModalClose from '~/components/_icons/ModalClose.vue';
import SearchRemove from '~/components/_icons/SearchRemove.vue';
import SearchInput from '~/components/_icons/SearchInput.vue';
import SearchList from '~/components/Search/List.vue';
import { onClickOutside } from '@vueuse/core';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const target = ref(null);
onClickOutside(target, () => onClickOutsideModal());

function onClickOutsideModal() {
  search.value = '';
  organizationsUniversity.value = [];
  organizationsCollege.value = [];
  emit('update:modelValue', false);
}

const isActive = computed(() => props.modelValue);
const isLoading = ref(false);
const isSearching = ref(false);

const organizationsOpt = {
  with: 'subject,city,licenses,accreditations,metro,monitorings',
  is_active: true,
  has_license: true,
  perPage: 100,
  page: 1,
  name_or_abbr: '',
  type: '',
};

const search = ref('');
const organizationsUniversity = ref([]);
const organizationsCollege = ref([]);
const title = computed(() => `Поиск Колледжа или Вуза`);

const fetchOrganizations = async () => {
  try {
    const result = await $fetch('/api/organizations', {
      params: organizationsOpt,
    });

    organizationsUniversity.value = result.data?.length ? result.data.filter((org) => org.type === 'university') : [];
    organizationsCollege.value = result.data?.length ? result.data.filter((org) => org.type === 'college') : [];
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
    isSearching.value = false;
  }
};

const debouncedFetch = useDebounce((newValue) => {
  if (!newValue.trim().length) {
    isLoading.value = false;
    organizationsUniversity.value = [];
    organizationsCollege.value = [];

    return false;
  }

  organizationsOpt.name_or_abbr = newValue;
  fetchOrganizations();
}, 1000);

watch(
  () => search.value,
  (newValue) => {
    debouncedFetch(newValue);
  },
);
</script>

<style lang="scss">
.modal-search {
  position: fixed;
  z-index: 999999;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;

  &__backdrop {
    position: fixed;
    z-index: 1;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: var(--base-black);
    opacity: 0.6;
    pointer-events: all;
  }

  &__container {
    position: fixed;
    z-index: 1;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: to-rem(20);
    padding-left: to-rem(20);

    @media (min-width: 767px) {
      padding-right: to-rem(40);
      padding-left: to-rem(40);
    }
  }

  &__card {
    position: relative;
    overflow: hidden;
    width: 100%;
    max-width: to-rem(862);
    height: 100%;
    max-height: to-rem(483);
    padding: to-rem(24) to-rem(16);
    background-color: var(--base-white);
    border-radius: var(--border-radius-x2);

    @media (min-width: 767px) {
      max-height: to-rem(564);
      padding: to-rem(24);
    }

    @media (min-width: 1024px) {
      padding: to-rem(32) to-rem(48);
    }
  }

  &__title {
    flex: 1;
    font-size: to-rem(32);
    line-height: to-rem(40);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: to-rem(32);
  }

  &__query {
    margin-bottom: to-rem(32);
  }

  &__close {
    position: absolute;
    top: to-rem(10);
    right: to-rem(10);
    width: to-rem(32);
    height: to-rem(32);
    cursor: pointer;

    @media (min-width: 1024px) {
      top: to-rem(16);
      right: to-rem(16);
    }
  }

  &__result {
    overflow-y: auto;
    max-height: to-rem(230);
    padding-right: to-rem(8);

    @media (min-width: 767px) {
      max-height: to-rem(334);
    }

    &::-webkit-scrollbar-track {
      background-color: var(--base-gray-smoky);
      border-radius: to-rem(3);
    }

    &::-webkit-scrollbar {
      width: to-rem(3);
      background-color: var(--base-gray-selection);
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--base-blue);
      border-radius: to-rem(3);
    }
  }

  &__plug {
    position: relative;
    height: 100%;
    max-height: to-rem(230);
    padding: to-rem(24);
    color: var(--base-white);
    background-color: var(--base-blue-light);
    border-radius: to-rem(16);
    font-size: to-rem(18);
    font-weight: 700;
    line-height: 130%;

    @media (min-width: 767px) {
      max-height: to-rem(334);
      padding: to-rem(34) to-rem(64);
      font-size: to0rem(24);
      line-height: 130%;
    }

    &--default {
      overflow: hidden;
    }

    &--empty {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &__decor {
    position: absolute;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  &__icon {
    cursor: pointer;
  }
}
</style>
