<template>
  <component :is="tag" tabindex="0" role="option" @keyup.enter.prevent="onClickOption">
    <component
      :is="withLinks ? `a` : 'span'"
      :href="`/${route.name}/${computedLink}`"
      class="a-select__link"
      itemprop="name"
      @click.prevent="onClickOption"
      >{{ named }}</component
    >
    <meta itemprop="position" :content="index + 1" />
  </component>
</template>

<script setup>
const route = useRoute();
const router = useRouter();

const emit = defineEmits(['click']);

const props = defineProps({
  tag: {
    type: String,
    default: 'li',
  },
  option: {
    type: Object,
    default: () => {
      return {};
    },
  },
  withLinks: {
    type: Boolean,
    default: false,
  },
  withLinksName: {
    type: String,
    default: '',
  },
  itemText: {
    type: String,
    default: '',
  },
  index: {
    type: [String, Number, Object],
    default: '',
  },
});

async function onClickOption() {
  props.withLinks ? await router.push(`/${route.name}/${computedLink.value}`) : '';
  emit('click');
}

const named = computed(() => {
  return props.itemText.length
    ? hasDotSeparator.value
      ? convertedText(props.option, props.itemText)
      : props.option[props.itemText]
    : props.option.name || props.option;
});

const computedLink = computed(() => {
  const params = useConvertedToStore(route.params.path || []);

  let newParams = {};

  if (props.withLinksName === 'city') {
    newParams['subject'] = props.option.subject?.slug;
    newParams['city'] = props.option.slug;
  } else {
    newParams = { ...params };
  }

  if (props.withLinksName) {
    newParams[props.withLinksName] = props.option.slug;
  }

  const order = [
    'subject',
    'city',
    'direction',
    'level',
    'state',
    'budget',
    'atvuz',
    'military',
    'hostel',
    'distance',
    'sort',
  ];

  return useConvertedToQuery(useSortParams(order, newParams));
});
</script>

<style lang="scss" scoped></style>
