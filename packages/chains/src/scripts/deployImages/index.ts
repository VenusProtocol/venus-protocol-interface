#!/usr/bin/env tsx

import { uploadImages } from './uploadImages';

console.log('Deploying images to CDN...');

uploadImages()
  .then(() => console.log('Finished deploying images to CDN'))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
