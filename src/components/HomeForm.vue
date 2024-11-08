<template>
  <div class="h-dvh bg-gradient-to-r from-cyan-500 to-blue-500">
    <div class="flex justify-center items-center h-screen">
      <div class="bg-white p-8 rounded-lg shadow-md w-1/3">
        <div class="flex items-center">
          <input type="url" class="border border-gray-300 p-2 w-full rounded-l-lg" v-model="longUrl" placeholder="Enter Link" name="txt-url">
          <button v-if="CopyButton" @click="copyToClipboard" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg" name="btn-submit">Copy</button>
          <button :class="{'opacity-50 cursor-not-allowed': !isUrlValid, 'bg-blue-500 hover:bg-blue-700': isUrlValid}"  :disabled="!isUrlValid" v-else  @click="shortenUrl" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg" name="btn-submit">Submit</button>
        </div>
        <div class="items-center">
          <p class="pt-5 text-center" v-if="shortUrl">Shortened URL: <a :href="shortUrl">{{ shortUrl }}</a></p>
          <p v-if="errorMessage" class="text-red-500 pt-5 text-center">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, watch, computed } from 'vue';
  import db from '../firebase/ini.js'
  import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
  import { useRoute } from 'vue-router';
  // import axios from 'axios';

  const longUrl = ref('');
  const shortUrl = ref('');
  const CopyButton = ref(false);
  const isUrlValid = computed(() => longUrl.value.startsWith('https'));

  // For Saving Data to Firebase
  const shortenUrl = async () => {
    if(isUrlValid.value)
    {
      console.log('Long URL:', longUrl.value);
      const shortID = Math.random().toString(36).substring(2, 7);
      console.log("Link ID: " + shortID);

      try {
      const docRef = await addDoc(collection(db, 'links'), {
        longUrl: longUrl.value,
        shortID: shortID
      });
        console.log('Document written with ID:', docRef.id);
        longUrl.value = `${window.location.origin}/${shortID}`;
        CopyButton.value = true;
      } catch (error) {
        console.error('Error adding document:', error);
      }
    }
  };

  // For Fetching URL Data
  const route = useRoute();
  const urlId = route.params.id;
  const errorMessage = ref('');
  
  const getLink = async () => {
    try{
      const q = query(collection(db, 'links'), where('shortID', '==', urlId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          // longUrl.value = doc.data().longUrl;
          window.location.href = doc.data().longUrl;
        });
      } else {
        console.log("No document found with this shortId");
      }
    } catch( error) {
      console.error('Error adding document:', error);
    }
  };
  
  onMounted(() => {
    if (urlId) {
      getLink();
    }
  });

  // CopyToClickboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(longUrl.value)
    .then(() => alert('Copied to clickboard!'))
  };

  // Check Entries if have https
  watch(longUrl, (newUrl) => {
    errorMessage.value = newUrl && !newUrl.startsWith('https') 
    ? 'URL must start with "https"' 
    : '';
  });
</script>