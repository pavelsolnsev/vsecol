<template>
  <button
    class="ai-consultant-button"
    :class="{
      open: isOpen,
    }"
    @click="openChat"
  >
    <NuxtImg
      src="/images/ai-bot.webp"
      width="51"
      height="49"
      alt="AI Icon"
      loading="lazy"
      class="ai-consultant-button__icon"
    />

    <span class="ai-consultant-button__title"><span class="hidden-text">Спросить</span> AI</span>
  </button>

  <AModal
    v-model="isOpen"
    indent
    :max-width="storeDevice.isWideDesktop || storeDevice.isDesktop || storeDevice.isDesktop ? '630px' : '100%'"
    is-outline-close
    @update:model-value="closeChat"
  >
    <div class="ai-consultant">
      <header class="ai-consultant__header">
        <NuxtImg
          src="/images/ai-header.webp"
          alt="AI Icon"
          width="101"
          height="100"
          class="ai-consultant__icon"
          loading="lazy"
        />

        <p class="ai-consultant__header-content">Привет, я твой AI помощник</p>
      </header>

      <div class="ai-consultant__content">
        <p v-if="phoneParams.isManyAttempts" class="ai-consultant__error">
          Вы превысили лимит запросов кода подтверждения на номер
          <span class="ai-consultant__error-number">
            {{ phoneParams.number }}
          </span>
          <br />
          Повторите попытку через 1 час.
        </p>

        <template v-else>
          <div v-if="step === 1 && messagesList?.length" ref="messageBlock" class="ai-consultant__message-block">
            <!-- Here messages -->
            <div v-for="(msg, index) in messagesList" :key="index" class="message__wrapper">
              <div
                v-if="msg.role === 'assistant' || msg.role === 'dots' || msg.role === 'tool'"
                class="message__icon-wrapper"
                :class="{
                  invisible: lastAssistantMsgIndex !== index || invisibleMessages,
                  visible: msg.role === 'dots' || msg.role === 'tool',
                }"
              >
                <NuxtImg
                  src="/images/ai-bot.webp"
                  width="48"
                  height="41"
                  alt="AI Icon"
                  class="message__icon"
                  loading="lazy"
                />
              </div>

              <div
                class="message"
                :class="{
                  'user': msg.role === 'user',
                  'assistant': msg.role === 'assistant' || msg.role === 'tool',
                  'assistant-arrow':
                    (msg.role === 'assistant' && lastAssistantMsgIndex === index) || msg.role === 'tool',
                  'message__dots': msg.role === 'dots',
                  'wide': msg.role === 'tool' && msg.specialities?.length,
                }"
              >
                <template v-if="msg.role === 'tool' && msg.specialities?.length">
                  <ul v-for="spec in msg.specialities" :key="spec.id" class="message__spec-list">
                    <div v-if="spec.name" class="message__bold message__header">
                      <NuxtImg src="/images/msg-check.webp" width="24" height="24" alt="AI Icon" loading="lazy" />
                    </div>

                    <li v-if="spec.university">
                      <span class="message__bold">Университет: </span> {{ spec.university }}
                    </li>
                    <li v-if="spec.education_type">
                      <span class="message__bold">Форма обучения: </span>{{ spec.education_type }}
                    </li>
                    <li v-if="spec.level_code"><span class="message__bold">Уровень: </span> {{ spec.level_code }}</li>
                    <li v-if="spec.city">
                      <span class="message__bold">Город: </span> {{ spec.city }}
                      <span v-if="spec.region">, {{ spec.region }}</span>
                    </li>
                  </ul>
                </template>

                <span v-else-if="msg.notFound" class="message__text">{{ msg.notFound }}</span>

                <span v-else-if="msg.role !== 'dots'" class="message__text">{{ msg.content }}</span>

                <template v-else>
                  <div class="message__dot" />
                  <div class="message__dot" />
                  <div class="message__dot" />
                </template>
              </div>
            </div>
          </div>

          <footer class="ai-consultant__footer">
            <template v-if="step === 0">
              <ATitle
                tag="h2"
                title="Чтобы мы смогли продолжить диалог, пожалуйста, представься в чате"
                class="ai-consultant__footer-title"
              />

              <AInput
                v-model="phoneParams.name"
                name="name"
                placeholder="Имя"
                size="large"
                border-radius="64px"
                class="ai-consultant__footer-name"
              />

              <AInput
                v-model="phoneParams.number"
                v-maska
                name="phone"
                placeholder="Телефон"
                mask
                data-maska="['+7 (###) ###-##-##']"
                size="large"
                border-radius="64px"
                class="ai-consultant__footer-phone"
              />

              <AOtp
                v-if="phoneParams.isShowCode"
                v-model="phoneParams.code"
                :is-error="phoneParams.isInvalidParams"
                :is-auto-focus="true"
                class="ai-consultant__otp-input"
                @on-complete="handleSendCode"
              />

              <AButton
                label="Отправить"
                size="large"
                type="submit"
                class="ai-consultant__footer-send"
                :disabled="isSubmitDisabled"
                @click="goToChat"
              />

              <ACheckbox
                v-model="approve"
                class="ai-consultant__footer-checkbox"
                label-text=" Я даю согласие на обработку персональных данных,
               согласен на получение информационных рассылок и соглашаюсь c
                <a href='/files/privacy_policy.pdf' target='_blank'>политикой конфиденциальности</a>"
              />
            </template>
            <template v-if="step === 1">
              <div v-if="suggestions?.length" class="ai-consultant__footer-tags">
                <button
                  v-for="(tag, index) in suggestions"
                  :key="index"
                  class="ai-consultant__footer-tag"
                  :class="{
                    readonly: isPending,
                  }"
                  :disabled="isPending"
                  @click="sendMessage(tag)"
                >
                  {{ tag }}
                </button>
              </div>

              <AInput
                v-if="!isHasTool"
                v-model="messageInput"
                placeholder="Задать любой вопрос"
                class="ai-consultant__input"
                autocomplete="off"
                variant="noborder"
                :class="{ 'mb-zero': !isHasTool }"
                @enter="handleInputEnter"
              >
                <template #append>
                  <AButton
                    size="small"
                    :disabled="isPending || !messageInput"
                    class="ai-consultant__footer-button"
                    @click="handleInput"
                  >
                    <IconSendMsg style="flex-shrink: 0" />
                  </AButton>
                </template>
              </AInput>

              <AButton v-else block class="ai-consultant__footer-send" @click="handleRepeat"> Начать заново </AButton>

              <NuxtLink
                v-if="isHasTool"
                :to="demoTelegramLeadUrl"
                rel="nofollow"
                target="_blank"
                class="ai-consultant__link"
              >
                <IconTgLink />
                <span>Консультант в Telegram</span>
              </NuxtLink>
            </template>
          </footer>
        </template>
      </div>
    </div>
  </AModal>
