var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);

describe('Exercicio A', function(){
    var date = new Date();
    const d = date.toISOString();
    var idUsuario;
    var pet = {
        id: 0,
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

    it('1- Crie a usuario Maria Assuncao', function(done){

        var userRequest = {
            "id": 0,
            "username": "maria",
            "firstName": "Maria",
            "lastName": "Assunção",
            "email": "maria@mail.com",
            "password": "123456",
            "phone": "123456",
            "userStatus": 0
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

    it('2- Crie o pet Brutus(dog)', function(done){
        var petRequest = {
            "id": 1,
            "category": {
              "id": 0,
              "name": "dog"
            },
            "name": "Brutus",
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

    it('3- Faca a venda do Brutus para a Maria Assuncao', function(done){         
        var orderRequest = {
            "id": pedido.id,
            "petId": pet.id,
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

            pet.id = res.body.petId;
            pedido.id = res.body.id;
            pedido.shipDate = res.body.shipDate;
            pedido.status = res.body.status;
            
            done();            
        }); 
    });

    it('4- Mude o status da venda de Brutus para "delivered"', function(done){
        var petupdate = 'name=Brutus&status=delivered';

        chai.request('https://petstore.swagger.io/')
        .post('v2/pet/1?name=Brutus&status=delivered')
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

    it('5- Consulte a ordem gerada e valide se está correta', function(done){
        chai.request('https://petstore.swagger.io/')
        .get('v2/store/order/1')
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
            res.body.petId.should.be.equal(pet.id);
            res.body.quantity.should.be.equal(pedido.quantity);               
            res.body.shipDate.should.be.equal(pedido.shipDate);   
            res.body.status.should.be.equal(pedido.status);   
            res.body.complete.should.be.equal(pedido.complete);
            
            done();            
        });
    });

});