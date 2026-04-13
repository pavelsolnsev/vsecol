<template>
  <PPage css-class="p-check">
    <ATitle tag="h1" class="mb-8">
      {{ title }}
      <template v-if="currentOrg">
        {{ currentOrg.name }}
      </template>
    </ATitle>

    <div class="p-check__search mb-12">
      <div class="p-check__search--col-left">
        <div class="p-check__query">
          <AInput v-model="search" size="large" placeholder="Название или аббевиатура" block>
            <template #append>
              <AButton size="medium" label="Искать" block @click="handleSearch" />
            </template>
          </AInput>

          <div v-if="isSearching" class="p-check__result">
            <ListingCheck
              v-if="organizationsCollege?.length > 0"
              title="Колледжи"
              :data="organizationsCollege"
              class="mb-10"
              @click="handleCLick"
            />

            <ListingCheck
              v-if="organizationsUniversity?.length > 0"
              title="Вузы"
              :data="organizationsUniversity"
              @click="handleCLick"
            />
          </div>
        </div>
      </div>
      <div class="p-check__search--col-right">
        <AButton size="large" label="Проверить" block :disabled="!currentOrg" @click="handleCheck" />
      </div>
    </div>

    <div class="p-check__row mb-10">
      <div class="p-check__col p-check__col--left">
        <div class="p-check__content">
          <ATitle tag="h2" class="p-check__title mb-4"
            >Мы проверим онлайн следующие данные по состоянию на {{ nowDate }} г.:</ATitle
          >

          <ul class="list-styled mb-10">
            <li>Лицензия на образовательную деятельность</li>
            <li>Лицензированные специальности</li>
            <li>Аккредитацию образовательных программ (гос. диплом, отсрочка от армии)</li>
          </ul>

          <ATitle tag="h2" class="mb-4">Также в отчете будет следующая информация:</ATitle>

          <ul class="list-styled">
            <li>Учредитель, организационно-правовая форма</li>
            <li>Статистика приема</li>
            <li>Данные мониторинга Министерства образования РФ</li>
            <li>Наличие общежития, военной кафедры</li>
            <li>Контактные данные</li>
          </ul>
        </div>

        <div class="p-check__exclam mt-10 mb-10">
          <div class="p-check__exclam-item">
            <HexagonExclamation class="p-check__exclam-icon" />
            <span
              >Проверка может занимать от 5 минут до 24 часов в зависимости от ответа сервера реестра лицензий и
              аккредитаций</span
            >
          </div>
          <div class="p-check__exclam-item">
            <HexagonExclamation class="p-check__exclam-icon" />
            <span
              >Результат проверки будет доступен в личном кабинете по одноразовому паролю, отправленному на номер
              мобильного телефона.</span
            >
          </div>
        </div>
      </div>
    </div>
  </PPage>
</template>

<script setup>
import PPage from '~/components/_ui/p-page.vue';
import ATitle from '~/components/_ui/a-title.vue';
import AInput from '~/components/_ui/a-input.vue';
import AButton from '~/components/_ui/a-button.vue';
import ListingCheck from '~/components/Listing/Check.vue';
import HexagonExclamation from '~/components/_icons/HexagonExclamation.vue';
import { useAuthStore } from '~/store/auth';

const storeAuth = useAuthStore();
const { verification } = storeToRefs(storeAuth);

const title = computed(() => `Проверка организации`);

const search = ref(storeAuth.election.name || '');
const currentOrg = ref(storeAuth.election || '');
const organizationsUniversity = ref([]);
const organizationsCollege = ref([]);

const event = new Date();
const options = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
};

const nowDate = computed(() => event.toLocaleDateString('ru-RU', options));

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

const fetchOrganizations = async () => {
  try {
    const result = await $fetch(`/api/organizations`, {
      params: organizationsOpt,
    });

    organizationsUniversity.value = result.data?.filter((org) => org.type === 'university') || [];
    organizationsCollege.value = result.data?.filter((org) => org.type === 'college') || [];
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const debouncedFetch = useDebounce((newValue) => {
  isSearching.value = true;

  if (!newValue.trim().length) {
    isLoading.value = false;
    isSearching.value = false;
    organizationsUniversity.value = [];
    organizationsCollege.value = [];

    return false;
  }

  organizationsOpt.name_or_abbr = newValue;
  fetchOrganizations();
}, 1000);

const handleSearch = () => {
  debouncedFetch(search.value);
};

const handleCLick = ({ id: id, name: name }) => {
  search.value = name;
  currentOrg.value = { id, name };

  organizationsCollege.value = [];
  organizationsUniversity.value = [];

  isSearching.value = false;
};

const handleCheck = async () => {
  verification.value = currentOrg.value;

  await navigateTo('/profile/');
};
</script>

<style lang="scss" scoped>
.p-check {
  &__title {
    max-width: to-rem(530);
  }

  &__search {
    display: flex;
    flex-direction: column;

    @media (min-width: 767px) {
      flex-direction: row;
    }

    &--col-left {
      flex: 1;
    }

    &--col-right {
      display: flex;
      gap: to-rem(8);
      margin-top: to-rem(12);

      @media (min-width: 767px) {
        width: to-rem(202);
        margin-top: 0;
        margin-left: to-rem(12);
      }

      @media (min-width: 1440px) {
        width: to-rem(304);
        margin-top: 0;
        margin-left: to-rem(32);
      }
    }
  }

  &__row {
    display: flex;
    flex-direction: column;

    @media (min-width: 1440px) {
      flex-direction: row;
    }
  }

  &__col {
    &--left {
      flex: 1;
    }

    &--right {
      margin-top: to-rem(12);

      @media (min-width: 767px) {
        width: 100%;
        margin-top: 0;
        margin-left: 0;
      }

      @media (min-width: 1440px) {
        width: to-rem(304);
        margin-top: 0;
        margin-left: to-rem(32);
      }
    }
  }

  &__content {
    margin-left: to-rem(-20);
    margin-right: to-rem(-20);

    padding: to-rem(40) to-rem(20);
    background-color: var(--base-gray-smoky);

    @media (min-width: 767px) {
      padding: to-rem(24);
    }

    @media (min-width: 1024px) {
      margin-left: 0;
      margin-right: 0;
    }
  }

  &__exclam {
    &-item {
      display: flex;
      align-items: flex-start;

      margin-bottom: to-rem(16);

      &:last-child {
        margin-bottom: 0;
      }

      @media (min-width: 1024px) {
        max-width: to-rem(704);
      }

      @media (min-width: 1440px) {
        max-width: to-rem(664);
      }
    }

    &-icon {
      width: to-rem(28);
      margin-right: to-rem(12);
    }

    span {
      flex: 1;
    }
  }

  &__query {
    position: relative;
  }

  &__result {
    max-height: to-rem(334);
    overflow-y: auto;
    z-index: 1;
    position: absolute;
    top: to-rem(60);
    left: 0;
    right: 0;
    padding: to-rem(16);
    background-color: var(--base-white);

    @include block-scroll;
  }
}

.list-styled {
  li {
    position: relative;
    margin-bottom: to-rem(8);
    padding-left: to-rem(20);
    line-height: to-rem(24);

    &::before {
      content: '';
      width: to-rem(8);
      height: to-rem(8);
      border-radius: 100%;
      background-color: var(--base-blue);

      position: absolute;
      left: 0;
      top: to-rem(8);
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