</template>

<script setup>
import AButton from '~/components/_ui/a-button.vue';
import ACheckbox from '~/components/_ui/a-checkbox.vue';
import AInput from '~/components/_ui/a-input.vue';
import AOtp from '~/components/_ui/a-otp.vue';
import ATitle from '~/components/_ui/a-title.vue';
import AModal from '~/components/_ui/a-modal.vue';
import { useApiPostAuth } from '@/composables/api/useApiPostAuth';
import { useApiPostLeads } from '@/composables/api/useApiPostLeads';
import { useApiPostAuthCode } from '@/composables/api/useApiPostAuthCode';
import { useApiUser } from '@/composables/api/useApiUser';
import { useApiNeuroConsulter } from '@/composables/api/useApiNeuroConsulter';
import { onClickOutside } from '@vueuse/core';
import IconTgLink from '@/components/_icons/IconTgLink.vue';
import IconSendMsg from '@/components/_icons/IconSendMsg.vue';
import { useTimeoutFn } from '@vueuse/core';
import { DEMO_TELEGRAM_URL, DEMO_LAND_SLUG, DEMO_UTM_SOURCE } from '~/shared/constants';

const infoStore = useInfoStore();
const ymReach = useYmReachGoal();
const demoTelegramLeadUrl = `${DEMO_TELEGRAM_URL}/?text=${encodeURIComponent(
  'Демо: вопрос по каталогу программ',
)}`;
const authStore = useAuthStore();
const storeDevice = useDeviceStore();
const filterStore = useFilterStore();
const { setToken } = useToken();

