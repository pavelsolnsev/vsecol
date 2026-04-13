<template>
  <div class="professions-list">
    <MProfessionCard
      v-for="profession in normalizedProfessions"
      :key="profession.id"
      v-bind="profession"
    />
  </div>
</template>

<script setup>
import MProfessionCard from '@/components/molecules/professions/MProfessionCard.vue';

const props = defineProps({
  professions: {
    type: Array,
    default: () => [],
  },
});

// Convert snake_case to camelCase and handle categories
const normalizedProfessions = computed(() => {
  return props.professions.map(prof => ({
    ...prof,
    category: prof.category || null, // сохраняем старое поле на всякий случай
    categories: prof.categories || [], // добавляем массив категорий
    universityCount: prof.university_count || prof.universityCount,
    collegeCount: prof.college_count || prof.collegeCount,
    programCount: prof.program_count || prof.programCount,
  }));
});
</script>
<style lang="scss">
.professions-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: to-rem(16);

  @media (min-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
    gap: to-rem(16);
  }

  @media (min-width: 1440px) {
    grid-template-columns: repeat(3, 1fr);
    gap: to-rem(24);
  }
}
</style>
