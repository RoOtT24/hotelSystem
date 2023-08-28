import {Client} from "@googlemaps/google-maps-services-js";

export const googleMap= (lat=0, lng=0, zoom=8)=>{
    const client = new Client({});
    return client
  .elevation({
    params: {
      locations: [{ lat, lng }],
      key: process.env.GOOGLE_API_KEY,
      zoom
    },
    timeout: 1000, // milliseconds
  })
  .then((r) => 
    r.data.results[0].elevation)
  .catch((e) => {
    console.log(e.response.data.error_message);
  });
}