const { execute } = useTimedRequest(sendLead, {
  storageKey: 'ai-lead-timeout',
  cooldownHours: 12,
});

const { isPending: isPendingTimeout, start, stop } = useTimeoutFn(execute, 180000, { immediate: false });
const isOpen = ref(false);
const messageInput = ref(null);
const CHAT_STORAGE_KEY = 'ai-consultant-chat';
const DEFAULT_FORM_DATA = {
  name: null,
  number: null,
  code: '',
  isInvalidParams: false,
  isShowCode: false,
  isManyAttempts: false,
};
const phoneParams = ref({ ...DEFAULT_FORM_DATA });
const approve = ref(false);
const messageBlock = ref(null);
const step = ref(0);
const sendList = ref([]);

const regularValue = computed(() => phoneParams.value.number?.length !== 18);
const invisibleMessages = computed(
  () => messagesList.value.some((m) => m.role === 'dots') || messagesList.value.some((m) => m.role === 'tool'),
);
const isSubmitDisabled = computed(
  () =>
    regularValue.value ||
    !approve.value ||
    (phoneParams.value.isShowCode && (phoneParams.value.code?.length !== 6 || phoneParams.value.isInvalidParams)),
);

watch(
  () => authStore.isAuthenticated,
  (v) => {
    if (!v) {
      handleRepeat();
      closeChat();
    }
  },
);

const target = ref(null);
onClickOutside(target, closeChat);

const DEFAULT_SUGGESTIONS = ['Программирование', 'Дизайн', 'Искусственный интеллект', 'Менеджмент', 'Медицина'];
const DEFAULT_MESSAGE_LIST = [
  {
    role: 'assistant',
    content: `Привет! Я помогу подобрать программы обучения в колледжах и вузах`,
    suggestions: DEFAULT_SUGGESTIONS,
  },
];

watch(isOpen, (v) => {
  document.documentElement.style.overflow = v ? 'hidden' : null;
});

const { mutateAsync: postAuth } = useApiPostAuth();
const token = ref();
const userQuery = useApiUser(token, false);

async function handleSendCode(v) {
  const body = {
    phone: phoneParams.value.number,
    name: phoneParams.value.name,
    password: v,
    cid: infoStore.cid,
    url: location.href,
    city: filterStore?.cityName || 'Россия',
    device: storeDevice.currentDevice,
  };

  try {
    const payload = await postAuth(body);
    if (!payload) {
      phoneParams.value.isInvalidParams = true;
      return;
    }
    const { access_token, expires_in } = payload;
    setToken(access_token, expires_in);
    token.value = access_token;
    await userQuery.refetch();
    const user = userQuery.data.value;

    if (user) {
      authStore.profile = user;
      step.value++;
      start();
    }
  } catch (error) {
    console.error(error);
    phoneParams.value.isInvalidParams = true;
  }
}

const openChat = () => {
  isOpen.value = true;
  ymReach('ai_consult_button');

  if (authStore.isAuthenticated) {
    step.value++;

    if (isPendingTimeout.value) {
      return;
    }

    start();
  }
};

const { data, mutateAsync: sendData, isPending, error } = useApiNeuroConsulter();

const messagesList = ref([...DEFAULT_MESSAGE_LIST]);
const suggestions = ref([...DEFAULT_SUGGESTIONS]);

const isHasTool = computed(() => !!messagesList.value.findLast((m) => m.role === 'tool'));

const clearPersistedChat = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(CHAT_STORAGE_KEY);
};

function closeChat(v) {
  if (!v) {
    isOpen.value = false;
    step.value = 0;
    phoneParams.value = { ...DEFAULT_FORM_DATA };
  }
}

const handleRepeat = async () => {
  messagesList.value = [...DEFAULT_MESSAGE_LIST];
  suggestions.value = [...DEFAULT_SUGGESTIONS];
  clearPersistedChat();
};

