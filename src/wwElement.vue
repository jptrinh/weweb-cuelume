<template>
  <div class="cuelume">
    <!-- wwEditor:start -->
    <div class="cuelume__badge">
      <span class="cuelume__dot" :class="{ 'cuelume__dot--off': !isActive }"></span>
      Cuelume — {{ isActive ? "sounds on" : "sounds off" }}
    </div>
    <!-- wwEditor:end -->
  </div>
</template>

<script>
import { computed, onMounted, watch } from "vue";
import { play, setEnabled, sounds } from "cuelume";

// A realm-safe port of cuelume's own bind(). Upstream guards its delegated
// listeners with `event.target instanceof Element`, but this element's code
// and the app DOM sit in different realms inside the editor, where that check
// is always false and every event is dropped. Duck-typing expresses the same
// intent in any realm. Behaviour is otherwise identical to bind.js.
const HOVER_GAP_MS = 150;

const BINDINGS = [
  { type: "pointerenter", attr: "data-cuelume-hover", fallback: "chime", mouseOnly: true },
  { type: "pointerdown", attr: "data-cuelume-press", fallback: "press", mouseOnly: false },
  { type: "pointerup", attr: "data-cuelume-release", fallback: "release", mouseOnly: false },
  { type: "click", attr: "data-cuelume-toggle", fallback: "toggle", mouseOnly: false },
];

const boundRoots = new WeakSet();
const handledEvents = new WeakSet();
let lastHoverTime = -Infinity;

const isElement = node => typeof node?.closest === "function";
const isNode = node => typeof node?.nodeType === "number";

function isMouse(event) {
  return (
    event.pointerType === "mouse" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

function bindRoot(root) {
  if (boundRoots.has(root)) return;
  boundRoots.add(root);

  for (const { type, attr, fallback, mouseOnly } of BINDINGS) {
    root.addEventListener(
      type,
      event => {
        if (handledEvents.has(event) || !isElement(event.target)) return;

        const element = event.target.closest(`[${attr}]`);
        if (!element || !root.contains(element)) return;
        if (mouseOnly && !isMouse(event)) return;

        if (type === "pointerenter") {
          const { relatedTarget } = event;
          if (isNode(relatedTarget) && element.contains(relatedTarget)) return;
          const now = performance.now();
          if (now - lastHoverTime < HOVER_GAP_MS) return;
          lastHoverTime = now;
        }

        handledEvents.add(event);
        const requested = element.getAttribute(attr);
        play(sounds.includes(requested) ? requested : fallback);
      },
      true
    );
  }
}

export default {
  props: {
    uid: { type: String, required: true },
    content: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  setup(props) {
    const isActive = computed(() => {
      const enabled = props.content?.enabled ?? true;
      /* wwEditor:start */
      if (props.wwEditorState?.isEditing) {
        return enabled && (props.content?.playInEditor ?? false);
      }
      /* wwEditor:end */
      return enabled;
    });

    watch(isActive, active => setEnabled(!!active), { immediate: true });
    onMounted(() => bindRoot(wwLib.getFrontDocument()));

    return { isActive, playSound: play };
  },
};
</script>

<style lang="scss" scoped>
.cuelume {
  width: 100%;
}

/* wwEditor:start */
.cuelume__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border: 1px dashed #c4c8d4;
  border-radius: 4px;
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
}

.cuelume__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;

  &--off {
    background: #9ca3af;
  }
}
/* wwEditor:end */
</style>
