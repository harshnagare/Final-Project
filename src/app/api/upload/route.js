// import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
// import uniqid from 'uniqid';

// export async function POST(req) {
//   const data =  await req.formData();
//   if (data.get('file')) {
//     // upload the file
//     const file = data.get('file');

//     const s3Client = new S3Client({
//       region: 'us-east-1',
//       credentials: {
//         accessKeyId: process.env.MY_AWS_ACCESS_KEY,
//         secretAccessKey: process.env.MY_AWS_SECRET_KEY,
//       },
//     });

//     const ext = file.name.split('.').slice(-1)[0];
//     const newFileName = uniqid() + '.' + ext;

//     const chunks = [];
//     for await (const chunk of file.stream()) {
//       chunks.push(chunk);
//     }
//     const buffer = Buffer.concat(chunks);

//     const bucket = 'dawid-food-ordering';
//     await s3Client.send(new PutObjectCommand({
//       Bucket: bucket,
//       Key: newFileName,
//       ACL: 'public-read',
//       ContentType: file.type,
//       Body: buffer,
//     }));


//     const link = 'https://'+bucket+'.s3.amazonaws.com/'+newFileName;
//     return Response.json(link);
//   }
//   return Response.json(true);
// }

  import fs from 'fs'; 
  import path from 'path';

  export async function POST(req) {
    const data = await req.formData();
    const file = data.get('file');
    console.log("********Got file:", file);

    const uploadDir = path.join(process.cwd(), '/public/uploads');
    // const uploadDir = path.join(__dirname, '../../public/uploads');
    console.log(uploadDir);

    const ext = file.name.split('.').slice(-1)[0];
    const newFileName = Date.now() + '.' + ext;
    

    const filePath = path.join(uploadDir, newFileName);
    // console.log("********Got filepath:",filePath);
    // Save the file to the server
    const reader = file.stream().getReader();
    const writer = fs.createWriteStream(filePath);
    const link = `/uploads/${newFileName}`;
    // console.log("********Got link:",link);
    const pump = async () => { 
      const { done, value } = await reader.read();
      if (done) {
        // console.log("********Inside DONE");
        writer.end();
        return;
      }
      if(value) writer.write(value);
      return pump(); 
    };
    await pump();
    return Response.json({link});  
    // return Response.json(true); 
  }




