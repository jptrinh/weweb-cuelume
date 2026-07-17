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
import { computed, watch } from "vue";
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

    watch(
      isActive,
      active => {
        setEnabled(!!active);
        // bind() is idempotent per root, so deferring it until sounds are
        // actually on keeps the delegated listeners off the document — and
        // off every pointer event — in apps that never unmute. It attaches to
        // the app document, not the editor's, and never needs re-running as
        // the DOM changes.
        if (active) bind(wwLib.getFrontDocument());
      },
      { immediate: true }
    );

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
