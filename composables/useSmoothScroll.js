import { useEventListener } from '@vueuse/core';

export default function useSmoothScroll(duration) {
  const scrollHeight = window.scrollY;
  let startTime = Date.now();
  let finished = false;
  let isScrolling = false;
  let scrollTimeout = null;
  const scrollWatcher = function () {
    isScrolling = true;
    if (scrollTimeout !== null) {
      clearTimeout(scrollTimeout); // clear the possible previous timeout
    }
    scrollTimeout = setTimeout(() => (isScrolling = false), 10);
  };
  useEventListener(document, 'scroll', scrollWatcher);

  const step = (currentTime) => {
    if (finished) {
      return;
    }

    if (isScrolling) {
      // prevent 2+ scrollings at the same time
      setTimeout(() => step(Date.now()), 10);
    }

    // how much time from the start has passed
    const timeElapsed = currentTime - startTime;
    // % of tot al duration time; Example: duration 2000ms, time 500ms => 25(%)
    const progress = (100 / duration) * timeElapsed;
    // 1 == 100% => progress / 100 => how much of 1 is the progress
    // => calculate where we should be - Example:
    //     => if progress is 25%, we want to be scrolled to 100% - 25% of the scrollHeight = 75%
    //     => 1 - 0.25 => * 0.75 == 75%
    let toScrollTo = scrollHeight * (1 - progress / 100);
    window.scrollTo({ left: 0, top: toScrollTo, behavior: 'instant' });
    if (toScrollTo <= 0) {
      finished = true;
      return;
    }

    // next step
    setTimeout(() => step(Date.now()), 10); // don't burn the CPU
  };

  step(Date.now());
}
