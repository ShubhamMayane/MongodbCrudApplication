const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");


const app =express();

// app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());


//creating a structure of a document 
    const studentSchema=new mongoose.Schema({
        firstName:String,
        lastName:String,
        division:String,
        age:Number,
        city:String,
    });

//now lets say a computetr that varil schema aseleli documents "personalInfo" ya colllection madhe store hotil
//or aapan asa mhanu shakato ki personalInfo ya collection madhe varil schema che documents store kele jatil

const personalInfoModel=mongoose.model("personalInfo",studentSchema);




//to run this server application on 3000 port

app.listen(3000,function(){
      
    console.log("Server is running on port 3000");
    //exstablish a connection to the mongodb database

    mongoose.connect("mongodb://localhost:27017/studentDatabase");
    


});



app.get("/",function(req,res){

     res.send("Jay Ganesh :Serve Application is running");
    //res.sendFile(__dirname+"/index.html");

});


//Insert document into collection
app.post("/insertStudent",function(req,res){

console.log("inside post function call statement");

console.log(req.body);


let inputData={
        firstName:req.body.fname,
        lastName:req.body.lname,
        division:req.body.division,
        age:req.body.age,
        city:req.body.city
    };

console.log(inputData);


//now lets store above json object ie.document in personalInfo collection

try {

    const document=new personalInfoModel(inputData);
    document.save();
    
    res.send("Successfully inserted student");
  }
  catch(err) 
  {
   res.send("Failed to insert Student");
  }

});



//read all documents from collection

app.get("/getAllStudents",function(req,res){

    personalInfoModel.find({}).then(function(data){
        console.log(data)
        res.send(data);

    }).catch(function(err){
        console.log(err);
        res.send("Unable to read data");
    })

});



//update document from collection where _id=="something" set age=something and divison=something

app.put("/updateStudent/:id",function(req,res){

    console.log("inside put function call");

    console.log(req.body);
    let docId=req.params.id;

    personalInfoModel.updateOne({_id:docId},{$set:{age:req.body.age,division:req.body.divison}}).then(function(){
        
        res.send("successfully updated");

    }).catch(function(err){
        console.log(err);
        res.send("Unable to update data");
    })

});



//delete document from collection where _id=="something"

app.delete("/deleteStudent/:id",async function(req,res){

    console.log("inside delete function call");

    
    let docId=req.params.id;


    try {

        let status= await personalInfoModel.deleteOne({_id:docId});

        if(status.deletedCount==0)
        {
            console.log("No document found with this id");
            res.send("No document found with this id");
        }
        else if(status.deletedCount>0)
        {   
            console.log("document is deleted successfully");
            res.send("document with this id is deleted successfully");
    
        }
        

    } catch (error) {
    
            console.log(err);
            res.send("Unable to delete document");

    }
 


});