var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var feed,lastFeed;
var hour;
var feedTime;
var foodT;


//create feed and lastFed variable here


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  feed = createButton("Feed the Dog");
  feed.position(900,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);



}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  feedTime = database.ref('FeedTime');
  feedTime.on("value",readHour);
 
  drawSprites();

  //write code to display text lastFed time here
  textSize(20);
  fill("orange");
  if(foodT>=13 ){
    text("Last Feed : " + foodT%12 + " P.M.",400,45);
  }
  else if(foodT>=12 && foodT < 13){
    text("Last Feed : 12 P.M.",400,45);
  }
  else if(foodT===0){
    text("Last Feed : 12 A.M.",400,45);
  }
  else{
    text("Last Feed : " + foodT + " A.M.",400,45);
  }
  if(foodS <=0){
    fill("blue");
    text("No more food available",100,45);
    text("Add right now by clicking on Add Food button",100,100);
  }
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  getHour();

  //write code here to update food stock and last fed time
  food_stock = foodObj.getFoodStock()
  if(food_stock<=0){
  foodObj.updateFoodStock(food_stock*0);
  }
  else{
    foodObj.updateFoodStock(food_stock-1);
  }
   if(foodS <=0){
     foodS = foodS*0;
   }
   else{
   foodS = foodS-1;
   }
   database.ref('/').update({
     'Food' : foodS
   })
  
   database.ref('/').update({
     'FeedTime': hour
   })
  }

//function to add food in stock
function addFoods(){

  foodS++;
  database.ref('/').update({
    Food:foodS
  })


}

function readHour(data){
  foodT = data.val();
}
async function getHour(){
  var response = await fetch("https://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var responseJson = await response.json();
  var datetime = responseJson.datetime;
  hour = datetime.slice(11,13);
}
