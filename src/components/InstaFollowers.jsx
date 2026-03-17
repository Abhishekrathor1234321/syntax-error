import { useEffect, useState } from "react";

function InstaFollowers() {

  const [followers,setFollowers] = useState("");

  useEffect(() => {

    fetch("https://instagram-scraper-api2.p.rapidapi.com/v1/info?username_or_id_or_url=code.abhii07", {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "YOUR_API_KEY",
        "X-RapidAPI-Host": "instagram-scraper-api2.p.rapidapi.com"
      }
    })
    .then(res => res.json())
    .then(data => {
      setFollowers(data.data.follower_count);
    });

  }, []);

  return (
    <div>
      <h2>{followers}</h2>
      <p>Instagram Followers</p>
    </div>
  );
}

export default InstaFollowers;