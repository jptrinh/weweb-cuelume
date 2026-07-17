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
import { computed, onMounted, onUpdated, watch } from "vue";
import { bind, play, setEnabled } from "cuelume";

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

    // bind() must not be tied to isActive: the editor can swap the front
    // document underneath us, and a one-shot bind keyed on isActive changing
    // can never recover — the listeners stay on a document that's been torn
    // down. Re-binding on every render is a WeakSet lookup, since bind() is
    // idempotent per root.
    const rebind = () => {
      const doc = wwLib.getFrontDocument();
      console.log("[cuelume] bind", { doc, isActive: isActive.value });
      bind(doc);
    };
    onMounted(rebind);
    onUpdated(rebind);

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
