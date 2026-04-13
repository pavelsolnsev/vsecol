import { defineStore } from 'pinia';
import { useInfoStore } from '~/store/info';
import { levelsAll } from '~/shared/levels';

export const useFilterStore = defineStore({
  id: 'filter-store',

  state: () => {
    return {
      query: {
        subject: '',
        city: '',
        direction: '',
        level: '',
        state: false,
        budget: false,
        military: false,
        atvuz: false,
        hostel: false,
        distance: false,
        spec: '',
      },
      sort: '-okso-count',
      page: 1,
      cities: null,
      subjects: [
        {
          id: 1,
          slug: 'respublika-adygeya',
          name: 'Адыгея Республика',
          name_variations: {
            p_roditelny: 'Адыгеи',
          },
        },
        {
          id: 2,
          slug: 'respublika-bashkortostan',
          name: 'Башкортостан Республика',
          name_variations: {
            p_roditelny: 'Башкортостана',
          },
        },
        {
          id: 3,
          slug: 'respublika-buryatiya',
          name: 'Бурятия Республика',
          name_variations: {
            p_roditelny: 'Бурятии',
          },
        },
        {
          id: 4,
          slug: 'respublika-altay',
          name: 'Алтай Республика',
          name_variations: {
            p_roditelny: 'Алтая',
          },
        },
        {
          id: 5,
          slug: 'respublika-dagestan',
          name: 'Дагестан Республика',
          name_variations: {
            p_roditelny: 'Дагестана',
          },
        },
        {
          id: 6,
          slug: 'respublika-ingushetiya',
          name: 'Ингушетия Республика',
          name_variations: {
            p_roditelny: 'Ингушетии',
          },
        },
        {
          id: 7,
          slug: 'kabardino-balkarskaya-respublika',
          name: 'Кабардино-Балкария',
          name_variations: {
            p_roditelny: 'Кабардино-Балкарии',
          },
        },
        {
          id: 8,
          slug: 'respublika-kalmykiya',
          name: 'Калмыкия Республика',
          name_variations: {
            p_roditelny: 'Калмыкии',
          },
        },
        {
          id: 9,
          slug: 'karachaevo-cherkesskaya-respublika',
          name: 'Карачаево-Черкесия',
          name_variations: {
            p_roditelny: 'Карачаево-Черкесии',
          },
        },
        {
          id: 10,
          slug: 'respublika-kareliya',
          name: 'Карелия Республика',
          name_variations: {
            p_roditelny: 'Карелии',
          },
        },
        {
          id: 11,
          slug: 'respublika-komi',
          name: 'Коми Республика',
          name_variations: {
            p_roditelny: 'Коми',
          },
        },
        {
          id: 12,
          slug: 'respublika-mariy-el',
          name: 'Марий Эл Республика',
          name_variations: {
            p_roditelny: 'Марий Эл',
          },
        },
        {
          id: 13,
          slug: 'respublika-mordoviya',
          name: 'Мордовия Республика',
          name_variations: {
            p_roditelny: 'Мордовии',
          },
        },
        {
          id: 14,
          slug: 'respublika-saha-yakutiya',
          name: 'Саха (Якутия) Республика',
          name_variations: {
            p_roditelny: 'Саха (Якутии)',
          },
        },
        {
          id: 15,
          slug: 'respublika-severnaya-osetiya-alaniya',
          name: 'Северная Осетия Алания',
          name_variations: {
            p_roditelny: 'Северной Осетии Алании',
          },
        },
        {
          id: 16,
          slug: 'respublika-tatarstan',
          name: 'Татарстан Республика',
          name_variations: {
            p_roditelny: 'Татарстана',
          },
        },
        {
          id: 17,
          slug: 'respublika-tyva',
          name: 'Тыва Республика',
          name_variations: {
            p_roditelny: 'Тывы',
          },
        },
        {
          id: 18,
          slug: 'udmurtskaya-respublika',
          name: 'Удмуртская Республика',
          name_variations: {
            p_roditelny: 'Удмуртии',
          },
        },
        {
          id: 19,
          slug: 'respublika-hakasiya',
          name: 'Хакасия Республика',
          name_variations: {
            p_roditelny: 'Хакасии',
          },
        },
        {
          id: 20,
          slug: 'chechenskaya-respublika',
          name: 'Чеченская Республика',
          name_variations: {
            p_roditelny: 'Чечни',
          },
        },
        {
          id: 21,
          slug: 'chuvashskaya-respublika',
          name: 'Чувашская Республика',
          name_variations: {
            p_roditelny: 'Чувашии',
          },
        },
        {
          id: 22,
          slug: 'altayskiy-kray',
          name: 'Алтайский край',
          name_variations: {
            p_roditelny: 'Алтайского края',
          },
        },
        {
          id: 23,
          slug: 'krasnodarskiy-kray',
          name: 'Краснодарский край',
          name_variations: {
            p_roditelny: 'Краснодарского края',
          },
        },
        {
          id: 24,
          slug: 'krasnoyarskiy-kray',
          name: 'Красноярский край',
          name_variations: {
            p_roditelny: 'Красноярского края',
          },
        },
        {
          id: 25,
          slug: 'primorskiy-kray',
          name: 'Приморский край',
          name_variations: {
            p_roditelny: 'Приморья',
          },
        },
        {
          id: 26,
          slug: 'stavropolskiy-kray',
          name: 'Ставропольский край',
          name_variations: {
            p_roditelny: 'Ставропольского края',
          },
        },
        {
          id: 27,
          slug: 'habarovskiy-kray',
          name: 'Хабаровский край',
          name_variations: {
            p_roditelny: 'Хабаровского края',
          },
        },
        {
          id: 28,
          slug: 'amurskaya-oblast',
          name: 'Амурская область',
          name_variations: {
            p_roditelny: 'Амурской области',
          },
        },
        {
          id: 29,
          slug: 'arhangelskaya-oblast',
          name: 'Архангельская область',
          name_variations: {
            p_roditelny: 'Архангельской области',
          },
        },
        {
          id: 30,
          slug: 'astrahanskaya-oblast',
          name: 'Астраханская область',
          name_variations: {
            p_roditelny: 'Астраханской области',
          },
        },
        {
          id: 31,
          slug: 'belgorodskaya-oblast',
          name: 'Белгородская область',
          name_variations: {
            p_roditelny: 'Белгородской области',
          },
        },
        {
          id: 32,
          slug: 'bryanskaya-oblast',
          name: 'Брянская область',
          name_variations: {
            p_roditelny: 'Брянской области',
          },
        },
        {
          id: 33,
          slug: 'vladimirskaya-oblast',
          name: 'Владимирская область',
          name_variations: {
            p_roditelny: 'Владимирской области',
          },
        },
        {
          id: 34,
          slug: 'volgogradskaya-oblast',
          name: 'Волгоградская область',
          name_variations: {
            p_roditelny: 'Волгоградской области',
          },
        },
        {
          id: 35,
          slug: 'vologodskaya-oblast',
          name: 'Вологодская область',
          name_variations: {
            p_roditelny: 'Вологодской области',
          },
        },
        {
          id: 36,
          slug: 'voronezhskaya-oblast',
          name: 'Воронежская область',
          name_variations: {
            p_roditelny: 'Воронежской области',
          },
        },
        {
          id: 37,
          slug: 'ivanovskaya-oblast',
          name: 'Ивановская область',
          name_variations: {
            p_roditelny: 'Ивановской области',
          },
        },
        {
          id: 38,
          slug: 'irkutskaya-oblast',
          name: 'Иркутская область',
          name_variations: {
            p_roditelny: 'Иркутской области',
          },
        },
        {
          id: 39,
          slug: 'kaliningradskaya-oblast',
          name: 'Калининградская область',
          name_variations: {
            p_roditelny: 'Калининградской области',
          },
        },
        {
          id: 40,
          slug: 'kaluzhskaya-oblast',
          name: 'Калужская область',
          name_variations: {
            p_roditelny: 'Калужской области',
          },
        },
        {
          id: 41,
          slug: 'kamchatskiy-kray',
          name: 'Камчатский край',
          name_variations: {
            p_roditelny: 'Камчатского края',
          },
        },
        {
          id: 42,
          slug: 'kemerovskaya-oblast',
          name: 'Кемеровская область',
          name_variations: {
            p_roditelny: 'Кемеровской области',
          },
        },
        {
          id: 43,
          slug: 'kirovskaya-oblast',
          name: 'Кировская область',
          name_variations: {
            p_roditelny: 'Кировской области',
          },
        },
        {
          id: 44,
          slug: 'kostromskaya-oblast',
          name: 'Костромская область',
          name_variations: {
            p_roditelny: 'Костромской области',
          },
        },
        {
          id: 45,
          slug: 'kurganskaya-oblast',
          name: 'Курганская область',
          name_variations: {
            p_roditelny: 'Курганской области',
          },
        },
        {
          id: 46,
          slug: 'kurskaya-oblast',
          name: 'Курская область',
          name_variations: {
            p_roditelny: 'Курской области',
          },
        },
        {
          id: 47,
          slug: 'leningradskaya-oblast',
          name: 'Ленинградская область',
          name_variations: {
            p_roditelny: 'Ленинградской области',
          },
        },
        {
          id: 48,
          slug: 'lipetskaya-oblast',
          name: 'Липецкая область',
          name_variations: {
            p_roditelny: 'Липецкой области',
          },
        },
        {
          id: 49,
          slug: 'magadanskaya-oblast',
          name: 'Магаданская область',
          name_variations: {
            p_roditelny: 'Магаданской области',
          },
        },
        {
          id: 50,
          slug: 'moskovskaya-oblast',
          name: 'Московская область',
          name_variations: {
            p_roditelny: 'Московской области',
          },
        },
        {
          id: 51,
          slug: 'murmanskaya-oblast',
          name: 'Мурманская область',
          name_variations: {
            p_roditelny: 'Мурманской области',
          },
        },
        {
          id: 52,
          slug: 'nizhegorodskaya-oblast',
          name: 'Нижегородская область',
          name_variations: {
            p_roditelny: 'Нижегородской области',
          },
        },
        {
          id: 53,
          slug: 'novgorodskaya-oblast',
          name: 'Новгородская область',
          name_variations: {
            p_roditelny: 'Новгородской области',
          },
        },
        {
          id: 54,
          slug: 'novosibirskaya-oblast',
          name: 'Новосибирская область',
          name_variations: {
            p_roditelny: 'Новосибирской области',
          },
        },
        {
          id: 55,
          slug: 'omskaya-oblast',
          name: 'Омская область',
          name_variations: {
            p_roditelny: 'Омской области',
          },
        },
        {
          id: 56,
          slug: 'orenburgskaya-oblast',
          name: 'Оренбургская область',
          name_variations: {
            p_roditelny: 'Оренбургской области',
          },
        },
        {
          id: 57,
          slug: 'orlovskaya-oblast',
          name: 'Орловская область',
          name_variations: {
            p_roditelny: 'Орловской области',
          },
        },
        {
          id: 58,
          slug: 'penzenskaya-oblast',
          name: 'Пензенская область',
          name_variations: {
            p_roditelny: 'Пензенской области',
          },
        },
        {
          id: 59,
          slug: 'permskiy-kray',
          name: 'Пермский край',
          name_variations: {
            p_roditelny: 'Пермского края',
          },
        },
        {
          id: 60,
          slug: 'pskovskaya-oblast',
          name: 'Псковская область',
          name_variations: {
            p_roditelny: 'Псковской области',
          },
        },
        {
          id: 61,
          slug: 'rostovskaya-oblast',
          name: 'Ростовская область',
          name_variations: {
            p_roditelny: 'Ростовской области',
          },
        },
        {
          id: 62,
          slug: 'ryazanskaya-oblast',
          name: 'Рязанская область',
          name_variations: {
            p_roditelny: 'Рязанской области',
          },
        },
        {
          id: 63,
          slug: 'samarskaya-oblast',
          name: 'Самарская область',
          name_variations: {
            p_roditelny: 'Самарской области',
          },
        },
        {
          id: 64,
          slug: 'saratovskaya-oblast',
          name: 'Саратовская область',
          name_variations: {
            p_roditelny: 'Саратовской области',
          },
        },
        {
          id: 65,
          slug: 'sahalinskaya-oblast',
          name: 'Сахалинская область',
          name_variations: {
            p_roditelny: 'Сахалинской области',
          },
        },
        {
          id: 66,
          slug: 'sverdlovskaya-oblast',
          name: 'Свердловская область',
          name_variations: {
            p_roditelny: 'Свердловской области',
          },
        },
        {
          id: 67,
          slug: 'smolenskaya-oblast',
          name: 'Смоленская область',
          name_variations: {
            p_roditelny: 'Смоленской области',
          },
        },
        {
          id: 68,
          slug: 'tambovskaya-oblast',
          name: 'Тамбовская область',
          name_variations: {
            p_roditelny: 'Тамбовской области',
          },
        },
        {
          id: 69,
          slug: 'tverskaya-oblast',
          name: 'Тверская область',
          name_variations: {
            p_roditelny: 'Тверской области',
          },
        },
        {
          id: 70,
          slug: 'tomskaya-oblast',
          name: 'Томская область',
          name_variations: {
            p_roditelny: 'Томской области',
          },
        },
        {
          id: 71,
          slug: 'tulskaya-oblast',
          name: 'Тульская область',
          name_variations: {
            p_roditelny: 'Тульской области',
          },
        },
        {
          id: 72,
          slug: 'tyumenskaya-oblast',
          name: 'Тюменская область',
          name_variations: {
            p_roditelny: 'Тюменской области',
          },
        },
        {
          id: 73,
          slug: 'ulyanovskaya-oblast',
          name: 'Ульяновская область',
          name_variations: {
            p_roditelny: 'Ульяновской области',
          },
        },
        {
          id: 74,
          slug: 'chelyabinskaya-oblast',
          name: 'Челябинская область',
          name_variations: {
            p_roditelny: 'Челябинской области',
          },
        },
        {
          id: 75,
          slug: 'zabaykalskiy-kray',
          name: 'Забайкальский край',
          name_variations: {
            p_roditelny: 'Забайкальского края',
          },
        },
        {
          id: 76,
          slug: 'yaroslavskaya-oblast',
          name: 'Ярославская область',
          name_variations: {
            p_roditelny: 'Ярославской области',
          },
        },
        {
          id: 77,
          slug: 'moskva',
          name: 'Москва',
          name_variations: {
            p_roditelny: 'Москвы',
          },
        },
        {
          id: 78,
          slug: 'sankt-peterburg',
          name: 'Санкт-Петербург',
          name_variations: {
            p_roditelny: 'Санкт-Петербурга',
          },
        },
        {
          id: 79,
          slug: 'evreyskaya-avtonomnaya-oblast',
          name: 'Еврейская АО',
          name_variations: {
            p_roditelny: 'Еврейской АО',
          },
        },
        {
          id: 80,
          slug: 'nenetskiy-ao',
          name: 'Ненецкий AO',
          name_variations: {
            p_roditelny: 'Ненецкой AO',
          },
        },
        {
          id: 81,
          slug: 'hmao',
          name: 'Ханты-Мансийский AO',
          name_variations: {
            p_roditelny: 'Ханты-Мансийской AO',
          },
        },
        {
          id: 82,
          slug: 'chukotka',
          name: 'Чукотский AO',
          name_variations: {
            p_roditelny: 'Чукотской AO',
          },
        },
        {
          id: 83,
          slug: 'yamalo-nenetskiy-avtonomnyy-okrug',
          name: 'Ямало-Ненецкий AO',
          name_variations: {
            p_roditelny: 'Ямало-Ненецкого AO',
          },
        },
        {
          id: 84,
          slug: 'krym',
          name: 'Крым Республика',
          name_variations: {
            p_roditelny: 'Крыма',
          },
        },
      ],
      speciality: null,
      directions: null,
      levels: null,
      city: {},
    };
  },

  actions: {
    findSubjectById(id) {
      return this.subjects && this.subjects.find((subject) => subject.id === id);
    },

    getDirectionBySlug(slug) {
      return this.directions && this.directions.find((direction) => direction.slug === slug)?.id;
    },

    getLevelIdBySlug(slug) {
      return levelsAll.find((level) => level.slug === slug)?.value;
    },

    findSubjectBySlug(slug) {
      return this.subjects.find((subject) => subject.slug === slug);
    },

    async fetchCity(slug) {
      if (!slug) return;

      const { data: result } = await $fetch(`/api/cities`, {
        params: {
          with: 'subject',
          slug: slug,
        },
      });

      return result?.length ? result[0] : null;
    },

    async fetchSubject(slug) {
      if (!slug) return;

      const { data: result } = await $fetch(`/api/subjects`, {
        params: {
          with: 'cities',
          slug: slug,
        },
      });

      return result?.length ? result[0] : null;
    },

    async fetchDirections(slug) {
      if (!slug) return;

      const { data: result } = await $fetch(`/api/directions`, {
        params: {
          slug: slug,
          use_about: true,
        },
      });

      return result?.length ? result[0] : null;
    },

    async fetchLevels() {
      if (this.levels) return this.levels;

      const { data: result } = await $fetch(`/api/levels/`);

      if (result?.length) {
        this.levels = result;
      }

      return this.levels;
    },

    async fetchCityById(id) {
      const { data: result } = await $fetch(`/api/cities`, {
        params: {
          with: 'subject',
          id: id,
        },
      });

      return result?.length ? result[0] : null;
    },

  },

  getters: {
    hasCity: (state) => !!state.query.city,
    hasSubject: (state) =>
      !!state.query.subject && state.query.subject !== 'moskva' && state.query.subject !== 'sankt-peterburg',
    hasSpeciality: (state) => !!(state.speciality && Object.keys(state.speciality).length),
    hasDirectionAndLevel: (state) => !!state.query.direction && !!state.query.level,
    // global has
    hasCities: (state) => !!state.cities && !!state.cities.length,
    hasCitiesCollege: (state) => !!state.cities && !!state.cities.college && !!state.cities.college.length,
    hasCitiesUniversity: (state) => !!state.cities && !!state.cities.university && !!state.cities.university.length,
    hasSubjects: (state) => !!state.subjects && !!state.subjects.length,
    hasDirections: (state) => !!state.directions && !!state.directions.length,
    hasLevels: (state) => !!state.levels && !!state.levels.length,

    isFiltered: (getters) => {
      let result = false;
      for (let key in getters.currentQuery) {
        if (key !== 'city' && key !== 'page' && key !== 'subject') {
          if (getters.currentQuery[key] !== undefined) {
            result = true;
          }
        }
      }

      return result;
    },
    // subject
    storeSubject: (state) => state.subjects && state.subjects.find((subject) => subject.slug === state.query.subject),
    subjectId: (state) => state.subjects && state.subjects.find((subject) => subject.slug === state.query.subject)?.id,
    subjectSlug: (state) =>
      state.subjects && state.subjects.find((subject) => subject.slug === state.query.subject)?.slug,
    subjectName: (state) =>
      state.subjects && state.subjects.find((subject) => subject.slug === state.query.subject)?.name,
    subjectNameVariant: (state) =>
      state.subjects &&
      state.subjects.find((subject) => subject.slug === state.query.subject)?.name_variations.p_roditelny,
    // direction
    storeDirection: (state) =>
      state.directions && state.directions.find((direction) => direction.slug === state.query.direction),
    directionId: (state) =>
      state.directions && state.directions.find((direction) => direction.slug === state.query.direction)?.id,
    directionName: (state) =>
      state.directions && state.directions.find((direction) => direction.slug === state.query.direction)?.name,
    directionVariant: (state) =>
      state.directions &&
      state.directions.find((direction) => direction.slug === state.query.direction)?.name_variations.p_roditelny,
    // level
    storeLevel: (state) => {
      return state.query.level && levelsAll.find((level) => level.slug === state.query.level);
    },
    levelName: (state) => {
      return state.query.level && levelsAll.find((level) => level.slug === state.query.level)?.name;
    },
    levelNameVariant: (state) => {
      return state.query.level && levelsAll.find((level) => level.slug === state.query.level)?.nameVariant;
    },
    levelValue: (state) => {
      return state.query.level && levelsAll.find((level) => level.slug === state.query.level)?.value;
    },
    // spec
    storeSpec: (state) => {
      return state.speciality && { name: state.speciality.name, code: state.speciality.code };
    },
    specShortName: (state) =>
      (state.speciality && Object.keys(state.speciality).length > 0 && state.speciality?.name.split('(')[0].trim()) ||
      undefined,
    // lists
    directionsList: (state) => {
      const storeInfo = useInfoStore();

      return storeInfo.isUniversity
        ? state.directions &&
            useSortArrayByField(
              state.directions.filter((direction) => direction.in_university),
              'university_pop',
            )
        : state.directions &&
            useSortArrayByField(
              state.directions.filter((direction) => direction.in_college),
              'college_pop',
            );
    },

    // dictionary
    dictLevels: (state) => {
      return {
        college:
          state.levels &&
          state.levels
            .filter((level) => level.in_college)
            .map((item) => ({
              id: item.id,
              slug: item.slug,
              name: item.name,
              middle_code: item.okso6_middle_code,
            })),
        university:
          state.levels &&
          state.levels
            .filter((level) => level.in_university)
            .map((item) => ({
              id: item.id,
              slug: item.slug,
              name: item.name,
              middle_code: item.okso6_middle_code,
            })),
      };
    },

    levelsUniversity: (state) =>
      state.levels &&
      state.levels
        .filter((level) => level.in_university)
        .map((i) => ({
          id: i.id,
          name: i.name,
          slug: i.slug,
          middle_code: i.okso6_middle_code,
        })),
    levelsCollege: (state) =>
      state.levels &&
      state.levels
        .filter((level) => level.in_college)
        .map((i) => ({
          id: i.id,
          name: i.name,
          slug: i.slug,
          middle_code: i.okso6_middle_code,
        })),

    // query
    currentQuery: (state) => ({
      city: state.query.city ? state.query.city : undefined,
      subject: state.query.subject ? state.query.subject : undefined,
      direction: state.query.direction ? state.query.direction : undefined,
      level: state.query.level ? state.query.level : undefined,
      spec: state.query.spec ? state.query.spec : undefined,
      state: state.query.state ? state.query.state : undefined,
      budget: state.query.budget ? state.query.budget : undefined,
      atvuz: state.query.atvuz ? state.query.atvuz : undefined,
      military: state.query.military ? state.query.military : undefined,
      hostel: state.query.hostel ? state.query.hostel : undefined,
      distance: state.query.distance ? state.query.distance : undefined,
      //sort: state.query.sort ? state.query.sort : undefined,
      page: state.page || undefined,
    }),

    metaTitles: (state) => [
      state.query.state ? (state.query.state === true ? 'государственные' : 'негосударственные') : '',
      state.query.budget ? 'бюджетные' : '',
      state.query.atvuz ? 'при вузах' : '',
      state.query.hostel ? 'с общежитием' : '',
      state.query.military ? 'с военной кафедрой' : '',
      state.query.distance ? 'дистанционно' : '',
    ],

    seoTitles: (state) => [
      state.query.atvuz ? 'при вузе' : '',
      state.query.budget ? 'c бюджетными местами' : '',
      state.query.hostel ? 'c общежитием' : '',
      state.query.military ? 'c военной кафедрой' : '',
      state.query.distance ? 'дистанционным обучением' : '',
    ],

    seoTitle: (getters) => {
      let result = '';
      getters.seoTitles
        .filter((item) => item.length)
        .forEach((item, index, array) => {
          if (index > 0 && array.length > 1 && item !== 'дистанционным обучением') {
            result += `, ${item}`;
          } else if (item === 'дистанционным обучением') {
            if (array.length === 1) {
              result += `с ${item}`;
            } else {
              result += ` и ${item}`;
            }
          } else {
            result += `${item}`;
          }
        });
      return result;
    },

    seoTitlesAnswer: (state) => [
      state.query.atvuz ? 'при вузе' : '',
      state.query.budget ? 'c бюджетными местами' : '',
      state.query.hostel ? 'c общежитием' : '',
      state.query.military ? 'c военной кафедрой' : '',
    ],

    seoTitleAnswer: (getters) => {
      let result = '';
      getters.seoTitlesAnswer
        .filter((item) => item.length)
        .forEach((item, index, array) => {
          if (index > 0 && array.length > 1) {
            result += `, ${item}`;
          } else {
            result += `${item}`;
          }
        });
      return result;
    },

    metaTitle: (getters) => {
      let result = '';
      getters.metaTitles
        .filter((item) => item.length)
        .forEach((item, index, array) => {
          if (item.length > 0) {
            if (index < array.length - 1) {
              result += `${item}, `;
            } else {
              result += item;
            }
          }
        });
      return result;
    },

    metaKeywords: (getters) => {
      let result = '';
      getters.metaTitles
        .filter((item) => item.length)
        .forEach((item, index, array) => {
          if (item.length > 0) {
            if (index < array.length - 1) {
              result += `${item} `;
            } else {
              result += item;
            }
          }
        });
      return result;
    },
  },
});