function convertMessages(list) {
  return list
    .map((m) => {
      if (m.role === 'assistant') {
        return `Ассистент: ${m.content}`;
      }
      if (m.role === 'user') {
        return `Пользователь: ${m.content}`;
      }
      if (m.role === 'tool' && m.specialities?.length) {
        return `Список: ${m.specialities.map(
          (el, idx) =>
            `${idx + 1}. Название: ${el.name}; Университет: ${el.university};
             Форма обучения: ${el.education_type};
              Уровень: ${el.level_code}; Город: ${el.city}, ${el.region} `,
        )}`;
      }
    })
    .join('; ');
}

const { mutateAsync: postLeads } = useApiPostLeads();

async function sendLead() {
  let utm_campaign;

  const content = convertMessages(sendList.value);

  if (infoStore.path) {
    utm_campaign = infoStore.path === 'kolledzh' ? 'college' : infoStore.path === 'vuz' ? 'vuz' : undefined;
  }
  const body = {
    phone: phoneParams.value.number || authStore.profile?.phone,
    name: phoneParams.value.name,
    entity_type: 'NeuroConsulter',
    entity_id: null,
    cid: infoStore.cid,
    url: window.location.href,
    device: storeDevice.currentDevice,
    content,
  };
  const params = {
    land: DEMO_LAND_SLUG,
    utm_term: 'profii',
    utm_source: DEMO_UTM_SOURCE,
    utm_campaign,
  };
  await postLeads({ params, body });
}

const persistChat = () => {
  if (typeof window === 'undefined') {
    return;
  }

  const preparedMessages = messagesList.value.filter((message) => message.role !== 'dots');
  const isDialogStarted = preparedMessages.some((message) => message.role === 'user');

  if (!isDialogStarted) {
    clearPersistedChat();
    return;
  }

  window.localStorage.setItem(
    CHAT_STORAGE_KEY,
    JSON.stringify({
      messagesList: preparedMessages,
      suggestions: suggestions.value,
    }),
  );
};

const restoreChat = () => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!authStore.isAuthenticated) {
    clearPersistedChat();
    return;
  }

  try {
    const savedChat = window.localStorage.getItem(CHAT_STORAGE_KEY);

    if (!savedChat) {
      return;
    }

    const parsedChat = JSON.parse(savedChat);

    if (Array.isArray(parsedChat?.messagesList) && parsedChat.messagesList.length) {
      messagesList.value = parsedChat.messagesList;
    }

    if (Array.isArray(parsedChat?.suggestions)) {
      suggestions.value = parsedChat.suggestions;
    }
  } catch {
    clearPersistedChat();
  }
};

watch(
  [messagesList, suggestions],
  () => {
    persistChat();
  },
  { deep: true },
);

const lastAssistantMsgIndex = computed(() => messagesList.value.findLastIndex((m) => m.role === 'assistant'));

const { mutateAsync: postAuthCode } = useApiPostAuthCode();

const goToChat = async () => {
  if (authStore.isAuthenticated) {
    step.value++;
    if (isPendingTimeout.value) {
      stop();
    }
    start();
    return;
  }

  const body = {
    phone: phoneParams.value.number,
    name: phoneParams.value.name,
    cid: infoStore.cid,
    action: 'login',
    url: location.href,
    city: filterStore?.cityName || 'Россия',
    device: storeDevice.currentDevice,
  };
  const codeRes = await postAuthCode(body);

  if (!codeRes.success) {
    phoneParams.value.isManyAttempts = true;
    return;
  }

  phoneParams.value.isShowCode = true;
};

const sendMessage = async (msg) => {
  messagesList.value.push({ role: 'user', content: msg });

  messagesList.value.push({ role: 'dots' });

  if (messageBlock.value) {
    nextTick(() => {
      messageBlock.value.scrollBy({ top: messageBlock.value.scrollHeight, behavior: 'smooth' });
    });
  }

  await sendData({ messages: messagesList.value.slice(1, -1) });

  if (error.value) {
    console.error(error.value);
  }
  messagesList.value.pop();

  const { messages } = data.value;

  if (messages?.length) {
    messagesList.value = [
      ...messagesList.value,
      ...messages
        .map((m) => ({
          role: m.role,
          content: m.content,
          suggestions: m.suggestions,
          specialities: m.role === 'tool' && m.content ? JSON.parse(m.content)?.specialities : undefined,
          notFound:
            m.role === 'tool' && !JSON.parse(m.content)?.specialities?.length
              ? JSON.parse(m.content)?.message
              : undefined,
        }))
        .filter((m) => m.content),
    ];
    const mes = messages.find((m) => m.role === 'assistant' && m.suggestions?.length);

    if (mes) {
      suggestions.value = mes?.suggestions?.length ? mes.suggestions : [];
    } else {
      suggestions.value = [];
    }
  }

  if (!sendList.value.find((m) => m.role === 'tool')) {
    sendList.value = [...messagesList.value];
  }

  if (messageBlock.value) {
    nextTick(() => {
      messageBlock.value.scrollBy({ top: messageBlock.value.scrollHeight, behavior: 'smooth' });
    });
  }
};

