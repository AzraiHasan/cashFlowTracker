<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Define db at the component level
const { $db } = useNuxtApp()

// Fetch transactions from the database
const transactions = ref([])

const fetchtransactions = async () => {
  try {
    const fetchedtransactions = await $db.collection('transactions').get()
    transactions.value = fetchedtransactions
  } catch (error) {
    console.error('Error fetching transactions:', error)
  }
}

// Perform initial database fetch on mounted
onMounted(() => {
  fetchtransactions()
})

const type = ['Cash In', 'Cash Out']
const categoryCashIn = ['Food', 'Groceries', 'Entertainment']
const categoryCashOut = ['Salary', 'Gift', 'Other']

const initialFormState = {
  date: '',
  amount: 0,
  description: '',
  type: 'Cash In',
  category: ''
}

const formState = ref({ ...initialFormState })

const categoryOptions = computed(() => {
  return formState.value.type === 'Cash In' ? categoryCashIn : categoryCashOut
})

// Reset category when type changes
watch(() => formState.value.type, (newValue) => {
  formState.value.category = ''
})


const refreshKey = ref(0)
const onSubmit = async () => {
  console.log('Form submitted with state:', formState.value)
  try {
    await $db.collection('transactions').add({
      date: formState.value.date,
      amount: formState.value.amount,
      description: formState.value.description,
      type: formState.value.type,
      category: formState.value.category
    })
    // Clear the form
    formState.value = { ...initialFormState }
    // Fetch updated transaction list
    await fetchtransactions()
    // Increment refreshKey to force re-render
    refreshKey.value++
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}
</script>

<template>
  <UForm :state="formState" @submit="onSubmit">
    <UInput v-model="formState.date" type="date" label="Date" />
    <UInput v-model.number="formState.amount" type="number" step="10" label="Amount" />
    <USelectMenu v-model="formState.type" :options="type" label="Type" />
    <USelectMenu v-model="formState.category" :options="categoryOptions" label="Category" />
    <UTextarea v-model="formState.description" placeholder="Description" label="Description" />
    <UButton type="submit">Submit</UButton>
  </UForm>
  <UDivider class="my-8" />
  <UCard>
    <div class="mb-6" v-for="transaction in transactions">
      <p>{{ transaction.date }}</p>
      <p>{{ transaction.amount }}</p>
      <p>{{ transaction.description }}</p>
      <p>{{ transaction.type }}</p>
      <p>{{ transaction.category }}</p>
    </div>
  </UCard>
</template>