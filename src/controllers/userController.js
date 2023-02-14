const path = require('path')
const fs = require('fs');
const { check, body } = require('express-validator');
const { softDelete } = require('./productController');
const { validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const { ResultWithContext } = require('express-validator/src/chain');

//GUARDAR
// const usersJSON = path.join(__dirname,'../data/usersDB.json');
// let usuarios = JSON.parse(fs.readFileSync(usersJSON, 'utf-8'));

//bd users
const usersJSON = path.join(__dirname, '../data/usersDB.json');
let users;
if(usersJSON==""){
users = []
}else {
users = JSON.parse(fs.readFileSync(usersJSON, 'utf-8'))
}

//crar cuenta
function createAcount(userId, req){
    //imagen de usuario
    let imgUser = "user-default.webp";
    let altUser = "Usuario sin imagen";
    if (req.file) {
        imgUser = req.file.filename;
        altUser = req.file.originalname;
    }
    
    //crear usuario
    let usuario = {
        id: userId, 
        nombre: req.body.nombre,
        email: req.body.email,
        contrasenia: bcryptjs.hashSync(req.body.contrasenia, 10),       
        img: imgUser,
        alt: altUser,
        
        delete: false
    }
    return usuario
}

//controlador
const controller = {
    login: (req, res) => {
        if (req.session.usuarioLogueado) {
            return res.redirect('/')
        }

        res.render('users/login')
    },
    processLogin: (req, res) => {
        console.log("processLogin 1")
        if (!req.session.usuarioLogueado) {
            console.log("processLogin")
            let usuario = users.find(elem => elem.email == req.body.email && !elem.delete);
            
            console.log(usuario)
            if (usuario) {
                console.log("va la pass")
                console.log(req.body.contrasenia)
                if (!bcryptjs.compareSync(req.body.contrasenia, usuario.contrasenia)) {
                    let contraseniaMal = {
                        contrasenia: {
                            msg: "La contraseña no es correcta, si desea cambiarla haga clic en Olvidé mi contraseña"
                        }  
                    }
                    return res.render('users/login', { errors: contraseniaMal, oldData: req.body })
                }
                req.session.usuarioLogueado = usuario;

                if (req.body.recordar_usuario) {
                    console.log("Guardar cookie")
                    res.cookie('email', req.body.email, {maxAge: 600*1000});                 
                }
            } else {
                let emailNoExiste = {
                    email: {
                        msg: "No existe un usuario con el mail seleccionado"
                    }  
                }
                return res.render('users/login', {errors: emailNoExiste, oldData: req.body })
            }
        }

        res.redirect('/');
    },
    register: (req, res) => {
        if (req.session.usuarioLogueado) {
            return res.redirect('/')
        }

        res.render('users/register')
    },
    processCreate: (req, res) => {
        if (req.session.usuarioLogueado) {
            return res.redirect('/')
        }

        const valRes = validationResult(req)

        if (valRes.errors.length > 0) {
            return res.render('users/register', { errors: valRes.mapped(), oldData: req.body })
        }

       // CHEQUEAR CAMPOS
       console.log(users.find(elem => elem.email == req.body.email))
        // chequear que usuario no existe
        if (!users.find(elem => elem.email == req.body.email)) {
            // chequear que las pass coindicen
            if (req.body.contrasenia == req.body.confirmarContrasenia) {
                let userId = 1;
                if (users.length > 0) {
                    userId = users[users.length-1].id + 1;
                }

                let usuario = createAcount(userId, req)
                users.push(usuario);
                usuariosJSON = JSON.stringify(users, null, 2);
                fs.writeFileSync(usersJSON, usuariosJSON);
            
                res.redirect('/');
            } else {
                let contraseniaDistinta = {
                    contrasenia: {
                        msg: "La contraseña ingresada no coincide con la confirmación de la misma"
                    }  
                }
                return res.render('users/register', {errors: contraseniaDistinta, oldData: req.body })
            }
        } else {
            let mailRepetido = {
                email: {
                    msg: "Ya existe un usuario con el mail ingresado"
                }  
            }
            return res.render('users/register', {errors: mailRepetido, oldData: req.body })
        }
    },
    userDetail: (req, res) => {
        let user = users.find(elem => elem.id == req.params.id && elem.delete==false);
        if (user){
            res.render('users/userDetail', {user:user})
        }else{
            return res.redirect('/products/product-not-found');
        }
    },
    edit: (req, res)=>{
        let user = users.find(elem=>elem.id==req.params.id);
        if (user){
            res.render('users/edit',{user:user})
        }else{
            return res.redirect('/products/product-not-found');
        }
    },
    processEdit: (req, res)=>{
        let userId = users[users.length-1].id + 1;
        let usuario = createAcount(userId, req);
        users.forEach(elem=>{
            if (elem.id == id){
                elem.roles = usuario.roles;
            }
        });
        fs.writeFileSync(usersJSON, JSON.stringify(users, null, 2))
        return  res.redirect('/users/userDetail')
    },
    softDelete: (req, res)=>{
        let id = req.params.id;
    
        users.forEach(elem=>{
            if(elem.id == id){
                elem.delete=true;
            }
        });
        fs.writeFileSync(usersJSON, JSON.stringify(users, null, 2));
        return res.redirect('/users/manageUsers');
    },
    hardDelete: (req, res)=>{
        let id = req.params.id;

        let usersNotDelete = users.filter(row=>{return row.id != id});

        fs.writeFileSync(usersJSON, JSON.stringify(usersNotDelete, null, 2));
        return res.redirect('/users/manageUsers/');
    },
   
    processActivate: (req, res) => {
        let id = req.params.id;
        users.forEach(elem=>{
            if(elem.id==id){
                elem.delete=false;
            }
        });
        fs.writeFileSync(usersJSON, JSON.stringify(users, null, 2));
        return res.redirect('/users/manageUsers/');
    }
 
}


module.exports = controller;