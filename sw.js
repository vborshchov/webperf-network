function insertParam(url, key, value) {
    key = encodeURI(key);
    value = encodeURI(value);
    console.log(url)
    let keyValueParams = url.search.substr(1).split('&');
    let i = keyValueParams.length; 
    let x;
    while(i--) {
        x = keyValueParams[i].split('=');

        if (x[0]==key)
        {
            x[1] = value;
            keyValueParams[i] = x.join('=');
            break;
        }
    }

    if( i < 0 ) {
      keyValueParams[keyValueParams.length] = [key,value].join('=');
    }

    //this will reload the page, it's likely better to store this until finished
    return keyValueParams.join('&'); 
}

self.addEventListener('fetch', event => {
  if (/\.jpg$|.png$|.gif$|.webp$/.test(event.request.url)) {
    const connection = navigator.connection.effectiveType;
    let imageQuality;
    const qualityKey = 'quality';
    switch (connection) {
      case '4g':
        imageQuality = null;
        break;
      case '3g': 
        imageQuality = '50';
        break;
      case'2g':
        imageQuality = '10';
        break;
      case 'slow-2g':
      default:
        null;
        break;
    }

    const imageURL = event.request.url;
    let finalImageURL;
    if (imageQuality) {
      let url = new URL(imageURL);
      url.search = insertParam(new URL(imageURL), qualityKey, imageQuality);
      finalImageURL = url.href;
    } else {
      finalImageURL = imageURL
    }
    console.log(imageURL)
    console.log(finalImageURL)
    event.respondWith(
      fetch(finalImageURL, { headers: event.request.headers })
    );
  }
});