const handleInput = async () => {
  const copyText = messageInput.value;
  messageInput.value = null;
  await sendMessage(copyText);
};
const handleInputEnter = async () => {
  if (messageInput.value) {
    await handleInput();
  }
};

onMounted(() => {
  restoreChat();
});

onUnmounted(() => {
  persistChat();
  stop();
});
</script>

<style lang="scss">
.a-modal__block {
  padding-inline: to-rem(16);
  padding-bottom: to-rem(16);
  overflow: auto;

  &::-webkit-scrollbar {
    width: 0;
  }
}
.ai-consultant__otp-input-item {
  width: to-rem(37);
  height: to-rem(43);
  font-size: to-rem(27);
}
.a-modal__content {
  @media (max-width: 1023px) {
    height: 100%;
  }
}
.a-modal__close {
  top: to-rem(18);
  right: to-rem(18);

  @media (min-width: 768px) {
    top: to-rem(12);
    right: to-rem(12);
  }
}
</style>

<style lang="scss" scoped>
.ai-consultant-button {
  position: sticky;
  bottom: to-rem(74);
  right: to-rem(16);
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--base-blue-dark);
  padding: to-rem(5) to-rem(11);
  gap: 0;
  width: to-rem(64);
  height: to-rem(64);
  border: none;
  border-radius: to-rem(64);
  margin-left: auto;
  cursor: pointer;
  transition: background 0.3s ease;
  box-shadow: 0 to-rem(4) to-rem(24) 0 #b8b8b87a;
  transform: translateZ(0);

  @media (min-width: 768px) {
    bottom: to-rem(64);
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    width: auto;
    height: auto;
    padding-right: to-rem(12);
    gap: to-rem(10);
    box-shadow: 0px 0px 32px 0px var(--color-shadow);
    bottom: to-rem(64);
    right: to-rem(20);
    flex-direction: row;
    width: max-content;
    margin-bottom: to-rem(16);
  }

  @media (min-width: 1024px) {
    padding: to-rem(4);
    padding-right: to-rem(20);
    gap: to-rem(10);
    box-shadow: 0px 0px 32px 0px var(--color-shadow);
    bottom: to-rem(20);
    right: to-rem(20);
    height: auto;
    flex-direction: row;
    width: max-content;
    margin-bottom: to-rem(24);
  }

  @media (max-width: 767px) {
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: rgba(10, 34, 79, 0.2);
      animation: first-pulse 1s infinite ease;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: rgba(10, 34, 79, 0.1);
      animation: second-pulse 1s infinite ease;
    }
  }

  @keyframes first-pulse {
    0% {
      transform: scale(1);
    }
    25% {
      transform: scale(1.2);
    }
    50% {
      transform: scale(1.2);
    }
    75% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes second-pulse {
    0% {
      transform: scale(1);
    }
    25% {
      transform: scale(1.3);
    }
    50% {
      transform: scale(1.4);
    }
    70% {
      transform: scale(1.3);
    }
    100% {
      transform: scale(1);
    }
  }

  &.open {
    border: to-rem(1) solid var(--base-gray-border);
    background-color: var(--base-white);

    .ai-consultant-button__title {
      color: var(--base-black);
    }

    .ai-consultant-button__icon {
      padding-right: to-rem(1) solid var(--base-gray-20);
    }
  }

  &__icon {
    flex-shrink: 0;
    position: relative;
    object-fit: cover;
    width: to-rem(42);
    height: to-rem(41);
    bottom: to-rem(4);

    @media (min-width: 768px) {
      position: static;
      bottom: unset;

      &::after {
        content: '';
        position: absolute;
        height: inherit;
        margin-left: to-rem(4);
        width: to-rem(1);
        background-color: var(--base-gray-border);
      }
    }

    &--mobile {
      width: to-rem(51);
      height: to-rem(49);
    }
  }

  &__title {
    position: relative;
    bottom: to-rem(8);
    color: var(--base-white);
    font-size: to-rem(18);
    line-height: to-rem(24);
    font-weight: 600;
    padding-left: to-rem(4);

    @media (min-width: 768px) {
      bottom: unset;
    }

    .hidden-text {
      display: none;

      @media (min-width: 768px) {
        display: inline;
      }
    }
  }
}

