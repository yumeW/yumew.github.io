const express = require ('express');
const app = express ();
const server = require  ('http').createServer(app);
const io = require ('socket.io')(server);

let path = require ('path');

app.use (express.static ('public'));


io.on ('connection', (socket)=> {
    socket.emit ("welcome", socket.id );
    socket.broadcast.emit ("observers", socket.client.conn.server.clientsCount );
  
    
    console.log ('newConnection: '+socket.id)

    socket.on ('eyeTrail', eyeTrailMsg)
    function eyeTrailMsg (data){
        socket.broadcast.emit ('eyeTrail',data)
    //differnt way - global 
    //io.sockets.emit ('eyeTrail',data)
        console.log (data);
        console.log ("insideEyeTrail")

    }





    socket.on ('disconnect', ()=> {
        console.log ('left: ' +socket.id);
        socket.broadcast.emit('observers', socket.client.conn.server.clientsCount);
        
       
    })
  
});






app.get ('/', function (req,res){
    res.sendFile (path.join (__dirname + '/views/index.html'));
});

server.listen (3000, ()=>{
    console.log ('app is listening on port' + server.address().port);
});



