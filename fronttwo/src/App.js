import React from 'react';
import './App.css';

const IMG_QUERY = `
{
  feed {
    id
  	imgname
    location
  	size
    format
    md5sum  
  }
}
`

function App() {
  const imgs = GetImgInfo()

  return (
    <div class="all-box">
      <div div class="ligth-title">Image scanner</div>
      <div class="title-box grid">
          <div>Name</div>
          <div>Size</div>
          <div>Format/Ext </div>
          <div>Location </div>
          <div>md5sum </div>
        </div>
      {/* {JSON.stringify(imgs, null, 2)} */}
      {imgs.map(img => (
        <div class="around-box grid" key={img.id}>
          <div>{img.imgname} </div>
          <div>{img.size}</div>
          <div>{img.format} </div>
          <div>{img.location} </div>
          <div>{img.md5sum} </div>
        </div>
      ))}
      
    </div>
  );
}

export default App;



//fetch the data from server
function GetImgInfo() {
  const [imgs, setImgs] = React.useState([]);

  React.useEffect(() => {
    fetch('http://localhost:4000/', {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ query: IMG_QUERY })
    }).then(response => response.json())
    .then(data => setImgs(data.data.feed))
  }, []);

  return imgs
}
