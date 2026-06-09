<script setup lang="ts">
import { onMounted, onUnmounted, watch } from "vue";
import GUI from "lil-gui";

interface GuiControl {
  label: string;
  ref: any; // A Vue ref or direct primitive wrapper
  min?: number;
  max?: number;
  step?: number;
  options?: any[] | Record<string, any>;
  onChange?: (val: any) => void;
}

const props = defineProps<{
  controls: GuiControl[];
}>();

let gui: GUI | null = null;

onMounted(() => {
  gui = new GUI({ title: "Parameters" });
  gui.close();
  gui.domElement.style.position = "fixed";
  gui.domElement.style.top = "60px"; // Positioned cleanly below the Stats panel
  gui.domElement.style.right = "10px";
  gui.domElement.style.left = "auto";
  gui.domElement.style.zIndex = "9999";

  const target: Record<string, any> = {};

  props.controls.forEach((control, index) => {
    const key = `prop_${index}`;
    
    // Check if the passed prop is a Vue Ref
    const isRef = control.ref && typeof control.ref === "object" && "value" in control.ref;
    target[key] = isRef ? control.ref.value : control.ref;

    let controller;
    if (control.options) {
      controller = gui!.add(target, key, control.options);
    } else {
      controller = gui!.add(target, key, control.min, control.max, control.step);
    }

    controller.name(control.label);

    controller.onChange((val: any) => {
      if (isRef) {
        control.ref.value = val;
      }
      if (control.onChange) {
        control.onChange(val);
      }
    });

    if (isRef) {
      watch(
        () => control.ref.value,
        (newVal) => {
          if (target[key] !== newVal) {
            target[key] = newVal;
            controller.updateDisplay();
          }
        }
      );
    }
  });
});

onUnmounted(() => {
  if (gui) {
    gui.destroy();
    gui = null;
  }
});
</script>

<template>
  <!-- Self-managing properties UI controller (Renderless) -->
</template>
