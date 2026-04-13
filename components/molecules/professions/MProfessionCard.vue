<template>
  <NuxtLink :to="`/professions/${slug}`" class="profession-card">
    <div class="profession-card__image">
      <NuxtImg 
        v-if="imagePath" 
        :src="imagePath" 
        :alt="name"
        load="lazy"
        class="profession-card__image-content"
      />
      <div v-else class="profession-card__image-placeholder">
        <IconCamera class="profession-card__image-placeholder-icon" />
      </div>
    </div>
    
    <div class="profession-card__content">
      <div class="profession-card__category">
        <template v-if="categories && categories.length > 0">
          {{ categories[0]?.name }}
        </template>
        <template v-else>
          {{ category?.name || direction?.name || 'Категория не указана' }}
        </template>
      </div>
      
      <h2 class="profession-card__title">
        {{ name }}
      </h2>
      
      <!-- <div class="profession-card__stats">
        <span class="profession-card__stat">{{ universityCount || 0 }} вуза</span>
        <span class="profession-card__separator profession-card__separator--dot">
          <IconArrowRight class="profession-card__arrow-icon" />
        </span>
        <span class="profession-card__stat">{{ collegeCount || 0 }} колледжа</span>
      </div> -->
    </div>
  </NuxtLink>
</template>

<script setup>
// import IconArrowRight from '@/assets/icons/arrow-right.svg';
import IconCamera from '@/assets/icons/camera.svg';

const props = defineProps({
  id: {
    type: [Number, String],
    default: null
  },
  name: {
    type: String,
    default: ''
  },
  slug: {
    type: String,
    default: ''
  },
  image: {
    type: [String, Object, null],
    default: null
  },
  category: {
    type: [Object, null],
    default: null
  },
  categories: {
    type: Array,
    default: () => []
  },
  direction: {
    type: [Object, null],
    default: null
  },
  universityCount: {
    type: [Number, String],
    default: 0
  },
  collegeCount: {
    type: [Number, String],
    default: 0
  },
  programCount: {
    type: [Number, String],
    default: 0
  }
});

// Вычисляем путь к изображению, если оно есть
const imagePath = computed(() => {
  if (!props.image) return null;
  
  // Проверяем, является ли props.image объектом
  if (typeof props.image === 'object' && props.image !== null) {
    // Предполагаем, что объект содержит путь к изображению в свойстве 'url', 'path' или 'src'
    return props.image.url || props.image.path || props.image.src || null;
  }
  
  // Если это строка, обрабатываем как раньше
  if (typeof props.image === 'string') {
    if (props.image.startsWith('http') || props.image.startsWith('/')) {
      return props.image;
    }
    return `/uploads/${props.image}`;
  }
  
  return null;
});
</script>

<style lang="scss" scoped>
.profession-card {
  display: block;
  text-decoration: none;
  border-radius: to-rem(12);
  overflow: hidden;
  background: var(--base-gray-smoky);
  box-shadow: 0 to-rem(4) to-rem(12) rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    box-shadow: 0 to-rem(8) to-rem(24) rgba(0, 0, 0, 0.1);
    transform: translateY(to-rem(-4));
    background-color: var(--base-gray-border);
  }
  
  &__image {
    width: 100%;
    overflow: hidden;
    position: relative;
    
    &-content {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  &__image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: var(--base-gray-border);
    position: relative;
    
    &-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: to-rem(108);
      height: to-rem(108);
      
      @media (max-width: 768px) {
        width: to-rem(100);
        height: to-rem(100);
      }
    }
  }
  
  &__content {
    padding: to-rem(16);
  }
  
  &__category {
    display: inline-block;
    background: transparent;
    color: var(--base-black-light);
    font-size: to-rem(12);
    font-weight: 500;
    line-height: 1;
    padding: to-rem(12) to-rem(16);
    border: 1px solid var(--base-gray-selection);
    border-radius: to-rem(32);
    margin-bottom: to-rem(8);
  }
  
  &__title {
    font-size: to-rem(24);
    font-weight: 700;
    line-height: 1.3;
    color: var(--base-blue);
    margin: 0 0 to-rem(12) 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  &__stats {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: to-rem(8);
    font-size: to-rem(13);
    color: var(--base-gray);
    transition: color 0.3s ease;
  }
  
  &__stat {
    white-space: nowrap;
  }
  
  &__separator {
    position: relative;
    display: inline-block;
    width: to-rem(4);
    height: to-rem(4);
    
    &--dot {
      border-radius: 50%;
      background-color: var(--base-gray);
    }
    
    .profession-card__arrow-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: none;
      width: to-rem(12);
      height: to-rem(8);
      
      path {
        stroke: var(--base-gray);
      }
    }
  }
  
  &:hover &__stats {
    color: var(--base-blue);
  }
  
  &:hover &__category {
    background: var(--base-white);
    border: var(--base-white);
    transition: all 0.3s ease;
  }
  
  &:hover &__separator--dot {
    background-color: transparent;
    
    .profession-card__arrow-icon {
      display: block;
      
      path {
        stroke: var(--base-blue);
      }
    }
  }
}
</style>
