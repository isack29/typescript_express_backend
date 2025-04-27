import { Router } from "express";
import {
  createProduct,
  deletProduct,
  getProductById,
  getProducts,
  updateAvailability,
  updateProduct,
} from "./handlers/product";
import { body, param } from "express-validator";
import { handleInputErrors } from "./middleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: El ID del producto
 *           example: 1
 *         name:
 *           type: string
 *           description: El nombre del producto
 *           example: Monitor Curvo
 *         price:
 *           type: number
 *           description: El precio del producto
 *           example: 12130
 *         availability:
 *           type: boolean
 *           description: Disponibilidad del producto
 *           example: true
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtiene la lista de productos
 *     tags:
 *       - Products
 *     description: Retorna una lista de productos
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/", getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags:
 *       - Products
 *     description: Retorna un producto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del producto a obtener
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Respuesta correcta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: Producto no encontrado
 */
router.get(
  "/:id",
  param("id").isInt().withMessage("Id no válido"),
  handleInputErrors,
  getProductById
);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags:
 *       - Products
 *     description: Guarda un producto en bd y lo retorna
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Monitor Curvo"
 *               price:
 *                 type: number
 *                 example: 899
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Petición inválida
 */
router.post(
  "/",
  body("name")
    .notEmpty()
    .withMessage("El nombre del producto no puede ir vacío"),
  body("price")
    .isNumeric()
    .withMessage("Valor no válido")
    .notEmpty()
    .withMessage("El precio del producto no puede ir vacío")
    .custom((value) => value > 0)
    .withMessage("Precio no válido"),
  handleInputErrors,
  createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualiza un producto
 *     tags:
 *       - Products
 *     description: Retorna el producto actualizado
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del producto
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Monitor Curvo"
 *               price:
 *                 type: number
 *                 example: 899
 *               availability:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: Producto no encontrado
 */
router.put(
  "/:id",
  body("name")
    .notEmpty()
    .withMessage("El nombre del producto no puede ir vacío"),
  body("price")
    .isNumeric()
    .withMessage("Valor no válido")
    .notEmpty()
    .withMessage("El precio del producto no puede ir vacío")
    .custom((value) => value > 0)
    .withMessage("Precio no válido"),
  param("id").isInt().withMessage("Id no válido"),
  body("availability")
    .isBoolean()
    .withMessage("Valor para disponibilidad no válido"),
  handleInputErrors,
  updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Actualiza la disponibilidad de un producto
 *     tags:
 *       - Products
 *     description: Permite actualizar únicamente la disponibilidad de un producto existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del producto
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               availability:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Disponibilidad actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: Producto no encontrado
 */
router.patch(
  "/:id",
  param("id").isInt().withMessage("Id no válido"),
  handleInputErrors,
  updateAvailability
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Elimina un producto
 *     tags:
 *       - Products
 *     description: Elimina un producto existente por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del producto a eliminar
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: Producto no encontrado
 */
router.delete(
  "/:id",
  param("id").isInt().withMessage("Id no válido"),
  handleInputErrors,
  deletProduct
);

export default router;
