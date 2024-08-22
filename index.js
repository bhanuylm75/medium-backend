import express from "express"
import Jwt from "jsonwebtoken"
import cors from "cors"
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const app = express();
import path from 'path';

app.use(express.json())
app.use(cors())

app.get("/"  (req,res)=>{
  res.send("hello")
  
}
       )


app.post("/api/signup", async (req, res)=>{
  const body=req.body
  console.log(body)
  try{
    const user= await prisma.Userr.create({
      data:{
       name: body.name,
       password:body.password,
       email:body.email
      }
      })
      const token=Jwt.sign({ user}, "monkey", {
        expiresIn: "30d",
      })
      res.json({"token":token,"userid":user.id})
  }
  catch(e){
    console.log(e);
    res.status(411);
    res.send('Invalid')

  }

 
});


app.post("/api/signin", async (req, res)=>{
  const body =req.body
  console.log(body)
  try{
    const user = await prisma.Userr.findFirst({
      where: {
        email: body.email,
        password: body.password,
      }
    })

    if (!user) {
      res.status(403);
      return res.json({
        message: "Incorrect creds"
      })
    }
    const token=Jwt.sign({ user}, "monkey", {
      expiresIn: "30d",
    })
    res.json({"token":token,"userid":user.id})
    
  }
  catch(e){
    console.log(e);
    res.send('Invalid')

  }

});

app.get("/api/getallblogs/", async (req,res)=>{
  try{
    const blogs = await prisma.Blog.findMany({
      select: {
        content: true,
        title: true,
        id: true,
        author: {
            select: {
                name: true
            }
        }
    }
    })
    return res.json({
      blogs
  })

  }
  catch(e){

  }

})

app.post("/api/createblog/", async (req,res)=>{
  const body=req.body
  console.log(body)
  try{
    const blog = await prisma.Blog.create({
      data: {
          title: "first",
          content: "test",
          authorId: 1
      }
  })

  return res.json({
      id: blog.id
  })

  }
  catch(e){
    console.log(e)

  }

})

app.get("/api/singleblog/:id", async (req,res)=>{
  const id=req.params.id
  console.log(id)
  try{
    const blog=await prisma.Blog.findFirst({
      where :{
        id:Number(id)
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
            select: {
                name: true
            }
        }
    }
    })
    res.json(blog)

  }
  catch(e){
    console.log(e)

  }

})

app.put("/api/updateblog/" ,async (req,res)=>{
  const body =req.body
  console.log(body)
  try{
    const blog = await prisma.Blog.update({
      where: {
          id: Number(body.id)
      }, 
      data: {
          title: body.title,
          content: body.description
      }
  })

  return res.json({
      blog
  })

  }
  catch(e){
    console.log(e)

  }

})


app.delete("/api/delete/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id)

  try {
    const like = await prisma.Blog.delete({
      where:{
        id: Number(id),
      }
    });
    res.status(200).json({ message: ' deleted successfully', like });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting' });
  }
});






app.listen(3008,()=>{
  console.log("server started")
})





