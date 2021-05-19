var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);

var usuarios = require('./usuarios.json');
var pets = require('./pets.json');

var date = new Date();
const d = date.toISOString();

describe('Exercicio B', function(){
    
    var idUsuario;

    var pet = {
        id: 1,
        name: "",
        status: ""
    };

    var petCat = {
        id: 6,
        name: "",
        status: ""
    };

    var pedido = {
        id: 1,
        petId: pet.id,
        quantity: 1,
        shipDate: d,
        status: "placed",        
        complete: true
    };

    var pedidoCat = {
        id: 6,
        petId: petCat.id,
        quantity: 1,
        shipDate: d,
        status: "placed",        
        complete: true
    };
    usuarios.forEach(function(user, index) {
        it('1- Crie a usuario '+user['username'], function(done){
            console.log('-----------------------------------------------------------------------------------------');
            var userRequest = {
                "id": user['id'],
                "username": user['username'],
                "firstName": user['firstName'],
                "lastName": user['lastName'],
                "email": user['email'],
                "password": user['password'],
                "phone": user['phone'],
                "userStatus": user['userStatus']
            }
    
            chai.request('https://petstore.swagger.io/')
            .post('v2/user')
            .send(userRequest)
            .end(function (err, res){
                res.should.have.status(200);
                res.body.should.have.property('code');
                res.body.should.have.property('type');
                res.body.should.have.property('message');
                
                
                res.body.code.should.be.equal(200);
    
                idUsuario = res.body.message;            
                done();
    
                
            });        
        });
    
        it('2- Crie o pet '+pets[index]['name']+'(dog)', function(done){
            var petRequest = {
                "id": pets[index]['id'],
                "category": {
                  "id": 0,
                  "name": "dog"
                },
                "name": pets[index]['name'],
                "photoUrls": [
                  "string"
                ],
                "tags": [
                  {
                    "id": 0,
                    "name": "string"
                  }
                ],
                "status": "available"
              }
    
            chai.request('https://petstore.swagger.io/')
            .post('v2/pet')
            .send(petRequest)
            .end(function (err, res){
                res.should.have.status(200);
                res.body.should.have.property('id');
                res.body.should.have.property('name');
                res.body.should.have.property('status');
                                
                pet.id = res.body.id;
                pet.name = res.body.name;
                pet.status = res.body.status;
                done();            
            }); 
        });

        it('3- Crie o pet '+pets[index+5]['name']+'(cat)', function(done){
            var petRequest = {
                "id": pets[index+5]['id'],
                "category": {
                  "id": 2,
                  "name": "cat"
                },
                "name": pets[index+5]['name'],
                "photoUrls": [
                  "string"
                ],
                "tags": [
                  {
                    "id": 0,
                    "name": "string"
                  }
                ],
                "status": "available"
              }
    
            chai.request('https://petstore.swagger.io/')
            .post('v2/pet')
            .send(petRequest)
            .end(function (err, res){
                res.should.have.status(200);
                res.body.should.have.property('id');
                res.body.should.have.property('name');
                res.body.should.have.property('status');
                                
                petCat.id = res.body.id;
                petCat.name = res.body.name;
                petCat.status = res.body.status;
                done();            
            }); 
        });

        it('4- Faca a venda do dog '+pets[index]['name']+' para '+user['username']+" "+user['lastName'], function(done){         
            var orderRequest = {
                "id": pets[index]['id'],
                "petId": pets[index]['id'],
                "quantity": pedido.quantity,
                "shipDate": pedido.shipDate,
                "status": pedido.status,
                "complete": pedido.complete
              }
    
            chai.request('https://petstore.swagger.io/')
            .post('v2/store/order')
            .send(orderRequest)
            .end(function (err, res){
                res.should.have.status(200);
                res.body.should.have.property('id');
                res.body.should.have.property('petId');
                res.body.should.have.property('quantity');
                res.body.should.have.property('shipDate');
                res.body.should.have.property('status');
                res.body.should.have.property('complete');
                
                res.body.complete.should.be.equal(true);    
                
                pedido.id = res.body.id;
                pedido.shipDate = res.body.shipDate;
                pedido.status = res.body.status;
                
                done();            
            }); 
        });
    
        it('5- Faca a venda do cat '+pets[index+5]['name']+' para '+user['username']+" "+user['lastName'], function(done){         
            var orderRequest = {
                "id": pets[index+5]['id'],
                "petId": pets[index+5]['id'],
                "quantity": pedidoCat.quantity,
                "shipDate": pedidoCat.shipDate,
                "status": pedidoCat.status,
                "complete": pedidoCat.complete
              }
    
            chai.request('https://petstore.swagger.io/')
            .post('v2/store/order')
            .send(orderRequest)
            .end(function (err, res){
                res.should.have.status(200);
                res.body.should.have.property('id');
                res.body.should.have.property('petId');
                res.body.should.have.property('quantity');
                res.body.should.have.property('shipDate');
                res.body.should.have.property('status');
                res.body.should.have.property('complete');
                
                res.body.complete.should.be.equal(true);                
                pedidoCat.id = res.body.id;
                pedidoCat.shipDate = res.body.shipDate;
                pedidoCat.status = res.body.status;
                
                done();            
            }); 
        });

        it('6- Mude o status da venda do dog '+pets[index]['name']+' para "delivered"', function(done){         
    
            chai.request('https://petstore.swagger.io/')
            .post('v2/pet/'+pets[index]['id']+'?name='+pets[index]['name']+'&status=delivered')
            .send()
            .end(function (err, res){
                res.should.have.status(200);
                
                res.body.should.have.property('code');
                res.body.should.have.property('type');
                res.body.should.have.property('message');
    
                pedido.id = res.body.message;
                done();            
            }); 
        });

        it('7- Mude o status da venda do cat '+pets[index+5]['name']+' para "delivered"', function(done){         
    
            chai.request('https://petstore.swagger.io/')
            .post('v2/pet/'+pets[index+5]['id']+'?name='+pets[index+5]['name']+'&status=delivered')
            .send()
            .end(function (err, res){
                res.should.have.status(200);
                
                res.body.should.have.property('code');
                res.body.should.have.property('type');
                res.body.should.have.property('message');
    
                pedidoCat.id = res.body.message;
                done();            
            }); 
        });
    
        it('8- Consulta para validar se a order do dog '+pets[index]['name']+' está correta', function(done){
            chai.request('https://petstore.swagger.io/')
            .get('v2/store/order/'+pet.id.toString())
            .send()
            .end(function (err, res){
                res.should.have.status(200);
                res.body.should.have.property('id');
                res.body.should.have.property('petId');
                res.body.should.have.property('quantity');
                res.body.should.have.property('shipDate');
                res.body.should.have.property('status');
                res.body.should.have.property('complete');
                
                res.body.id.toString().should.be.equal(pedido.id.toString());                           
                res.body.quantity.should.be.equal(pedido.quantity);
                res.body.status.should.be.equal(pedido.status);   
                res.body.complete.should.be.equal(pedido.complete);
                
                done();            
            });
        }); 

        it('9- Consulta para validar se a order do cat '+pets[index+5]['name']+' está correta', function(done){
            chai.request('https://petstore.swagger.io/')
            .get('v2/store/order/'+petCat.id.toString())
            .send()
            .end(function (err, res){                
                res.should.have.status(200);
                res.body.should.have.property('id');
                res.body.should.have.property('petId');
                res.body.should.have.property('quantity');
                res.body.should.have.property('shipDate');
                res.body.should.have.property('status');
                res.body.should.have.property('complete');
                
                res.body.id.toString().should.be.equal(pedidoCat.id.toString());                           
                res.body.quantity.should.be.equal(pedidoCat.quantity);
                res.body.status.should.be.equal(pedidoCat.status);   
                res.body.complete.should.be.equal(pedidoCat.complete);
                
                done();            
            });
        }); 
    });
});