const request =require('request')
const geocode= require('./utils/geocode')
const forecast= require('./utils/forecast')

const path=require('path')
const express =require('express')
const hbs = require('hbs')


const app = express()

//define path for express config
const publicDirectoryPath = path.join(__dirname,'../public')
const templateDirectoryPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

//setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views',templateDirectoryPath)
hbs.registerPartials(partialsPath)



//setup static directory to serve
app.use(express.static(publicDirectoryPath))



app.get('',(req,res)=>{
    res.render('index',{
        title: 'Weather app',
        name: 'Ritam and Amit'
    })
    
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title: 'About',
        name: 'Ritam and Amit'
    })
})

app.get('/help',(req,res)=>{
    res.render('help',{
        title: 'Help',
        helpText:'This is a help page',
        name: 'Ritam and Amit'
    })
})

app.get('/weather',(req,res)=>{
    if(!req.query.address){
        return res.send({
            error: "please provide address"
        })
    }
    geocode(req.query.address,(error,{latitude,longitude,location}={})=> {
        if(error){
            return res.send({error})
         }
         forecast(latitude,longitude,(error,forecastdata)=>{
            if(error){
                return res.send({error})
             }
             res.send({
                 forecast:forecastdata,
                 location,
                 address:req.query.address
             })
            })
    
    })


})


app.get('/help/*',(req,res)=>{
    res.render('404',{
        msg:'Help not found'
    })
    
})

app.get('*',(req,res)=>{
    res.render('404',{
        msg:'Page not found'
    })
    
})






app.listen(3000,() =>{
    console.log('Server is up on port 3000')
}
)