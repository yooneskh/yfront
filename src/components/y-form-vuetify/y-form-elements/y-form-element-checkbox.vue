<template>
  <div style="min-height: 40px;">
    <v-checkbox
      :label="field.title"
      :input-value="value"
      :true-value="true"
      :false-value="false"
      hide-details
      :dir="field.dir"
      :disabled="field.disabled"
      :readonly="field.readonly"
      class="mt-0 pt-0"
      @change="$emit('input', !!$event)"
      style="position: absolute; top: 50%; transform: translateY(-70%);"
    />
  </div>
</template>

<script>
export default {
  name: 'YFormElementCheckbox',
  props: {
    value: {

    },
    field: {
      type: Object,
      required: true
    }
  }
}
</script>
