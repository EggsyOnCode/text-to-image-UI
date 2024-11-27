import React, { useState } from "react";
import axios from "axios";

const API_URL =
  "https://apigateway-model-au7qud5e.ue.gateway.dev/generate-image";

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setImage(null);

    if (!prompt) {
      setError("Prompt is required");
      return;
    }

    setLoading(true);
    try {
      console.log("hello");

      const response = await axios.post(
        API_URL,
        {
          prompt: prompt,
          num_inference_steps: 4,
          width: 512,
          height: 512,
        },
        {
          headers: {
            "x-api-key": process.env.REACT_APP_API_ENV,
          },
        }
      );

      console.log(response);

      if (response.data && response.data.image_base64) {
        setImage(`data:image/jpeg;base64,${response.data.image_base64}`);
      } else {
        setError("Failed to generate the image. ");
      }
    } catch (err) {
      setError("Error generating the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1>Text-to-Image Converter</h1>
      <form onSubmit={handleSubmit} style={{ margin: "20px 0" }}>
        <input
          type="text"
          placeholder="Enter your prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{
            padding: "10px",
            width: "80%",
            maxWidth: "500px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            marginLeft: "10px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Submit
        </button>
      </form>

      {loading && <p>Generating image...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {image && (
        <div>
          <h3>Generated Image:</h3>
          <img
            src={image}
            alt="Generated"
            style={{ maxWidth: "100%", marginTop: "20px" }}
          />
        </div>
      )}
    </div>
  );
};

export default App;
