import { useState } from "react";
import "./App.css";
import background from "./assets/dog_prints.png";

function App() {
  const [dogImage, setDogImage] = useState(null);
  const [dogInfo, setDogInfo] = useState(null);
  const [bannedDogs, setBannedDogs] = useState([]);

  const fetchRandomDog = async () => {
    try {
      const response = await fetch(
        "https://api.thedogapi.com/v1/images/search?has_breeds=1",
        {
          headers: {
            "x-api-key": "live_FiUVhHfHJtXe21H957Dlg5hPV07GXCmkZA42fhdBmxNQk5YCYPngyXSYeF3KWSlW", // Use your actual API key
          },
        }
      );
      const data = await response.json();

      if (data[0].breeds.length > 0) {
        const breed = data[0].breeds[0].name;
        if (bannedDogs.includes(breed)) {
          fetchRandomDog();
          return;
        }

        setDogImage(data[0].url);
        setDogInfo({
          name: breed,
          lifespan: data[0].breeds[0].life_span,
          bredFor: data[0].breeds[0].bred_for,
        });
      } else {
        setDogImage(null);
        setDogInfo(null);
      }
    } catch (error) {
      console.error("Error fetching the dog image:", error);
    }
  };

  const handleBanDog = (breed) => {
    setBannedDogs((prevBans) => [...prevBans, breed]);
    setDogInfo(null);
    fetchRandomDog(); 
  };

  const handleRemoveBan = (breed) => {
    setBannedDogs((prevBans) => prevBans.filter((dog) => dog !== breed));
  };
    
  return (
    <div
      style={{
        textAlign: "center",
        padding: "300px",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "steelblue",
      }}
    >
      <h1 style={{ fontSize: "72px" }}>Barkipedia</h1>
      <h2>Your go-to source for doggone good discoveries!</h2>
      <button
        style={{
          padding: "10px 20px",
          fontSize: "28px",
          cursor: "pointer",
          color: "steelblue",
        }}
        onClick={fetchRandomDog}
      >
        Discover a Random Dog Breed
      </button>

      {bannedDogs.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Banned Breeds:</h2>
          <ul>
            {bannedDogs.map((dog, index) => (
              <li
                key={index}
                className="banned-dog-list"
                onClick={() => handleRemoveBan(dog)} 
                style={{ cursor: "pointer", fontSize: "24px" }} 
              >
                {dog} (Click to Remove)
              </li>
            ))}
          </ul>
        </div>
      )}

      {dogImage && (
        <div style={{ marginTop: "20px" }}>
          <img
            src={dogImage}
            alt="Random Dog"
            style={{ width: "400px", borderRadius: "10px" }}
          />
        </div>
      )}

      {dogInfo && (
        <div style={{ marginTop: "20px" }}>
          <h2
            onClick={() => handleBanDog(dogInfo.name)}
            style={{ cursor: "pointer" }}
          >
            Breed: {dogInfo.name}
          </h2>
          <h2
            onClick={() => handleBanDog(dogInfo.name)}
            style={{ cursor: "pointer" }}
          >
            Lifespan: {dogInfo.lifespan}
          </h2>
          <h2
            onClick={() => handleBanDog(dogInfo.name)}
            style={{ cursor: "pointer" }}
          >
            Bred For: {dogInfo.bredFor || "Unknown"}
          </h2>
        </div>
      )}
    </div>
  );
}

export default App;