.message {
  padding: to-rem(10) to-rem(12);
  border-radius: to-rem(16);
  max-width: to-rem(216);
  width: max-content;
  font-size: to-rem(16);
  line-height: to-rem(22);

  @media (min-width: 768px) {
    font-size: to-rem(18);
    line-height: to-rem(24);
  }

  &.assistant {
    background-color: var(--base-gray-light);
    position: relative;
    z-index: 1;
    border-bottom-left-radius: to-rem(2);
  }

  &.user {
    position: relative;
    background-color: var(--base-blue-pale);
    margin-left: auto;
    z-index: 2;
    margin-right: to-rem(10);
    border-bottom-right-radius: to-rem(2);
  }

  &.wide {
    max-width: 75%;
  }

  &__wrapper {
    display: flex;
    gap: to-rem(10);
  }

  &__text {
    position: relative;
    z-index: 2;
    word-wrap: break-word;
  }

  &__bold {
    font-weight: 600;
  }

  &__header {
    display: flex;
    gap: to-rem(8);
    margin-bottom: to-rem(12);

    svg {
      flex-shrink: 0;
    }
  }

  &__spec-list {
    display: flex;
    flex-direction: column;
    gap: to-rem(2);
    position: relative;
    z-index: 2;

    &:not(:last-child) {
      margin-bottom: to-rem(20);
    }

    li {
      font-weight: 400;
    }
  }

  &__dots {
    background-color: var(--base-gray-light);
    position: relative;
    z-index: 1;
    display: flex;
    gap: to-rem(6);
    height: to-rem(28);
    align-self: flex-end;
  }

  .dots-icon {
    position: absolute;
    width: to-rem(47);
    height: to-rem(23);
    right: to-rem(13);
    bottom: to-rem(0);
  }

  &__dot {
    position: relative;
    z-index: 1;
    width: to-rem(8);
    height: to-rem(8);
    background-color: var(--base-gray-tertiary);
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
  }

  &__icon {
    width: to-rem(32);
    height: to-rem(31);
    flex-shrink: 0;
    position: relative;
    object-fit: cover;
    top: to-rem(4);

    &-wrapper {
      width: max-content;
      display: flex;
      align-items: center;
      justify-content: center;
      height: max-content;
      align-self: flex-end;

      &.invisible {
        visibility: hidden;
      }

      &.visible {
        visibility: visible;
      }
    }
  }
}

