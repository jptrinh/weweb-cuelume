import { sounds } from "cuelume";

const SOUND_OPTIONS = sounds.map(value => ({
  value,
  label: { en: value.charAt(0).toUpperCase() + value.slice(1) },
}));

export default {
  editor: {
    label: { en: "Cuelume" },
    icon: "bell",
  },
  actions: [
    {
      label: { en: "Play sound" },
      action: "playSound",
      // Action args use `select` with a flat `options` array — not the
      // `TextSelect` / `options: { options }` shape properties use. See
      // ww-input-rich-text's setTag/setTextAlign.
      args: [
        {
          name: "Sound",
          type: "select",
          options: SOUND_OPTIONS,
        },
        {
          name: "Volume",
          type: "number",
        },
      ],
    },
  ],
  properties: {
    enabled: {
      label: { en: "Sounds enabled" },
      type: "OnOff",
      bindable: true,
      defaultValue: true,
      /* wwEditor:start */
      bindingValidation: {
        type: "boolean",
        tooltip: "Bind to a boolean — e.g. a user sound-preference variable",
      },
      propertyHelp: {
        tooltip:
          "Turns Cuelume playback on or off globally, for every element in the app.",
      },
      /* wwEditor:end */
    },
    volume: {
      label: { en: "Volume" },
      type: "Number",
      options: { min: 0, max: 1, step: 0.05 },
      bindable: true,
      defaultValue: 1,
      /* wwEditor:start */
      bindingValidation: {
        type: "number",
        tooltip: "Bind to a number between 0 and 1 — e.g. a volume slider",
      },
      propertyHelp: {
        tooltip:
          "Global volume multiplier for every Cuelume sound, from 0 (silent) to 1. Values outside that range are clamped.",
      },
      /* wwEditor:end */
    },
    playInEditor: {
      label: { en: "Play in editor" },
      type: "OnOff",
      defaultValue: false,
      /* wwEditor:start */
      propertyHelp: {
        tooltip:
          "Play sounds while editing this page. Has no effect on the published app.",
      },
      /* wwEditor:end */
    },
  },
};
