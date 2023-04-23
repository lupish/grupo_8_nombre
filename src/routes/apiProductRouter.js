const express = require('express');
const router = express.Router();
const validar = require('../modulos/validaciones/validacionesProducto');
const multerExport = require('../modulos/multer')

module.exports = router;

// CONTROLLER
const productController = require('../controllers/apiProductController');

// RUTAS
router.get('/', productController.listAllProducts);
router.get('/listProductsByLifeStyle/:estiloVidaId', productController.listProductsByLifeStyle);
router.get('/:id', productController.detail);

// crear
router.post(
    '/create'
    ,multerExport("prod_fotos", 'products', 'array')
    ,validar('prod_nombre', 'prod_categoria', 'prod_estilosVida', 'prod_marca', 'prod_precio', 'prod_descripcion_corta', 'prod_descripcion_larga', 'prod_fotos')
    ,productController.processCreate
);

// editar
router.put(
    '/edit/:id'
    ,multerExport("prod_fotos", 'products', 'array')
    ,validar('prod_nombre', 'prod_categoria', 'prod_estilosVida', 'prod_marca', 'prod_precio', 'prod_descripcion_corta', 'prod_descripcion_larga', 'prod_fotos')
    ,productController.processEdit
);

// borrar
router.delete('/delete/:id', productController.processDelete);

// activar
router.patch('/activate/:id', productController.processActivate);

