<template>
  <div class="h-dvh bg-gradient-to-r from-cyan-500 to-blue-500">
    <div class="flex justify-center items-center h-screen">
      <div class="bg-white p-8 rounded-lg shadow-md w-1/3">
        <div class="flex items-center">
          <input type="text" class="border border-gray-300 p-2 w-full rounded-l-lg" v-model="longUrl" placeholder="Enter Link" name="txt-url">
          <button @click="shortenUrl" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg" name="btn-submit">Submit</button>
        </div>
        <div class="items-center">
          <p class="pt-5 text-center" v-if="shortUrl">Shortened URL: <a :href="shortUrl">{{ shortUrl }}</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import db from '../firebase/ini.js'
  import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
  import { useRoute } from 'vue-router';
  // import axios from 'axios';

  const longUrl = ref('');
  const shortUrl = ref('');

  // For Saving Data to Firebase
  const shortenUrl = async () => {
    console.log('Long URL:', longUrl.value);
    const shortID = Math.random().toString(36).substring(2, 7);
    console.log("Link ID: " + shortID);

    try {
    const docRef = await addDoc(collection(db, 'links'), {
      longUrl: longUrl.value,
      shortID: shortID
    });
      console.log('Document written with ID:', docRef.id);
      shortUrl.value = `${window.location.origin}/${shortID}`;
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  // For Fetching URL Data
  const route = useRoute();
  const urlId = route.params.id;
  
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
</script>