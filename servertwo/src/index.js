const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');

require('dotenv').config()
const imgFolder = process.env.IMG_FOLDER;

function scannFolder(){
    let i = 0;
    let scanned = []
    fs.readdir(imgFolder, (err, files) => {

        files.forEach(file => {
            const stat = fs.statSync(imgFolder+'/'+file);
            const ext = path.extname(file).toLowerCase();
            const rp = path.resolve(imgFolder+'/'+file)
            const filelocation = rp.replace(path.basename(file),'')


            if (ext == ".jpg" || ext == ".jpeg" || ext == ".png" || ext == ".gif" 
                || ext == ".svg" || ext == ".tif" || ext == ".tiff"  || ext == ".eps") {
                scanned.push({
                    id: 'img-'+i,
                    imgname: file,
                    location: filelocation,
                    size: (stat.size/1000000.0).toFixed(2)+' Mb',
                    format: ext.substring(1,ext.length).toUpperCase(),
                    md5sum: '( md5sum )'
                  });
                  i++;
            }

          
        });
        
      })
    
    return scanned  
}



// let imgs = [{
//     id: 'img-0',
//     imgname: 'Dummyimg.jpg',
//     location: 'Dummy location',
//     size: 'Dummy size',
//     format: 'Dummy format',
//     md5sum: 'Dummy md5sum'
//   },
//   {
//     id: 'img-1',
//     imgname: 'Dummyimg1.jpg',
//     location: 'Dummy location1',
//     size: 'Dummy size1',
//     format: 'Dummy format1',
//     md5sum: 'Dummy md5sum1'
//   }]


  let imgs = scannFolder()
  
  
  const resolvers = {
    Query: {
      info: () => `This is server`,
      feed: () => imgs,
    },
    Mutation: {
      post: (parent, args) => {
    
      let idCount = imgs.length
  
         const img = {
          id: `img-${idCount++}`,
          imgname: args.imgname,
          location: args.location,
          size: args.size,
          format: args.format,
          md5sum: args.md5sum,
        }
        imgs.push(img)
        return img
      }
    },
  }
  

// the schema and resolvers are bundled and passed to ApolloServer
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
      path.join(__dirname, 'schema.graphql'),
      'utf8'
    ),
    resolvers,
  })

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );
