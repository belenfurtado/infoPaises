import axios from "axios";
import React from "react";

const baseURL= "https://restcountries.com/v3.1/";

export default function service() {
  const [post, setPost] = React.useState(null);

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setPost(response.data);
    });
  }, []);

  if (!post) return null;

  return (
    <div style={{marginLeft:'40%', marginTop: '60px'}}>
      <h3>Greetings from GeeksforGeeks!</h3>
      <Autocomplete
        options={post}
        style={{ width: 300 }}
        renderInput={(params) =>
          <TextField {...params} label="Combo box" variant="outlined" />}
      />
    </div>
  );
}