.ai-consultant {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__error-text {
    margin-top: to-rem(12);
  }

  &__otp-input {
    margin-inline: auto;
    margin-bottom: to-rem(12);
  }

  &__header {
    border-top-left-radius: var(--border-radius-x2);
    border-top-right-radius: var(--border-radius-x2);
    height: to-rem(86);
    top: 0;
    left: 0;
    width: 100%;
    position: absolute;
    background-color: var(--base-blue-dark);
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: to-rem(24);
    padding-left: to-rem(16);

    @media (min-width: 1024px) {
      height: to-rem(102);
    }
    @media (min-width: 1024px) {
      padding-left: to-rem(32);
      height: to-rem(116);
    }

    &-content {
      color: var(--base-white);
      padding-block: to-rem(13);
      padding-right: to-rem(50);
      font-size: to-rem(19);
      line-height: to-rem(32);
      font-weight: 700;

      @media (min-width: 768px) {
        font-size: to-rem(22);
        line-height: to-rem(32);
      }
    }
  }

  &__icon {
    height: to-rem(77);
    width: to-rem(76);
    margin-top: auto;

    @media (min-width: 768px) {
      height: to-rem(92);
      width: to-rem(93);
    }
    @media (min-width: 1024px) {
      height: to-rem(101);
      width: to-rem(100);
    }
  }

  &__close {
    cursor: pointer;
    position: absolute;
    right: to-rem(8);
    top: to-rem(8);
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.7;
    }
  }

  &__error {
    font-weight: 500;

    &-number {
      color: var(--base-blue);
    }
  }

  &__content {
    margin-top: to-rem(100);
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    background-color: var(--base-white);
    justify-content: space-between;
    max-height: -webkit-fill-available;

    @media (min-width: 768px) and (min-height: 685px) {
      border-top-left-radius: var(--border-radius-x4);
      border-top-right-radius: var(--border-radius-x4);
    }

    @media (min-width: 768px) {
      margin-top: to-rem(105);
    }
  }

  &__message {
    &-block {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: to-rem(8);
      margin-bottom: to-rem(20);
      overflow-y: auto;
      max-height: max-content;
      @include block-scroll;

      &::-webkit-scrollbar {
        width: to-rem(3);
      }

      @media (min-width: 768px) and (max-width: 1023px) {
        max-height: 40vh;
      }

      @media (min-width: 1024px) {
        max-height: to-rem(350);
      }
    }
  }

  &__footer {
    position: relative;
    margin-top: auto;
    display: flex;
    flex-direction: column;

    &-button {
      width: to-rem(40);
      height: to-rem(40);
      background-color: transparent !important;
      border: transparent;
    }

    &-tags {
      display: flex;
      flex-wrap: wrap;
      gap: to-rem(6);
      margin-bottom: to-rem(20);
    }

    &-tag {
      background-color: var(--base-blue);
      color: var(--base-white);
      border-radius: to-rem(48);
      padding: to-rem(4) to-rem(10);
      border: none;
      transition: background 0.3s ease;
      cursor: pointer;
      font-size: to-rem(14);
      line-height: to-rem(18);

      @media (min-width: 768px) {
        font-size: to-rem(16);
        line-height: to-rem(20);
      }

      &:hover {
        background-color: var(--base-blue-light);
      }

      &.readonly {
        pointer-events: none;
        opacity: 0.7;
      }
    }

    &-title {
      margin-top: to-rem(100);
      margin-bottom: to-rem(24);
    }

    &-name {
      margin-bottom: to-rem(12);

      &:deep(.a-input__container) {
        border-radius: to-rem(64);
      }

      &:deep(input) {
        background-color: transparent;
      }
    }

    &-phone {
      margin-bottom: to-rem(12);

      &:deep(.a-input__container) {
        border-radius: to-rem(64);
      }

      &:deep(input) {
        background-color: transparent;
      }
    }

    &-send,
    &-repeat {
      margin-bottom: to-rem(12);
    }

    &-send {
      border-radius: to-rem(64);
    }

    &-checkbox {
      font-size: to-rem(12);
      line-height: to-rem(16);
      color: var(--base-gray-60);
      align-items: flex-start;

      &:deep(a) {
        color: var(--base-blue);
      }

      &:deep(.a-checkbox__box) {
        margin-top: to-rem(3);
      }
    }
  }

  &__input {
    width: 100%;
    margin-bottom: to-rem(16);
    background-color: var(--base-gray-light);
    border-radius: to-rem(64);

    &:deep(.a-input__container) {
      height: to-rem(56);
      padding-left: to-rem(16) !important;
      padding-right: to-rem(8);
      font-size: to-rem(16);
      line-height: to-rem(24);
      border-radius: var(--border-radius-x3);
    }
    &:deep(.a-input__textfield) {
      font-size: to-rem(16);
      line-height: to-rem(24);
      background-color: var(--base-gray-light);
    }

    &.mb-zero {
      margin-bottom: 0;
    }
  }

  &__link {
    display: flex;
    align-items: center;
    gap: to-rem(12);
    font-size: to-rem(16);
    line-height: to-rem(24);
    font-weight: 600;
    color: var(--base-blue);
    margin-inline: auto;
    transition: color 0.3s ease;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.slide-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.slide-leave-from,
.slide-leave-to {
  display: none;
}
</style>
